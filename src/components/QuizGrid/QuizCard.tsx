'use client';

import { useRouter } from 'next/navigation';
import { Card, Text, Badge, Group, Stack } from '@mantine/core';
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
    <div
      onClick={handleTakeQuiz}
      style={{
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        transformOrigin: 'center',
        width: '300px',
        height: '240px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'scale(0.98)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
      }}
    >
      <Card 
        shadow="sm" 
        padding="lg" 
        radius="md" 
        withBorder
        style={{ height: '100%' }}
      >
      <Stack gap="md" style={{ height: '100%', justifyContent: 'space-between' }}>
        <div style={{ flex: '1', overflow: 'hidden' }}>
          <Text fw={500} size="lg" lineClamp={2}>
            {quiz.title}
          </Text>
          <Text 
            size="sm" 
            c="dimmed" 
            lineClamp={2} 
            mt="xs"
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              maxHeight: '2.4em',
              lineHeight: '1.2em'
            }}
          >
            {quiz.description}
          </Text>
        </div>

        <Group gap="xs" wrap="wrap" align="flex-start" style={{ minHeight: '32px' }}>
          {quiz.tags.slice(0, 4).map((tag) => (
            <Badge
              key={tag.id}
              variant="light"
              size="sm"
              leftSection={<IconTag size={12} />}
              style={{ 
                flexShrink: 0,
                maxWidth: '120px',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {tag.name}
            </Badge>
          ))}
          {quiz.tags.length > 4 && (
            <Badge 
              variant="outline" 
              size="sm"
              style={{ flexShrink: 0 }}
            >
              +{quiz.tags.length - 4}
            </Badge>
          )}
        </Group>

        <div style={{ flexShrink: 0 }}>
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
        </div>

      </Stack>
      </Card>
    </div>
  );
}