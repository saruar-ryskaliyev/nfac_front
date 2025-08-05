'use client';

import { memo } from 'react';
import { Card, Group, Text, Badge, Stack, Progress, Button } from '@mantine/core';
import { IconCalendar, IconTrophy, IconClock, IconEye } from '@tabler/icons-react';
import { Attempt } from '@/types/attempt';

interface AttemptCardProps {
  attempt: Attempt;
  rank: number;
  isBest: boolean;
  isLatest: boolean;
  onViewDetails?: (attemptId: number) => void;
}

export const AttemptCard = memo(function AttemptCard({ 
  attempt, 
  rank, 
  isBest, 
  isLatest, 
  onViewDetails 
}: AttemptCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'yellow';
    if (score >= 40) return 'orange';
    return 'red';
  };

  const isCompleted = attempt.finished_at !== null;
  const scorePercentage = Math.round((attempt.score / 100) * 100); // Assuming score is out of 100

  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder
      style={{
        position: 'relative',
        border: isBest ? '2px solid gold' : isLatest ? '2px solid #228be6' : undefined
      }}
    >
      <Stack gap="md">
        {/* Header with badges */}
        <Group justify="space-between" align="flex-start">
          <Group gap="xs">
            <Badge variant="light" size="lg">
              Attempt #{attempt.attempt_number}
            </Badge>
            {isBest && (
              <Badge variant="filled" color="yellow" leftSection={<IconTrophy size={12} />}>
                Best Score
              </Badge>
            )}
            {isLatest && !isBest && (
              <Badge variant="filled" color="blue">
                Latest
              </Badge>
            )}
            {!isCompleted && (
              <Badge variant="outline" color="orange">
                In Progress
              </Badge>
            )}
          </Group>
          
          <Text size="sm" c="dimmed">
            #{rank}
          </Text>
        </Group>

        {/* Score Display */}
        <Group justify="space-between" align="center">
          <div style={{ flex: 1 }}>
            <Text size="sm" c="dimmed" mb={4}>
              Score
            </Text>
            <Group gap="sm" align="center">
              <Text size="xl" fw={700} c={getScoreColor(scorePercentage)}>
                {attempt.score}
              </Text>
              <Text size="sm" c="dimmed">
                points
              </Text>
            </Group>
          </div>

          {isCompleted && (
            <div style={{ width: 100 }}>
              <Progress 
                value={scorePercentage} 
                color={getScoreColor(scorePercentage)}
                size="lg" 
                radius="md"
              />
              <Text size="xs" ta="center" mt={2} c="dimmed">
                {scorePercentage}%
              </Text>
            </div>
          )}
        </Group>

        {/* Attempt Details */}
        <Group gap="lg" wrap="wrap">
          <Group gap="xs">
            <IconCalendar size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />
            <div>
              <Text size="xs" c="dimmed">Started</Text>
              <Text size="sm">{formatDate(attempt.started_at)}</Text>
            </div>
          </Group>

          {isCompleted && attempt.finished_at && (
            <Group gap="xs">
              <IconClock size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />
              <div>
                <Text size="xs" c="dimmed">Completed</Text>
                <Text size="sm">{formatDate(attempt.finished_at)}</Text>
              </div>
            </Group>
          )}
        </Group>

        {/* Actions */}
        {isCompleted && onViewDetails && (
          <Group justify="flex-end">
            <Button
              variant="light"
              size="sm"
              leftSection={<IconEye size={16} />}
              onClick={() => onViewDetails(attempt.id)}
            >
              View Details
            </Button>
          </Group>
        )}

        {!isCompleted && (
          <Group justify="center">
            <Text size="sm" c="dimmed" fs="italic">
              This attempt is still in progress
            </Text>
          </Group>
        )}
      </Stack>
    </Card>
  );
});