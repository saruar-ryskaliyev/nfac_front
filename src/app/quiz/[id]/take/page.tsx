'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, Alert, Loader, Stack, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { quizService } from '@/services/quiz';
import { Quiz } from '@/types/quiz';
import { QuizTaking } from '@/components/QuizTaking';

export default function QuizTakePage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params?.id as string;
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) {
        setError('Quiz ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const quizData = await quizService.getQuizById(parseInt(quizId));
        console.log('Fetched quiz for taking:', quizData);
        console.log('Quiz questions for taking:', quizData.questions?.map(q => ({ id: q.id, text: q.question_text?.substring(0, 50) + '...' })));
        setQuiz(quizData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleQuizComplete = (result: any) => {
    // Don't automatically redirect - let user review results
    // User will manually return using the button in the results screen
  };

  const handleCancel = () => {
    router.push(`/quiz/${quizId}`);
  };

  const handleReturnToQuiz = () => {
    router.push(`/quiz/${quizId}`);
  };

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text c="dimmed">Loading quiz...</Text>
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="lg" py="xl">
        <Alert
          icon={<IconInfoCircle size={16} />}
          title="Error loading quiz"
          color="red"
          variant="light"
        >
          {error}
        </Alert>
      </Container>
    );
  }

  if (!quiz) {
    return (
      <Container size="lg" py="xl">
        <Alert
          icon={<IconInfoCircle size={16} />}
          title="Quiz not found"
          color="yellow"
          variant="light"
        >
          The requested quiz could not be found.
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="lg" py="md">
      <QuizTaking
        quiz={quiz}
        onComplete={handleQuizComplete}
        onCancel={handleCancel}
        onReturnToQuiz={handleReturnToQuiz}
      />
    </Container>
  );
}