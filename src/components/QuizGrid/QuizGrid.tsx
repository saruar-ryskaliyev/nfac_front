"use client";

import {
  SimpleGrid,
  Text,
  Loader,
  Alert,
  Stack,
  Group,
  Pagination,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { useQuizzes } from "@/hooks/useQuizzes";
import { QuizCard } from "./QuizCard";
import { QuizSearchParams } from "@/types/quiz";
import { useSearch } from "@/context/SearchContext";

interface QuizGridProps {
  initialParams?: QuizSearchParams;
  onTakeQuiz?: (quizId: number) => void;
}

export function QuizGrid({ initialParams, onTakeQuiz }: QuizGridProps) {
  const { searchQuery } = useSearch();
  const {
    quizzes,
    loading,
    error,
    total,
    page,
    pages,
    setPage,
  } = useQuizzes(initialParams, searchQuery);

  if (loading) {
    return (
      <Stack align="center" gap="md" py="xl">
        <Loader size="lg" />
        <Text c="dimmed">Loading quizzes...</Text>
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert
        icon={<IconInfoCircle size={16} />}
        title="Error loading quizzes"
        color="red"
        variant="light"
      >
        {error}
      </Alert>
    );
  }

  if (!quizzes || quizzes.length === 0) {
    return (
      <Stack align="center" gap="md" py="xl">
        <Text size="lg" c="dimmed">
          No quizzes found
        </Text>
        <Text size="sm" c="dimmed">
          Check back later for new quizzes!
        </Text>
      </Stack>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end">
        <div>
          <Text size="lg" fw={600}>
            Quizzes ({total})
          </Text>
          <Text size="sm" c="dimmed">
            Showing {quizzes?.length || 0} of {total} quizzes
          </Text>
        </div>
        

      </Group>

      <SimpleGrid
        cols={{ base: 1, sm: 2, md: 2, lg: 4 }}
        spacing="md"
        verticalSpacing="md"
      >
        {quizzes?.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} onTakeQuiz={onTakeQuiz} />
        ))}
      </SimpleGrid>

      {pages > 1 && (
        <Group justify="center" mt="xl">
          <Pagination
            total={pages}
            value={page}
            onChange={setPage}
            size="sm"
            radius="md"
          />
        </Group>
      )}
    </Stack>
  );
}
