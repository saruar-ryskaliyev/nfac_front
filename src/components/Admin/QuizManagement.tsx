"use client";

import { useState, useEffect } from "react";
import {
  Stack,
  Title,
  Button,
  Group,
  TextInput,
  Select,
  Card,
  Table,
  Badge,
  ActionIcon,
  Text,
  Pagination,
  Loader,
  Alert,
  Modal,
  Menu,
} from "@mantine/core";
import {
  IconPlus,
  IconSearch,
  IconEye,
  IconEdit,
  IconTrash,
  IconDotsVertical,
  IconAlertCircle,
  IconRefresh,
} from "@tabler/icons-react";
import { Quiz } from "@/types/quiz";
import { quizService } from "@/services/quiz";
import { QuizCreationForm } from "./QuizCreationForm";

export function QuizManagement() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        tag: selectedTag || undefined,
      };

      const result = await quizService.getAllQuizzes(params);
      setQuizzes(result.items);
      setTotalPages(result.pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [currentPage, searchTerm, selectedTag]);

  const handleDeleteQuiz = async (quiz: Quiz) => {
    setQuizToDelete(quiz);
    setDeleteModalOpened(true);
  };

  const confirmDelete = async () => {
    if (!quizToDelete) return;

    try {
      await quizService.deleteQuiz(quizToDelete.id);
      setQuizzes((prev) => prev.filter((q) => q.id !== quizToDelete.id));
      setDeleteModalOpened(false);
      setQuizToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete quiz");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleQuizCreated = (newQuiz: Quiz) => {
    setQuizzes((prev) => [newQuiz, ...prev]);
    setShowCreateForm(false);
  };

  if (showCreateForm) {
    return (
      <QuizCreationForm
        onSuccess={handleQuizCreated}
        onCancel={() => setShowCreateForm(false)}
      />
    );
  }

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between" align="center">
        <div>
          <Title order={2}>Quiz Management</Title>
          <Text size="sm" c="dimmed">
            Create, edit, and manage all quizzes
          </Text>
        </div>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setShowCreateForm(true)}
        >
          Create Quiz
        </Button>
      </Group>

      {/* Filters */}
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Group>
          <TextInput
            placeholder="Search quizzes..."
            leftSection={<IconSearch size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Filter by tag"
            data={[
              { value: "", label: "All Tags" },
              { value: "Math", label: "Math" },
              { value: "Science", label: "Science" },
              { value: "History", label: "History" },
            ]}
            value={selectedTag}
            onChange={(value) => setSelectedTag(value || "")}
            clearable
          />
          <Button
            variant="light"
            leftSection={<IconRefresh size={16} />}
            onClick={fetchQuizzes}
          >
            Refresh
          </Button>
        </Group>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Error"
          color="red"
          variant="light"
          onClose={() => setError(null)}
          withCloseButton
        >
          {error}
        </Alert>
      )}

      {/* Quizzes Table */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        {loading ? (
          <Stack align="center" py="xl">
            <Loader size="lg" />
            <Text>Loading quizzes...</Text>
          </Stack>
        ) : quizzes.length === 0 ? (
          <Stack align="center" py="xl">
            <Text size="lg" c="dimmed">
              No quizzes found
            </Text>
            <Text size="sm" c="dimmed">
              {searchTerm || selectedTag
                ? "Try adjusting your search criteria"
                : "Create your first quiz to get started"}
            </Text>
          </Stack>
        ) : (
          <Stack gap="md">
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Title</Table.Th>
                  <Table.Th>Creator</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Questions</Table.Th>
                  <Table.Th>Tags</Table.Th>
                  <Table.Th>Created</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {quizzes.map((quiz) => (
                  <Table.Tr key={quiz.id}>
                    <Table.Td>
                      <div>
                        <Text fw={500}>{quiz.title}</Text>
                        <Text
                          size="xs"
                          c="dimmed"
                          truncate
                          style={{ maxWidth: 200 }}
                        >
                          {quiz.description}
                        </Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">ID: {quiz.creator_id}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        variant="light"
                        color={quiz.is_public ? "green" : "gray"}
                      >
                        {quiz.is_public ? "Public" : "Private"}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {quiz.questions?.length || 0} questions
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        {quiz.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag.id} variant="outline" size="xs">
                            {tag.name}
                          </Badge>
                        ))}
                        {quiz.tags.length > 2 && (
                          <Badge variant="outline" size="xs" color="gray">
                            +{quiz.tags.length - 2}
                          </Badge>
                        )}
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{formatDate(quiz.created_at)}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <ActionIcon variant="subtle">
                            <IconDotsVertical size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item leftSection={<IconEye size={14} />}>
                            View Details
                          </Menu.Item>
                          <Menu.Item leftSection={<IconEdit size={14} />}>
                            Edit Quiz
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item
                            leftSection={<IconTrash size={14} />}
                            color="red"
                            onClick={() => handleDeleteQuiz(quiz)}
                          >
                            Delete Quiz
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <Group justify="center">
                <Pagination
                  value={currentPage}
                  onChange={setCurrentPage}
                  total={totalPages}
                />
              </Group>
            )}
          </Stack>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        title="Delete Quiz"
        centered
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to delete &quot;{quizToDelete?.title}&quot;?
            This action cannot be undone.
          </Text>
          <Group justify="flex-end">
            <Button
              variant="subtle"
              onClick={() => setDeleteModalOpened(false)}
            >
              Cancel
            </Button>
            <Button color="red" onClick={confirmDelete}>
              Delete Quiz
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
