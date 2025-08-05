'use client';

import { useRouter } from 'next/navigation';
import { Stack, Title, Text, Badge, Group, Card, Button, Divider } from '@mantine/core';
import { IconTag, IconClock, IconUser, IconTrophy } from '@tabler/icons-react';
import { Quiz, Question, Option } from '@/types/quiz';
import { AttemptHistory } from '@/components/AttemptHistory';
import { useAuth } from '@/context/AuthContext';

interface QuizDetailProps {
  quiz: Quiz;
}

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
}

function QuestionCard({ question, questionNumber }: QuestionCardProps) {
  const formatQuestionType = (type: string) => {
    switch (type) {
      case 'single':
        return 'Single Choice';
      case 'multiple':
        return 'Multiple Choice';
      case 'text':
        return 'Text Answer';
      default:
        return type;
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <div style={{ flex: 1 }}>
            <Group gap="xs" mb="xs">
              <Badge variant="light" color="blue">
                Question {questionNumber}
              </Badge>
              <Badge variant="outline" size="sm">
                {formatQuestionType(question.question_type)}
              </Badge>
              <Badge variant="outline" size="sm" color="green">
                {question.points} points
              </Badge>
            </Group>
            <Text size="lg" fw={500} mb="md">
              {question.question_text}
            </Text>
          </div>
        </Group>

        {question.options.length > 0 && (
          <Stack gap="xs">
            <Text size="sm" fw={500} c="dimmed">
              Options:
            </Text>
            {question.options.map((option, index) => (
              <Group key={option.id} gap="xs">
                <Badge
                  variant="outline"
                  color="gray"
                  size="sm"
                >
                  {String.fromCharCode(65 + index)}
                </Badge>
                <Text size="sm">
                  {option.option_text}
                </Text>
              </Group>
            ))}
          </Stack>
        )}

        {question.question_type === 'text' && question.options.length === 0 && (
          <Text size="sm" c="dimmed" fs="italic">
            This is a text-based question requiring a written answer.
          </Text>
        )}
      </Stack>
    </Card>
  );
}

export function QuizDetail({ quiz }: QuizDetailProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleStartQuiz = () => {
    router.push(`/quiz/${quiz.id}/take`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalPoints = quiz.questions?.reduce((sum, question) => sum + question.points, 0) || 0;

  return (
    <Stack gap="xl">
      {/* Quiz Header */}
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Stack gap="md">
          <Title order={1}>{quiz.title}</Title>
          <Text size="lg" c="dimmed">
            {quiz.description}
          </Text>

          <Group gap="lg" wrap="wrap">
            <Group gap="xs">
              <IconUser size={16} color="gray" />
              <Text size="sm" c="dimmed">
                Creator ID: {quiz.creator_id}
              </Text>
            </Group>
            <Group gap="xs">
              <IconClock size={16} color="gray" />
              <Text size="sm" c="dimmed">
                Created: {formatDate(quiz.created_at)}
              </Text>
            </Group>
            <Group gap="xs">
              <IconTrophy size={16} color="gray" />
              <Text size="sm" c="dimmed">
                Total Points: {totalPoints}
              </Text>
            </Group>
          </Group>

          {quiz.tags.length > 0 && (
            <Group gap="xs">
              {quiz.tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="light"
                  leftSection={<IconTag size={12} />}
                >
                  {tag.name}
                </Badge>
              ))}
            </Group>
          )}

          <Divider />

          <Group justify="space-between" align="center">
            <Text size="lg" fw={600}>
              Questions ({quiz.questions?.length || 0})
            </Text>
            <Button size="lg" variant="filled" onClick={handleStartQuiz}>
              Start Quiz
            </Button>
          </Group>
        </Stack>
      </Card>

      {/* Questions Preview */}
      {quiz.questions && quiz.questions.length > 0 ? (
        <Stack gap="lg">
          <Group justify="space-between" align="center">
            <Text size="lg" fw={600} c="dimmed">
              Preview - First {Math.min(3, quiz.questions.length)} Questions
            </Text>
            {quiz.questions.length > 3 && (
              <Badge variant="light" size="lg">
                +{quiz.questions.length - 3} more questions
              </Badge>
            )}
          </Group>
          
          {quiz.questions.slice(0, 3).map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              questionNumber={index + 1}
            />
          ))}
          
          {quiz.questions.length > 3 && (
            <Card shadow="sm" padding="lg" radius="md" withBorder style={{ background: 'var(--mantine-color-gray-0)' }}>
              <Stack align="center" gap="md">
                <Text size="md" fw={500}>
                  {quiz.questions.length - 3} more questions available
                </Text>
                <Text size="sm" c="dimmed">
                  Start the quiz to see all questions
                </Text>
                <Button variant="light" onClick={handleStartQuiz}>
                  Start Quiz to See All
                </Button>
              </Stack>
            </Card>
          )}
        </Stack>
      ) : (
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Stack align="center" gap="md">
            <Text size="lg" c="dimmed">
              No questions available for this quiz
            </Text>
            <Text size="sm" c="dimmed">
              Questions may be added by the quiz creator.
            </Text>
          </Stack>
        </Card>
      )}

      {/* User Attempt History */}
      {isAuthenticated && (
        <>
          <Divider size="md" />
          <AttemptHistory quizId={quiz.id} quizTitle={quiz.title} />
        </>
      )}
    </Stack>
  );
}