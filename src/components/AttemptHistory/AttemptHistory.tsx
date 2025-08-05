"use client";

import { useState, useMemo } from "react";
import {
  Stack,
  Title,
  Text,
  Group,
  Card,
  SimpleGrid,
  Badge,
  Select,
  Alert,
  Loader,
  Button,
  Divider,
} from "@mantine/core";
import {
  IconInfoCircle,
  IconTrophy,
  IconCalendar,
  IconChartBar,
  IconRefresh,
  IconSortDescending,
} from "@tabler/icons-react";
import { useUserAttempts } from "@/hooks/useUserAttempts";
import { AttemptCard } from "./AttemptCard";
import { AttemptDetailsModal } from "./AttemptDetailsModal";
import { Attempt } from "@/types/attempt";

interface AttemptHistoryProps {
  quizId: number;
  quizTitle: string;
}

type SortOption = "newest" | "oldest" | "highest-score" | "lowest-score";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "highest-score", label: "Highest Score" },
  { value: "lowest-score", label: "Lowest Score" },
] as const;

export function AttemptHistory({ quizId, quizTitle }: AttemptHistoryProps) {
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedAttemptId, setSelectedAttemptId] = useState<number | null>(
    null
  );
  const [modalOpened, setModalOpened] = useState(false);

  const {
    attempts,
    loading,
    error,
    isEmpty,
    hasData,
    bestAttempt,
    latestAttempt,
    averageScore,
    totalAttempts,
    refetch,
    clearError,
  } = useUserAttempts(quizId);

  const sortedAttempts = useMemo(() => {
    if (!hasData) return [];

    const sorted = [...attempts];

    switch (sortBy) {
      case "newest":
        return sorted.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "oldest":
        return sorted.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      case "highest-score":
        return sorted.sort((a, b) => b.score - a.score);
      case "lowest-score":
        return sorted.sort((a, b) => a.score - b.score);
      default:
        return sorted;
    }
  }, [attempts, sortBy, hasData]);

  const handleViewDetails = (attemptId: number) => {
    setSelectedAttemptId(attemptId);
    setModalOpened(true);
  };

  const handleCloseModal = () => {
    setModalOpened(false);
    setSelectedAttemptId(null);
  };

  const handleRetry = () => {
    clearError();
    refetch();
  };

  // Loading State
  if (loading) {
    return (
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text c="dimmed">Loading your attempt history...</Text>
        </Stack>
      </Card>
    );
  }

  // Error State
  if (error) {
    return (
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Alert
          icon={<IconInfoCircle size={16} />}
          title="Unable to load attempt history"
          color="red"
          variant="light"
        >
          <Text mb="md">{error}</Text>
          <Button variant="light" size="sm" onClick={handleRetry}>
            Try Again
          </Button>
        </Alert>
      </Card>
    );
  }

  // Empty State
  if (isEmpty) {
    return (
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Stack align="center" gap="md">
          <IconChartBar
            size={48}
            style={{ color: "var(--mantine-color-dimmed)" }}
          />
          <Stack gap="xs" align="center">
            <Title order={4} ta="center">
              No attempts yet
            </Title>
            <Text size="sm" c="dimmed" ta="center">
              You haven&apos;t taken this quiz yet. Start your first attempt to
              see your progress here.
            </Text>
          </Stack>
        </Stack>
      </Card>
    );
  }

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between" align="flex-start">
        <div>
          <Title order={3}>Your Attempt History</Title>
          <Text size="sm" c="dimmed">
            {quizTitle} • {totalAttempts} attempt
            {totalAttempts !== 1 ? "s" : ""}
          </Text>
        </div>
        <Button
          variant="light"
          size="sm"
          leftSection={<IconRefresh size={16} />}
          onClick={refetch}
        >
          Refresh
        </Button>
      </Group>

      {/* Statistics Summary */}
      {hasData && (
        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
          <Card shadow="xs" padding="md" radius="md" withBorder>
            <Stack gap="xs" align="center">
              <IconTrophy size={24} style={{ color: "gold" }} />
              <Text size="lg" fw={700}>
                {bestAttempt?.score || 0}
              </Text>
              <Text size="xs" c="dimmed" ta="center">
                Best Score
              </Text>
            </Stack>
          </Card>

          <Card shadow="xs" padding="md" radius="md" withBorder>
            <Stack gap="xs" align="center">
              <IconChartBar
                size={24}
                style={{ color: "var(--mantine-color-blue-6)" }}
              />
              <Text size="lg" fw={700}>
                {Math.round(averageScore)}
              </Text>
              <Text size="xs" c="dimmed" ta="center">
                Average Score
              </Text>
            </Stack>
          </Card>

          <Card shadow="xs" padding="md" radius="md" withBorder>
            <Stack gap="xs" align="center">
              <IconCalendar
                size={24}
                style={{ color: "var(--mantine-color-green-6)" }}
              />
              <Text size="lg" fw={700}>
                {totalAttempts}
              </Text>
              <Text size="xs" c="dimmed" ta="center">
                Total Attempts
              </Text>
            </Stack>
          </Card>

          <Card shadow="xs" padding="md" radius="md" withBorder>
            <Stack gap="xs" align="center">
              <IconSortDescending
                size={24}
                style={{ color: "var(--mantine-color-violet-6)" }}
              />
              <Text size="lg" fw={700}>
                #{latestAttempt?.attempt_number || 0}
              </Text>
              <Text size="xs" c="dimmed" ta="center">
                Latest Attempt
              </Text>
            </Stack>
          </Card>
        </SimpleGrid>
      )}

      <Divider />

      {/* Controls */}
      <Group justify="space-between" align="center">
        <Text fw={500}>
          Showing {sortedAttempts.length} attempt
          {sortedAttempts.length !== 1 ? "s" : ""}
        </Text>
      </Group>

      {/* Attempts List */}
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        {sortedAttempts.map((attempt, index) => (
          <AttemptCard
            key={attempt.id}
            attempt={attempt}
            rank={index + 1}
            isBest={bestAttempt?.id === attempt.id}
            isLatest={latestAttempt?.id === attempt.id}
            onViewDetails={handleViewDetails}
          />
        ))}
      </SimpleGrid>

      {/* Performance Insights */}
      {hasData && totalAttempts > 1 && (
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          style={{ backgroundColor: "var(--mantine-color-blue-0)" }}
        >
          <Stack gap="sm">
            <Group gap="xs">
              <IconInfoCircle
                size={16}
                style={{ color: "var(--mantine-color-blue-6)" }}
              />
              <Text fw={500} c="blue">
                Performance Insights
              </Text>
            </Group>
            <Text size="sm" c="dimmed">
              {bestAttempt &&
                latestAttempt &&
                bestAttempt.id !== latestAttempt.id &&
                (bestAttempt.score > latestAttempt.score
                  ? `Your best score (${bestAttempt.score}) is ${
                      bestAttempt.score - latestAttempt.score
                    } points higher than your latest attempt.`
                  : `Great progress! Your latest score improved by ${
                      latestAttempt.score - bestAttempt.score
                    } points.`)}
              {averageScore > 0 &&
                ` Your average score across all attempts is ${Math.round(
                  averageScore
                )} points.`}
            </Text>
          </Stack>
        </Card>
      )}

      {/* Attempt Details Modal */}
      {selectedAttemptId && (
        <AttemptDetailsModal
          opened={modalOpened}
          onClose={handleCloseModal}
          attemptId={selectedAttemptId}
          quizTitle={quizTitle}
        />
      )}
    </Stack>
  );
}
