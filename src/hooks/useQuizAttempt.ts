"use client";

import { useState, useCallback, useRef } from "react";
import { attemptService } from "@/services/attempt";
import { answerService } from "@/services/answer";
import { Quiz, Question } from "@/types/quiz";
import { Attempt, QuizResult } from "@/types/attempt";
import { AnswerSubmit } from "@/types/answer";

interface UserAnswer {
  questionId: number;
  answer: string | string[] | null;
  submitted: boolean;
}

interface QuizAttemptState {
  attempt: Attempt | null;
  quiz: Quiz | null;
  currentQuestionIndex: number;
  answers: UserAnswer[];
  loading: boolean;
  error: string | null;
  isSubmitting: boolean;
  result: QuizResult | null;
  isCompleted: boolean;
}

interface QuizAttemptActions {
  startAttempt: (quiz: Quiz) => Promise<boolean>;
  answerQuestion: (questionId: number, answer: string | string[]) => void;
  submitAnswer: (questionId: number) => Promise<boolean>;
  nextQuestion: () => Promise<void>;
  previousQuestion: () => void;
  goToQuestion: (index: number) => void;
  submitAttempt: () => Promise<boolean>;
  resetAttempt: () => void;
}

interface UseQuizAttemptReturn extends QuizAttemptState, QuizAttemptActions {
  currentQuestion: Question | null;
  currentAnswer: string | string[] | null;
  currentAnswerSubmitted: boolean;
  totalQuestions: number;
  answeredQuestions: number;
  submittedQuestions: number;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
}

export function useQuizAttempt(): UseQuizAttemptReturn {
  const [state, setState] = useState<QuizAttemptState>({
    attempt: null,
    quiz: null,
    currentQuestionIndex: 0,
    answers: [],
    loading: false,
    error: null,
    isSubmitting: false,
    result: null,
    isCompleted: false,
  });

  const submissionInProgress = useRef<Set<number>>(new Set());

  const startAttempt = useCallback(async (quiz: Quiz): Promise<boolean> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const attempt = await attemptService.startQuizAttempt(quiz.id);

      // Initialize answers array for all questions
      const initialAnswers: UserAnswer[] = (quiz.questions || []).map((q) => ({
        questionId: q.id,
        answer: null,
        submitted: false,
      }));

      setState((prev) => ({
        ...prev,
        attempt,
        quiz,
        answers: initialAnswers,
        currentQuestionIndex: 0,
        loading: false,
        isCompleted: false,
        result: null,
      }));

      return true;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : "Failed to start quiz attempt",
        loading: false,
      }));
      return false;
    }
  }, []);

  const answerQuestion = useCallback(
    (questionId: number, answer: string | string[]) => {
      setState((prev) => ({
        ...prev,
        answers: prev.answers.map((a) =>
          a.questionId === questionId ? { ...a, answer, submitted: false } : a
        ),
      }));
    },
    []
  );

  const submitAnswer = useCallback(
    async (questionId: number): Promise<boolean> => {
      if (!state.attempt) {
        setState((prev) => ({ ...prev, error: "No active attempt" }));
        return false;
      }

      if (submissionInProgress.current.has(questionId)) {
        return false; // Already submitting this answer
      }

      const userAnswer = state.answers.find((a) => a.questionId === questionId);
      if (!userAnswer || userAnswer.answer === null) {
        setState((prev) => ({ ...prev, error: "No answer to submit" }));
        return false;
      }

      const question = state.quiz?.questions?.find((q) => q.id === questionId);
      if (!question) {
        setState((prev) => ({ ...prev, error: "Question not found" }));
        return false;
      }

      try {
        submissionInProgress.current.add(questionId);
        setState((prev) => ({ ...prev, error: null }));

        // Convert user answer to API format
        const answerSubmit: AnswerSubmit = {
          question_id: questionId,
        };

        if (question.question_type === "text") {
          answerSubmit.text_answer =
            typeof userAnswer.answer === "string" ? userAnswer.answer : "";
        } else if (question.question_type === "single") {
          // Find the option ID for single choice
          const selectedOptionText =
            typeof userAnswer.answer === "string" ? userAnswer.answer : "";
          const selectedOption = question.options.find(
            (opt) => opt.option_text === selectedOptionText
          );
          answerSubmit.selected_option_ids = selectedOption
            ? [selectedOption.id]
            : [];
        } else if (question.question_type === "multiple") {
          // Find option IDs for multiple choice
          const selectedTexts = Array.isArray(userAnswer.answer)
            ? userAnswer.answer
            : [];
          const selectedOptionIds = question.options
            .filter((opt) => selectedTexts.includes(opt.option_text))
            .map((opt) => opt.id);
          answerSubmit.selected_option_ids = selectedOptionIds;
        }

        await answerService.submitAnswersToAttempt(state.attempt.id, [
          answerSubmit,
        ]);

        // Mark as submitted
        setState((prev) => ({
          ...prev,
          answers: prev.answers.map((a) =>
            a.questionId === questionId ? { ...a, submitted: true } : a
          ),
        }));

        return true;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error:
            error instanceof Error ? error.message : "Failed to submit answer",
        }));
        return false;
      } finally {
        submissionInProgress.current.delete(questionId);
      }
    },
    [state.attempt, state.answers, state.quiz]
  );

  const nextQuestion = useCallback(async () => {
    // Auto-submit current answer before moving to next question
    const currentQuestion = state.quiz?.questions?.[state.currentQuestionIndex];
    if (currentQuestion) {
      const currentUserAnswer = state.answers.find(a => a.questionId === currentQuestion.id);
      if (currentUserAnswer?.answer !== null && !currentUserAnswer?.submitted) {
        await submitAnswer(currentQuestion.id);
      }
    }

    setState((prev) => {
      const maxIndex = (prev.quiz?.questions?.length || 1) - 1;
      return {
        ...prev,
        currentQuestionIndex: Math.min(prev.currentQuestionIndex + 1, maxIndex),
      };
    });
  }, [state.quiz, state.currentQuestionIndex, state.answers, submitAnswer]);

  const previousQuestion = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentQuestionIndex: Math.max(prev.currentQuestionIndex - 1, 0),
    }));
  }, []);

  const goToQuestion = useCallback((index: number) => {
    setState((prev) => {
      const maxIndex = (prev.quiz?.questions?.length || 1) - 1;
      return {
        ...prev,
        currentQuestionIndex: Math.max(0, Math.min(index, maxIndex)),
      };
    });
  }, []);

  const submitAttempt = useCallback(async (): Promise<boolean> => {
    if (!state.attempt) {
      setState((prev) => ({ ...prev, error: "No active attempt to submit" }));
      return false;
    }

    try {
      setState((prev) => ({ ...prev, isSubmitting: true, error: null }));

      const result = await attemptService.submitAttempt(state.attempt.id);

      setState((prev) => ({
        ...prev,
        result,
        isCompleted: true,
        isSubmitting: false,
      }));

      return true;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : "Failed to submit quiz attempt",
        isSubmitting: false,
      }));
      return false;
    }
  }, [state.attempt]);

  const resetAttempt = useCallback(() => {
    setState({
      attempt: null,
      quiz: null,
      currentQuestionIndex: 0,
      answers: [],
      loading: false,
      error: null,
      isSubmitting: false,
      result: null,
      isCompleted: false,
    });
  }, []);

  // Helper getters
  const currentQuestion =
    state.quiz?.questions?.[state.currentQuestionIndex] || null;
  const currentUserAnswer = state.answers.find(
    (a) => a.questionId === currentQuestion?.id
  );
  const currentAnswer = currentUserAnswer?.answer || null;
  const currentAnswerSubmitted = currentUserAnswer?.submitted || false;
  const totalQuestions = state.quiz?.questions?.length || 0;
  const answeredQuestions = state.answers.filter(
    (a) => a.answer !== null
  ).length;
  const submittedQuestions = state.answers.filter((a) => a.submitted).length;
  const isFirstQuestion = state.currentQuestionIndex === 0;
  const isLastQuestion = state.currentQuestionIndex === totalQuestions - 1;

  return {
    ...state,
    startAttempt,
    answerQuestion,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    submitAttempt,
    resetAttempt,
    // Helper properties
    currentQuestion,
    currentAnswer,
    currentAnswerSubmitted,
    totalQuestions,
    answeredQuestions,
    submittedQuestions,
    isFirstQuestion,
    isLastQuestion,
  };
}
