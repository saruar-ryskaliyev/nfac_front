'use client';

import { useState, useEffect } from 'react';
import {
  Stack,
  Title,
  Text,
  Card,
  Group,
  Badge,
  Avatar,
  Table,
  Loader,
  Alert,
  Center,
  ThemeIcon,
  Skeleton,
  Paper,
} from '@mantine/core';
import {
  IconTrophy,
  IconMedal,
  IconAward,
  IconInfoCircle,
  IconCrown,
  IconUser,
  IconCalendar,
} from '@tabler/icons-react';
import { quizService } from '@/services/quiz';
import { LeaderboardData, LeaderboardEntry } from '@/types/quiz';

interface QuizLeaderboardProps {
  quizId: number;
}

export function QuizLeaderboard({ quizId }: QuizLeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await quizService.getLeaderboard(quizId);
        setLeaderboard(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [quizId]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <IconCrown size={20} color="gold" />;
      case 2:
        return <IconMedal size={20} color="silver" />;
      case 3:
        return <IconAward size={20} color="#CD7F32" />;
      default:
        return <IconTrophy size={16} color="gray" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'yellow';
      case 2:
        return 'gray';
      case 3:
        return 'orange';
      default:
        return 'blue';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Stack gap="lg">
        <Group gap="md">
          <Skeleton height={24} width={200} radius="sm" />
          <Skeleton height={20} circle />
        </Group>
        <Stack gap="md">
          {Array(5).fill(0).map((_, index) => (
            <Paper key={index} shadow="xs" p="md" radius="md" withBorder>
              <Group gap="md">
                <Skeleton height={40} circle />
                <Stack gap={4} style={{ flex: 1 }}>
                  <Skeleton height={16} width="60%" radius="sm" />
                  <Skeleton height={12} width="40%" radius="sm" />
                </Stack>
                <Skeleton height={24} width={60} radius="sm" />
              </Group>
            </Paper>
          ))}
        </Stack>
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert
        icon={<IconInfoCircle size={16} />}
        title="Error loading leaderboard"
        color="red"
        variant="light"
      >
        {error}
      </Alert>
    );
  }

  if (!leaderboard || !leaderboard.entries || leaderboard.entries.length === 0) {
    return (
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Center>
          <Stack align="center" gap="md">
            <ThemeIcon size="xl" variant="light" color="gray">
              <IconTrophy size={24} />
            </ThemeIcon>
            <Title order={3} c="dimmed">
              No Results Yet
            </Title>
            <Text size="sm" c="dimmed" ta="center">
              Be the first to complete this quiz and claim the top spot!
            </Text>
          </Stack>
        </Center>
      </Card>
    );
  }

  // Sort entries by score (descending) and then by finished_at (ascending for ties)
  const sortedEntries = [...leaderboard.entries].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return new Date(a.finished_at).getTime() - new Date(b.finished_at).getTime();
  });

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <Group gap="sm">
          <IconTrophy size={24} color="var(--mantine-color-blue-6)" />
          <Title order={2}>Leaderboard</Title>
        </Group>
        <Badge variant="light" size="lg">
          {sortedEntries.length} participants
        </Badge>
      </Group>

      {/* Top 3 Podium */}
      {sortedEntries.length >= 1 && (
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Group justify="center" gap="xl">
            {sortedEntries.slice(0, 3).map((entry, index) => {
              const rank = index + 1;
              return (
                <Stack key={entry.user_id} align="center" gap="xs">
                  <ThemeIcon
                    size="xl"
                    radius="xl"
                    variant="white"
                    color={getRankColor(rank)}
                  >
                    {getRankIcon(rank)}
                  </ThemeIcon>
                  <Text size="lg" fw={700} c="white">
                    {entry.username}
                  </Text>
                  <Badge variant="white" size="lg" fw={700}>
                    {entry.score} pts
                  </Badge>
                  <Text size="xs" c="white" opacity={0.8}>
                    {formatDate(entry.finished_at)}
                  </Text>
                </Stack>
              );
            })}
          </Group>
        </Card>
      )}

      {/* Full Rankings Table */}
      <Card shadow="sm" padding={0} radius="md" withBorder>
        <Table highlightOnHover striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Rank</Table.Th>
              <Table.Th>Player</Table.Th>
              <Table.Th ta="center">Score</Table.Th>
              <Table.Th ta="center">Attempt</Table.Th>
              <Table.Th ta="center">Completed</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedEntries.map((entry, index) => {
              const rank = index + 1;
              return (
                <Table.Tr key={`${entry.user_id}-${entry.attempt_number}`}>
                  <Table.Td>
                    <Group gap="xs">
                      <ThemeIcon
                        size="sm"
                        variant="light"
                        color={getRankColor(rank)}
                      >
                        {rank <= 3 ? getRankIcon(rank) : <Text size="xs" fw={700}>{rank}</Text>}
                      </ThemeIcon>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="md">
                      <Avatar
                        size="sm"
                        radius="xl"
                        color={getRankColor(rank)}
                      >
                        <IconUser size={16} />
                      </Avatar>
                      <Stack gap={2}>
                        <Text size="sm" fw={500}>
                          {entry.username}
                        </Text>
                        <Text size="xs" c="dimmed">
                          ID: {entry.user_id}
                        </Text>
                      </Stack>
                    </Group>
                  </Table.Td>
                  <Table.Td ta="center">
                    <Badge
                      variant={rank <= 3 ? 'filled' : 'light'}
                      color={getRankColor(rank)}
                      size="lg"
                    >
                      {entry.score}
                    </Badge>
                  </Table.Td>
                  <Table.Td ta="center">
                    <Badge variant="outline" size="sm">
                      #{entry.attempt_number}
                    </Badge>
                  </Table.Td>
                  <Table.Td ta="center">
                    <Group gap="xs" justify="center">
                      <IconCalendar size={12} color="gray" />
                      <Text size="xs" c="dimmed">
                        {formatDate(entry.finished_at)}
                      </Text>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Card>
    </Stack>
  );
}