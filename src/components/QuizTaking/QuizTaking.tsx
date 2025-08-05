"use client";

import { useEffect } from "react";
import {
  Stack,
  Card,
  Group,
  Button,
  Text,
  Progress,
  Badge,
  Alert,
  Loader,
  Title,
  Divider,
} from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconCheck,
  IconClock,
  IconInfoCircle,
  IconTrophy,
} from "@tabler/icons-react";
import { Quiz } from "@/types/quiz";
import { useQuizAttempt } from "@/hooks/useQuizAttempt";
import { QuestionAnswer } from "./QuestionAnswer";
import { useState } from "react";

interface QuizTakingProps {
  quiz: Quiz;
  onComplete?: (result: any) => void;
  onCancel?: () => void;
  onReturnToQuiz?: () => void;
}

export function QuizTaking({
  quiz,
  onComplete,
  onCancel,
  onReturnToQuiz,
}: QuizTakingProps) {
  const [isNavigating, setIsNavigating] = useState(false);

  const {
    attempt,
    currentQuestion,
    currentAnswer,
    currentAnswerSubmitted,
    currentQuestionIndex,
    totalQuestions,
    answeredQuestions,
    submittedQuestions,
    isFirstQuestion,
    isLastQuestion,
    loading,
    error,
    isSubmitting,
    result,
    isCompleted,
    startAttempt,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    submitAttempt,
  } = useQuizAttempt();

  // Start the attempt when component mounts
  useEffect(() => {
    if (quiz && !attempt && !loading) {
      startAttempt(quiz);
    }
  }, [quiz, attempt, loading, startAttempt]);

  // Handle completion (call onComplete but don't auto-redirect)
  useEffect(() => {
    if (isCompleted && result && onComplete) {
      onComplete(result);
    }
  }, [isCompleted, result, onComplete]);

  const handleAnswerChange = (answer: string | string[]) => {
    if (currentQuestion) {
      answerQuestion(currentQuestion.id, answer);
    }
  };

  const handleNextQuestion = async () => {
    setIsNavigating(true);
    try {
      await nextQuestion();
    } finally {
      setIsNavigating(false);
    }
  };

  const handleSubmit = async () => {
    const success = await submitAttempt();
    if (!success) {
      // Error handling is done in the hook
    }
  };

  const progressPercentage =
    totalQuestions > 0
      ? ((currentQuestionIndex + 1) / totalQuestions) * 100
      : 0;
  const answeredPercentage =
    totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  // Loading state
  if (loading && !attempt) {
    return (
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text c="dimmed">Starting quiz...</Text>
        </Stack>
      </Card>
    );
  }

  // Error state
  if (error && !attempt) {
    return (
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Alert
          icon={<IconInfoCircle size={16} />}
          title="Error starting quiz"
          color="red"
          variant="light"
        >
          {error}
          <Group mt="md">
            <Button variant="light" onClick={() => startAttempt(quiz)}>
              Try Again
            </Button>
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </Group>
        </Alert>
      </Card>
    );
  }

  // Quiz completed state
  if (isCompleted && result) {
    return (
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Stack align="center" gap="lg">
          <IconTrophy size={64} color="gold" />
          <Title order={2} ta="center">
            Quiz Completed!
          </Title>

          <Stack gap="md" style={{ width: "100%", maxWidth: 400 }}>
            <Group justify="space-between">
              <Text fw={500}>Total Points:</Text>
              <Badge size="xl" color="green">
                {result.total_points} points
              </Badge>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Score Percentage:</Text>
              <Badge size="xl" color="blue">
                {result.score_percentage}%
              </Badge>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Correct Answers:</Text>
              <Text fw={500} c="green">
                {result.correct_answers}/{result.total_questions}
              </Text>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Attempt Number:</Text>
              <Text fw={500}>
                #{result.attempt_no}
              </Text>
            </Group>
          </Stack>

          <Group gap="md">
            <Button
              size="lg"
              variant="filled"
              onClick={
                onReturnToQuiz || onCancel || (() => window.history.back())
              }
            >
              Back to Quiz
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => (window.location.href = "/")}
            >
              Home
            </Button>
          </Group>
        </Stack>
      </Card>
    );
  }

  // No current question available
  if (!currentQuestion) {
    return (
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Alert
          icon={<IconInfoCircle size={16} />}
          title="No questions available"
          color="yellow"
          variant="light"
        >
          This quiz does not have any questions to display.
          {onCancel && (
            <Group mt="md">
              <Button variant="outline" onClick={onCancel}>
                Go Back
              </Button>
            </Group>
          )}
        </Alert>
      </Card>
    );
  }

  return (
    <Stack gap="lg">
      {/* Quiz Header */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={3}>{quiz.title}</Title>
              <Text size="sm" c="dimmed">
                Attempt #{attempt?.attempt_number}
              </Text>
            </div>
            <Group gap="xs">
              <IconClock size={16} />
              <Text size="sm" c="dimmed">
                Started
              </Text>
            </Group>
          </Group>

          {/* Progress Indicators */}
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="sm" fw={500}>
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </Text>
              <Text size="sm" c="dimmed">
                {answeredQuestions} answered • {submittedQuestions} submitted
              </Text>
            </Group>
            <Progress value={progressPercentage} size="md" radius="md" />
            <Progress
              value={answeredPercentage}
              size="xs"
              radius="md"
              color="green"
              styles={{ root: { opacity: 0.7 } }}
            />
          </Stack>
        </Stack>
      </Card>

      {/* Question Card */}
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <QuestionAnswer
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          userAnswer={currentAnswer}
          onAnswerChange={handleAnswerChange}
          isSubmitted={currentAnswerSubmitted}
        />
      </Card>

      {/* Navigation */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between">
          <Button
            variant="outline"
            leftSection={<IconChevronLeft size={16} />}
            onClick={previousQuestion}
            disabled={isFirstQuestion}
          >
            Previous
          </Button>

          <Group gap="md">
            <Text size="sm" c="dimmed">
              {submittedQuestions}/{totalQuestions} questions submitted
            </Text>

            {isLastQuestion ? (
              <Button
                variant="filled"
                color="green"
                leftSection={<IconCheck size={16} />}
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={answeredQuestions === 0}
              >
                Submit Quiz
              </Button>
            ) : (
              <Button
                variant="filled"
                rightSection={<IconChevronRight size={16} />}
                onClick={handleNextQuestion}
                loading={isNavigating}
              >
                {isNavigating ? "Saving..." : "Next"}
              </Button>
            )}
          </Group>
        </Group>

        {error && (
          <>
            <Divider my="md" />
            <Alert
              icon={<IconInfoCircle size={16} />}
              color="red"
              variant="light"
              title="Error"
            >
              {error}
            </Alert>
          </>
        )}
      </Card>
    </Stack>
  );
}
