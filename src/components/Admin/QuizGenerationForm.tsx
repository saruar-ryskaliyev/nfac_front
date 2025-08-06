"use client";

import { useState } from "react";
import {
  Card,
  Stack,
  TextInput,
  NumberInput,
  Switch,
  MultiSelect,
  Button,
  Text,
  Alert,
  Loader,
} from "@mantine/core";
import { IconSparkles, IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { quizService } from "@/services/quiz";
import { QuizGenerateRequest } from "@/types/quiz";

interface QuizGenerationFormProps {
  onQuizGenerated?: () => void;
}

export function QuizGenerationForm({ onQuizGenerated }: QuizGenerationFormProps) {
  const [formData, setFormData] = useState<QuizGenerateRequest>({
    prompt: "",
    num_questions: 5,
    is_public: true,
    tag_names: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.prompt.trim()) {
      setError("Please provide a prompt for quiz generation");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await quizService.generateQuiz(formData);
      
      setSuccess(true);
      setFormData({
        prompt: "",
        num_questions: 5,
        is_public: true,
        tag_names: [],
      });
      
      if (onQuizGenerated) {
        onQuizGenerated();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate quiz"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Text size="lg" fw={600} c="blue">
            <IconSparkles size="1.2rem" style={{ marginRight: "8px" }} />
            Generate Quiz with AI
          </Text>

          {error && (
            <Alert
              icon={<IconAlertCircle size="1rem" />}
              color="red"
              variant="light"
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              icon={<IconCheck size="1rem" />}
              color="green"
              variant="light"
            >
              Quiz generated successfully!
            </Alert>
          )}

          <TextInput
            label="Prompt"
            placeholder="e.g., Python programming fundamentals"
            value={formData.prompt}
            onChange={(e) =>
              setFormData({ ...formData, prompt: e.target.value })
            }
            required
            disabled={loading}
          />

          <NumberInput
            label="Number of Questions"
            placeholder="5"
            value={formData.num_questions}
            onChange={(value) =>
              setFormData({ ...formData, num_questions: Number(value) || 5 })
            }
            min={1}
            max={20}
            disabled={loading}
          />

          <Switch
            label="Make quiz public"
            checked={formData.is_public}
            onChange={(e) =>
              setFormData({ ...formData, is_public: e.currentTarget.checked })
            }
            disabled={loading}
          />

          <MultiSelect
            label="Tags"
            placeholder="Add tags for the quiz (comma separated)"
            data={[]}
            value={formData.tag_names || []}
            onChange={(value) =>
              setFormData({ ...formData, tag_names: value })
            }
            searchable
            disabled={loading}
          />

          <Button
            type="submit"
            loading={loading}
            leftSection={loading ? <Loader size="sm" /> : <IconSparkles size="1rem" />}
            disabled={!formData.prompt.trim()}
          >
            {loading ? "Generating..." : "Generate Quiz"}
          </Button>
        </Stack>
      </form>
    </Card>
  );
}