'use client';

import { useRouter } from 'next/navigation';
import { Card, Text, Badge, Group, Button, Stack } from '@mantine/core';
import { IconUsers, IconClock, IconTag } from '@tabler/icons-react';
import { Quiz } from '@/types/quiz';

interface QuizCardProps {
  quiz: Quiz;
  onTakeQuiz?: (quizId: number) => void;
}

export function QuizCard({ quiz, onTakeQuiz }: QuizCardProps) {
  const router = useRouter();

  const handleTakeQuiz = () => {
    if (onTakeQuiz) {
      onTakeQuiz(quiz.id);
    } else {
      router.push(`/quiz/${quiz.id}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <div>
          <Text fw={500} size="lg" lineClamp={2}>
            {quiz.title}
          </Text>
          <Text size="sm" c="dimmed" lineClamp={3} mt="xs">
            {quiz.description}
          </Text>
        </div>

        <Group gap="xs" wrap="wrap">
          {quiz.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag.id}
              variant="light"
              size="sm"
              leftSection={<IconTag size={12} />}
            >
              {tag.name}
            </Badge>
          ))}
          {quiz.tags.length > 3 && (
            <Badge variant="outline" size="sm">
              +{quiz.tags.length - 3} more
            </Badge>
          )}
        </Group>

        <Group justify="space-between" align="center">
          <Group gap="lg">
            <Group gap={4}>
              <IconUsers size={16} color="gray" />
              <Text size="xs" c="dimmed">
                {quiz.questions ? `${quiz.questions.length} questions` : `Quiz #${quiz.id}`}
              </Text>
            </Group>
            <Group gap={4}>
              <IconClock size={16} color="gray" />
              <Text size="xs" c="dimmed">
                {formatDate(quiz.created_at)}
              </Text>
            </Group>
          </Group>
        </Group>

        <Button
          variant="filled"
          fullWidth
          onClick={handleTakeQuiz}
          size="sm"
        >
          Take Quiz
        </Button>
      </Stack>
    </Card>
  );
}