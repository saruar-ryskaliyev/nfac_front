"use client";

import { useState } from "react";
import {
  Stack,
  TextInput,
  Textarea,
  Switch,
  Button,
  Group,
  Card,
  Title,
  Text,
  Select,
  NumberInput,
  ActionIcon,
  Divider,
  Badge,
  MultiSelect,
  Alert,
} from "@mantine/core";
import {
  IconPlus,
  IconTrash,
  IconCheck,
  IconX,
  IconAlertCircle,
} from "@tabler/icons-react";
import { QuizInCreate, QuestionInCreate, OptionInCreate, Quiz } from "@/types/quiz";
import { quizService } from "@/services/quiz";
import { tagService } from "@/services/tag";
import { useEffect } from "react";

interface QuizCreationFormProps {
  onSuccess?: (quiz: any) => void;
  onCancel?: () => void;
  initialQuiz?: Quiz;
  isEdit?: boolean;
}

export function QuizCreationForm({
  onSuccess,
  onCancel,
  initialQuiz,
  isEdit = false,
}: QuizCreationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  const [formData, setFormData] = useState<QuizInCreate>(() => {
    if (isEdit && initialQuiz) {
      return {
        title: initialQuiz.title,
        description: initialQuiz.description,
        is_public: initialQuiz.is_public,
        tag_names: initialQuiz.tags.map(tag => tag.name),
        questions: (initialQuiz.questions || []).map(q => ({
          question_text: q.question_text,
          question_type: q.question_type,
          points: q.points,
          options: q.options.map(opt => ({
            option_text: opt.option_text,
            is_correct: opt.is_correct
          }))
        }))
      };
    }
    return {
      title: "",
      description: "",
      is_public: true,
      tag_names: [],
      questions: [],
    };
  });

  useEffect(() => {
    // Load available tags
    const loadTags = async () => {
      try {
        const tags = await tagService.getAllTags();
        setAvailableTags(tags.map((tag) => tag.name));
      } catch (error) {
        console.error("Failed to load tags:", error);
      }
    };
    loadTags();
  }, []);

  const addQuestion = () => {
    const newQuestion: QuestionInCreate = {
      question_text: "",
      question_type: "single",
      points: 1,
      options: [],
    };
    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const removeQuestion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const updateQuestion = (
    index: number,
    field: keyof QuestionInCreate,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      ),
    }));
  };

  const addOption = (questionIndex: number) => {
    const newOption: OptionInCreate = {
      option_text: "",
      is_correct: false,
    };
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === questionIndex ? { ...q, options: [...q.options, newOption] } : q
      ),
    }));
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === questionIndex
          ? { ...q, options: q.options.filter((_, j) => j !== optionIndex) }
          : q
      ),
    }));
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    field: keyof OptionInCreate,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === questionIndex
          ? {
              ...q,
              options: q.options.map((opt, j) =>
                j === optionIndex ? { ...opt, [field]: value } : opt
              ),
            }
          : q
      ),
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validation
      if (!formData.title.trim()) {
        throw new Error("Quiz title is required");
      }
      if (!formData.description.trim()) {
        throw new Error("Quiz description is required");
      }
      if (formData.questions.length === 0) {
        throw new Error("At least one question is required");
      }

      // Validate questions
      for (let i = 0; i < formData.questions.length; i++) {
        const question = formData.questions[i];
        if (!question.question_text.trim()) {
          throw new Error(`Question ${i + 1} text is required`);
        }
        if (
          question.question_type !== "text" &&
          question.options.length === 0
        ) {
          throw new Error(`Question ${i + 1} must have at least one option`);
        }
        if (question.question_type !== "text") {
          const hasCorrectAnswer = question.options.some(
            (opt) => opt.is_correct
          );
          if (!hasCorrectAnswer) {
            throw new Error(
              `Question ${i + 1} must have at least one correct answer`
            );
          }
        }
      }

      let resultQuiz;
      if (isEdit && initialQuiz) {
        resultQuiz = await quizService.updateQuiz(initialQuiz.id, formData);
      } else {
        resultQuiz = await quizService.createQuiz(formData);
      }
      onSuccess?.(resultQuiz);
    } catch (err) {
      const errorMessage = isEdit ? "Failed to update quiz" : "Failed to create quiz";
      setError(err instanceof Error ? err.message : errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack gap="lg">
      <div>
        <Title order={3}>{isEdit ? 'Edit Quiz' : 'Create New Quiz'}</Title>
        <Text size="sm" c="dimmed">
          {isEdit ? 'Edit your quiz details, questions, and options' : 'Create a comprehensive quiz with multiple question types'}
        </Text>
      </div>

      {error && (
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Error"
          color="red"
          variant="light"
        >
          {error}
        </Alert>
      )}

      {/* Basic Info */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Text size="lg" fw={600}>
            Basic Information
          </Text>

          <TextInput
            label="Quiz Title"
            placeholder="Enter quiz title"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
          />

          <Textarea
            label="Description"
            placeholder="Enter quiz description"
            required
            minRows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
          />

          <Group>
            <Switch
              label="Public Quiz"
              description="Allow anyone to take this quiz"
              checked={formData.is_public}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  is_public: e.currentTarget.checked,
                }))
              }
            />
          </Group>

          <Stack gap="xs">
            <MultiSelect
              label="Tags"
              placeholder="Select existing tags"
              data={availableTags}
              value={formData.tag_names}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, tag_names: value }))
              }
              searchable
            />
            <Group gap="xs">
              <TextInput
                placeholder="Create new tag"
                size="xs"
                style={{ flex: 1 }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    const newTag = e.currentTarget.value.trim();
                    if (
                      !availableTags.includes(newTag) &&
                      !formData.tag_names.includes(newTag)
                    ) {
                      setAvailableTags((prev) => [...prev, newTag]);
                      setFormData((prev) => ({
                        ...prev,
                        tag_names: [...prev.tag_names, newTag],
                      }));
                      e.currentTarget.value = "";
                    }
                  }
                }}
              />
              <Button
                size="xs"
                variant="light"
                onClick={(e) => {
                  const input = e.currentTarget.parentElement?.querySelector(
                    "input"
                  ) as HTMLInputElement;
                  if (input?.value.trim()) {
                    const newTag = input.value.trim();
                    if (
                      !availableTags.includes(newTag) &&
                      !formData.tag_names.includes(newTag)
                    ) {
                      setAvailableTags((prev) => [...prev, newTag]);
                      setFormData((prev) => ({
                        ...prev,
                        tag_names: [...prev.tag_names, newTag],
                      }));
                      input.value = "";
                    }
                  }
                }}
              >
                Add Tag
              </Button>
            </Group>
          </Stack>
        </Stack>
      </Card>

      {/* Questions */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <Text size="lg" fw={600}>
              Questions ({formData.questions.length})
            </Text>
            <Button leftSection={<IconPlus size={16} />} onClick={addQuestion}>
              Add Question
            </Button>
          </Group>

          {formData.questions.length === 0 && (
            <Text
              size="sm"
              c="dimmed"
              style={{ textAlign: "center", padding: "2rem" }}
            >
              No questions added yet. Click Add Question to get started.
            </Text>
          )}

          {formData.questions.map((question, questionIndex) => (
            <Card
              key={questionIndex}
              shadow="xs"
              padding="md"
              radius="md"
              withBorder
            >
              <Stack gap="md">
                <Group justify="space-between" align="flex-start">
                  <Badge variant="light" color="blue">
                    Question {questionIndex + 1}
                  </Badge>
                  <ActionIcon
                    color="red"
                    variant="subtle"
                    onClick={() => removeQuestion(questionIndex)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>

                <Textarea
                  label="Question Text"
                  placeholder="Enter your question"
                  required
                  value={question.question_text}
                  onChange={(e) =>
                    updateQuestion(
                      questionIndex,
                      "question_text",
                      e.target.value
                    )
                  }
                />

                <Group>
                  <Select
                    label="Question Type"
                    data={[
                      { value: "single", label: "Single Choice" },
                      { value: "multiple", label: "Multiple Choice" },
                      { value: "text", label: "Text Answer" },
                    ]}
                    value={question.question_type}
                    onChange={(value) =>
                      updateQuestion(questionIndex, "question_type", value)
                    }
                  />

                  <NumberInput
                    label="Points"
                    min={1}
                    max={100}
                    value={question.points}
                    onChange={(value) =>
                      updateQuestion(questionIndex, "points", value || 1)
                    }
                  />
                </Group>

                {question.question_type !== "text" && (
                  <div>
                    <Group justify="space-between" align="center" mb="sm">
                      <Text size="sm" fw={500}>
                        Options
                      </Text>
                      <Button
                        size="xs"
                        variant="light"
                        leftSection={<IconPlus size={14} />}
                        onClick={() => addOption(questionIndex)}
                      >
                        Add Option
                      </Button>
                    </Group>

                    <Stack gap="xs">
                      {question.options.map((option, optionIndex) => (
                        <Group key={optionIndex} align="flex-end">
                          <TextInput
                            placeholder={`Option ${optionIndex + 1}`}
                            value={option.option_text}
                            onChange={(e) =>
                              updateOption(
                                questionIndex,
                                optionIndex,
                                "option_text",
                                e.target.value
                              )
                            }
                            style={{ flex: 1 }}
                          />
                          <ActionIcon
                            color={option.is_correct ? "green" : "gray"}
                            variant={option.is_correct ? "filled" : "subtle"}
                            onClick={() =>
                              updateOption(
                                questionIndex,
                                optionIndex,
                                "is_correct",
                                !option.is_correct
                              )
                            }
                            title={
                              option.is_correct
                                ? "Correct answer"
                                : "Mark as correct"
                            }
                          >
                            <IconCheck size={16} />
                          </ActionIcon>
                          <ActionIcon
                            color="red"
                            variant="subtle"
                            onClick={() =>
                              removeOption(questionIndex, optionIndex)
                            }
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                      ))}
                    </Stack>

                    {question.options.length === 0 && (
                      <Text size="xs" c="dimmed">
                        No options added yet. Click &quot;Add Option&quot; to
                        create answer choices.
                      </Text>
                    )}
                  </div>
                )}

                {question.question_type === "text" && (
                  <Alert color="blue" variant="light">
                    <Text size="sm">
                      Text questions require manual grading. Students will
                      provide written answers.
                    </Text>
                  </Alert>
                )}
              </Stack>
            </Card>
          ))}
        </Stack>
      </Card>

      {/* Actions */}
      <Group justify="flex-end">
        {onCancel && (
          <Button variant="subtle" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          loading={loading}
          disabled={formData.questions.length === 0}
        >
          {isEdit ? 'Update Quiz' : 'Create Quiz'}
        </Button>
      </Group>
    </Stack>
  );
}
