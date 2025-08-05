'use client';

import { useState, useEffect } from 'react';
import { Stack, Text, Radio, Checkbox, TextInput, Group, Badge } from '@mantine/core';
import { Question } from '@/types/quiz';

interface QuestionAnswerProps {
  question: Question;
  questionNumber: number;
  userAnswer: string | string[] | null;
  onAnswerChange: (answer: string | string[]) => void;
  isSubmitted?: boolean;
}

export function QuestionAnswer({ 
  question, 
  questionNumber, 
  userAnswer, 
  onAnswerChange,
  isSubmitted = false
}: QuestionAnswerProps) {
  const [textAnswer, setTextAnswer] = useState(
    typeof userAnswer === 'string' ? userAnswer : ''
  );

  // Reset text input when question changes or when userAnswer is reset
  useEffect(() => {
    setTextAnswer(typeof userAnswer === 'string' ? userAnswer : '');
  }, [userAnswer, question.id]);

  const handleSingleChoice = (value: string) => {
    onAnswerChange(value);
  };

  const handleMultipleChoice = (optionText: string, checked: boolean) => {
    const currentAnswers = Array.isArray(userAnswer) ? userAnswer : [];
    
    if (checked) {
      onAnswerChange([...currentAnswers, optionText]);
    } else {
      onAnswerChange(currentAnswers.filter(answer => answer !== optionText));
    }
  };

  const handleTextAnswer = (value: string) => {
    setTextAnswer(value);
    onAnswerChange(value);
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

  return (
    <Stack gap="lg">
      {/* Question Header */}
      <div>
        <Group gap="xs" mb="md">
          <Badge variant="filled" color="blue" size="lg">
            Question {questionNumber}
          </Badge>
          <Badge variant="outline" size="md">
            {formatQuestionType(question.question_type)}
          </Badge>
          <Badge variant="outline" size="md" color="green">
            {question.points} points
          </Badge>
        </Group>

        <Text size="xl" fw={500} mb="lg">
          {question.question_text}
        </Text>
      </div>

      {/* Answer Options */}
      {question.question_type === 'single' && question.options.length > 0 && (
        <Radio.Group
          value={typeof userAnswer === 'string' ? userAnswer : ''}
          onChange={handleSingleChoice}
        >
          <Stack gap="md">
            {question.options.map((option, index) => (
              <Radio
                key={option.id}
                value={option.option_text}
                disabled={isSubmitted}
                label={
                  <Group gap="xs">
                    <Badge variant="light" size="sm">
                      {String.fromCharCode(65 + index)}
                    </Badge>
                    <Text size="md">{option.option_text}</Text>
                  </Group>
                }
                size="md"
              />
            ))}
          </Stack>
        </Radio.Group>
      )}

      {question.question_type === 'multiple' && question.options.length > 0 && (
        <Stack gap="md">
          <Text size="sm" c="dimmed" fs="italic">
            Select all that apply:
          </Text>
          {question.options.map((option, index) => (
            <Checkbox
              key={option.id}
              checked={Array.isArray(userAnswer) && userAnswer.includes(option.option_text)}
              onChange={(event) => handleMultipleChoice(option.option_text, event.currentTarget.checked)}
              disabled={isSubmitted}
              label={
                <Group gap="xs">
                  <Badge variant="light" size="sm">
                    {String.fromCharCode(65 + index)}
                  </Badge>
                  <Text size="md">{option.option_text}</Text>
                </Group>
              }
              size="md"
            />
          ))}
        </Stack>
      )}

      {question.question_type === 'text' && (
        <Stack gap="md">
          <Text size="sm" c="dimmed" fs="italic">
            Enter your answer below:
          </Text>
          <TextInput
            placeholder="Type your answer here..."
            value={textAnswer}
            onChange={(event) => handleTextAnswer(event.currentTarget.value)}
            disabled={isSubmitted}
            size="md"
            styles={{
              input: {
                minHeight: '60px',
                fontSize: '16px',
              }
            }}
          />
        </Stack>
      )}

      {/* No options available */}
      {question.options.length === 0 && question.question_type !== 'text' && (
        <Text size="sm" c="dimmed" fs="italic">
          No options available for this question.
        </Text>
      )}
    </Stack>
  );
}