'use client';

import {
  Card,
  Stack,
  Text,
  Badge,
  Group,
  Box,
  Alert,
} from '@mantine/core';
import {
  IconCheck,
  IconX,
  IconMinus,
  IconAlertCircle,
} from '@tabler/icons-react';
import { AttemptDetails, UserAnswer } from '@/types/attempt';

interface QuestionReviewProps {
  questionNumber: number;
  question: AttemptDetails['questions'][0];
  userAnswer: UserAnswer | null;
  isCorrect: boolean | null;
  pointsEarned: number;
}

export function QuestionReview({
  questionNumber,
  question,
  userAnswer,
  isCorrect,
  pointsEarned,
}: QuestionReviewProps) {
  const getStatusIcon = () => {
    if (isCorrect === true) {
      return <IconCheck size={16} color="var(--mantine-color-green-6)" />;
    }
    if (isCorrect === false) {
      return <IconX size={16} color="var(--mantine-color-red-6)" />;
    }
    return <IconMinus size={16} color="var(--mantine-color-gray-6)" />;
  };

  const getStatusColor = () => {
    if (isCorrect === true) return 'green';
    if (isCorrect === false) return 'red';
    return 'gray';
  };

  const getStatusText = () => {
    if (isCorrect === true) return 'Correct';
    if (isCorrect === false) return 'Incorrect';
    return 'Not Answered';
  };

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

  const getUserAnswerText = () => {
    if (!userAnswer) return 'No answer provided';

    if (userAnswer.text_answer) {
      return userAnswer.text_answer;
    }

    if (userAnswer.selected_option_ids && userAnswer.selected_option_ids.length > 0) {
      const selectedOptions = question.options.filter(option =>
        userAnswer.selected_option_ids?.includes(option.id)
      );
      return selectedOptions.map(option => option.option_text).join(', ');
    }

    return 'No answer provided';
  };

  const getCorrectAnswerText = () => {
    if (question.question_type === 'text') {
      const correctOptions = question.options.filter(option => option.is_correct);
      if (correctOptions.length > 0) {
        return correctOptions.map(option => option.option_text).join(', ');
      }
      return 'Text answer - check with instructor';
    }

    const correctOptions = question.options.filter(option => option.is_correct);
    return correctOptions.map(option => option.option_text).join(', ');
  };

  return (
    <Card shadow="xs" padding="md" radius="md" withBorder>
      <Stack gap="md">
        {/* Question Header */}
        <Group justify="space-between" align="flex-start">
          <Group gap="xs">
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
          <Group gap="xs">
            {getStatusIcon()}
            <Badge variant="light" color={getStatusColor()}>
              {getStatusText()}
            </Badge>
            <Badge variant="filled" color={getStatusColor()}>
              {pointsEarned}/{question.points} pts
            </Badge>
          </Group>
        </Group>

        {/* Question Text */}
        <Text size="md" fw={500}>
          {question.question_text}
        </Text>

        {/* Options Display for Multiple Choice */}
        {question.options.length > 0 && question.question_type !== 'text' && (
          <Box>
            <Text size="sm" fw={500} c="dimmed" mb="xs">
              Available Options:
            </Text>
            <Stack gap="xs">
              {question.options.map((option, index) => {
                const isSelected = userAnswer?.selected_option_ids?.includes(option.id);
                const isCorrectOption = option.is_correct;

                return (
                  <Group key={option.id} gap="xs">
                    <Badge
                      variant={isSelected ? 'filled' : 'outline'}
                      color={
                        isCorrectOption
                          ? 'green'
                          : isSelected && !isCorrectOption
                          ? 'red'
                          : 'gray'
                      }
                      size="sm"
                    >
                      {String.fromCharCode(65 + index)}
                    </Badge>
                    <Text
                      size="sm"
                      c={
                        isCorrectOption
                          ? 'green'
                          : isSelected && !isCorrectOption
                          ? 'red'
                          : undefined
                      }
                      fw={isSelected || isCorrectOption ? 500 : undefined}
                    >
                      {option.option_text}
                      {isCorrectOption && (
                        <Text component="span" size="xs" c="green" ml="xs">
                          ✓ Correct
                        </Text>
                      )}
                      {isSelected && !isCorrectOption && (
                        <Text component="span" size="xs" c="red" ml="xs">
                          ✗ Your choice
                        </Text>
                      )}
                    </Text>
                  </Group>
                );
              })}
            </Stack>
          </Box>
        )}

        {/* Answer Summary */}
        <Stack gap="xs">
          <Group gap="lg">
            <Box flex={1}>
              <Text size="sm" fw={500} c="dimmed" mb="xs">
                Your Answer:
              </Text>
              <Text
                size="sm"
                c={isCorrect === true ? 'green' : isCorrect === false ? 'red' : 'gray'}
                fw={500}
              >
                {getUserAnswerText()}
              </Text>
            </Box>
            
            {question.question_type !== 'text' && (
              <Box flex={1}>
                <Text size="sm" fw={500} c="dimmed" mb="xs">
                  Correct Answer:
                </Text>
                <Text size="sm" c="green" fw={500}>
                  {getCorrectAnswerText()}
                </Text>
              </Box>
            )}
          </Group>

          {question.question_type === 'text' && isCorrect === null && (
            <Alert
              icon={<IconAlertCircle size="1rem" />}
              color="blue"
              variant="light"
            >
              Text answers require manual grading by the instructor.
            </Alert>
          )}
        </Stack>
      </Stack>
    </Card>
  );
}