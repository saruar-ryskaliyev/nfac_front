'use client';

import { useEffect } from 'react';
import {
  Modal,
  Stack,
  Title,
  Text,
  Badge,
  Group,
  Card,
  ScrollArea,
  Divider,
  Alert,
  Loader,
  Progress,
  Grid,
  Box,
} from '@mantine/core';
import {
  IconTrophy,
  IconClock,
  IconCheck,
  IconX,
  IconMinus,
  IconAlertCircle,
} from '@tabler/icons-react';
import { useAttemptDetails } from '@/hooks/useAttemptDetails';
import { QuestionReview } from './QuestionReview';

interface AttemptDetailsModalProps {
  opened: boolean;
  onClose: () => void;
  attemptId: number;
  quizTitle: string;
}

export function AttemptDetailsModal({
  opened,
  onClose,
  attemptId,
  quizTitle,
}: AttemptDetailsModalProps) {
  const {
    details,
    loading,
    error,
    fetchDetails,
    clearDetails,
    clearError,
    totalQuestions,
    answeredQuestions,
    correctAnswers,
    incorrectAnswers,
    unansweredQuestions,
    scorePercentage,
    timeTaken,
    questionResults,
  } = useAttemptDetails();

  useEffect(() => {
    if (opened && attemptId) {
      fetchDetails(attemptId);
    }
  }, [opened, attemptId, fetchDetails]);

  useEffect(() => {
    if (!opened) {
      clearDetails();
      clearError();
    }
  }, [opened, clearDetails, clearError]);

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'green';
    if (percentage >= 60) return 'yellow';
    return 'red';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Stack gap="xs">
          <Title order={3}>Attempt Details</Title>
          <Text size="sm" c="dimmed">
            {quizTitle}
          </Text>
        </Stack>
      }
      size="xl"
      scrollAreaComponent={ScrollArea.Autosize}
    >
      {loading && (
        <Stack align="center" py="xl">
          <Loader size="lg" />
          <Text>Loading attempt details...</Text>
        </Stack>
      )}

      {error && (
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Error"
          color="red"
          mb="md"
        >
          {error}
        </Alert>
      )}

      {details && !loading && (
        <Stack gap="lg">
          {/* Overview Statistics */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
              <Group justify="space-between" align="flex-start">
                <div>
                  <Text size="lg" fw={600} mb="xs">
                    Attempt Overview
                  </Text>
                  <Group gap="lg">
                    <Group gap="xs">
                      <IconClock size={16} color="gray" />
                      <Text size="sm" c="dimmed">
                        Started: {formatDate(details.started_at)}
                      </Text>
                    </Group>
                    {details.finished_at && (
                      <Group gap="xs">
                        <IconClock size={16} color="gray" />
                        <Text size="sm" c="dimmed">
                          Finished: {formatDate(details.finished_at)}
                        </Text>
                      </Group>
                    )}
                  </Group>
                </div>
                <Badge size="lg" variant="light" color={getScoreColor(scorePercentage)}>
                  Attempt #{details.attempt_no}
                </Badge>
              </Group>

              <Divider />

              <Grid>
                <Grid.Col span={6}>
                  <Stack gap="xs" align="center">
                    <Group gap="xs">
                      <IconTrophy size={20} color="var(--mantine-color-yellow-6)" />
                      <Text size="xl" fw={700} c={getScoreColor(scorePercentage)}>
                        {scorePercentage}%
                      </Text>
                    </Group>
                    <Text size="sm" c="dimmed">
                      Score: {details.score} points
                    </Text>
                  </Stack>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Stack gap="xs" align="center">
                    <Group gap="xs">
                      <IconClock size={20} color="var(--mantine-color-blue-6)" />
                      <Text size="xl" fw={700}>
                        {timeTaken}
                      </Text>
                    </Group>
                    <Text size="sm" c="dimmed">
                      Time Taken
                    </Text>
                  </Stack>
                </Grid.Col>
              </Grid>

              <Progress
                value={(correctAnswers / totalQuestions) * 100}
                color={getScoreColor(scorePercentage)}
                size="lg"
                radius="md"
              />

              <Group justify="space-between">
                <Group gap="lg">
                  <Group gap="xs">
                    <IconCheck size={16} color="var(--mantine-color-green-6)" />
                    <Text size="sm">
                      <Text component="span" fw={600}>
                        {correctAnswers}
                      </Text>{' '}
                      Correct
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <IconX size={16} color="var(--mantine-color-red-6)" />
                    <Text size="sm">
                      <Text component="span" fw={600}>
                        {incorrectAnswers}
                      </Text>{' '}
                      Incorrect
                    </Text>
                  </Group>
                  {unansweredQuestions > 0 && (
                    <Group gap="xs">
                      <IconMinus size={16} color="var(--mantine-color-gray-6)" />
                      <Text size="sm">
                        <Text component="span" fw={600}>
                          {unansweredQuestions}
                        </Text>{' '}
                        Unanswered
                      </Text>
                    </Group>
                  )}
                </Group>
                <Text size="sm" c="dimmed">
                  {totalQuestions} Total Questions
                </Text>
              </Group>
            </Stack>
          </Card>

          {/* Question by Question Review */}
          {questionResults.length > 0 && (
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="md">
                <Text size="lg" fw={600}>
                  Question Review
                </Text>
                <Divider />
                <Stack gap="md">
                  {questionResults.map((result, index) => (
                    <QuestionReview
                      key={result.question.id}
                      questionNumber={index + 1}
                      question={result.question}
                      userAnswer={result.userAnswer}
                      isCorrect={result.isCorrect}
                      pointsEarned={result.pointsEarned}
                    />
                  ))}
                </Stack>
              </Stack>
            </Card>
          )}
        </Stack>
      )}
    </Modal>
  );
}