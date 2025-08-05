'use client';

import { useState, useEffect } from 'react';
import {
  Stack,
  Title,
  Button,
  Group,
  TextInput,
  Card,
  Table,
  Badge,
  ActionIcon,
  Text,
  Loader,
  Alert,
  Modal,
  Menu,
  SimpleGrid,
} from '@mantine/core';
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconDotsVertical,
  IconAlertCircle,
  IconRefresh,
  IconTag,
} from '@tabler/icons-react';
import { Tag } from '@/types/tag';
import { tagService } from '@/services/tag';

export function TagManagement() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [createModalOpened, setCreateModalOpened] = useState(false);
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [editTagName, setEditTagName] = useState('');

  const fetchTags = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTags = await tagService.getAllTags();
      setTags(fetchedTags);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tags');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    
    try {
      const createdTag = await tagService.createTag({ name: newTagName.trim() });
      setTags(prev => [...prev, createdTag]);
      setNewTagName('');
      setCreateModalOpened(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tag');
    }
  };

  const handleEditTag = async () => {
    if (!selectedTag || !editTagName.trim()) return;
    
    try {
      const updatedTag = await tagService.updateTag(selectedTag.id, { name: editTagName.trim() });
      setTags(prev => prev.map(tag => tag.id === selectedTag.id ? updatedTag : tag));
      setEditModalOpened(false);
      setSelectedTag(null);
      setEditTagName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update tag');
    }
  };

  const handleDeleteTag = async () => {
    if (!selectedTag) return;
    
    try {
      await tagService.deleteTag(selectedTag.id);
      setTags(prev => prev.filter(tag => tag.id !== selectedTag.id));
      setDeleteModalOpened(false);
      setSelectedTag(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete tag');
    }
  };

  const openEditModal = (tag: Tag) => {
    setSelectedTag(tag);
    setEditTagName(tag.name);
    setEditModalOpened(true);
  };

  const openDeleteModal = (tag: Tag) => {
    setSelectedTag(tag);
    setDeleteModalOpened(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between" align="center">
        <div>
          <Title order={2}>Tag Management</Title>
          <Text size="sm" c="dimmed">
            Organize quizzes with tags and categories
          </Text>
        </div>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setCreateModalOpened(true)}
        >
          Create Tag
        </Button>
      </Group>

      {/* Search */}
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Group>
          <TextInput
            placeholder="Search tags..."
            leftSection={<IconSearch size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1 }}
          />
          <Button
            variant="light"
            leftSection={<IconRefresh size={16} />}
            onClick={fetchTags}
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

      {/* Stats */}
      <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Stack gap="xs" align="center">
            <IconTag size={24} style={{ color: 'var(--mantine-color-blue-6)' }} />
            <Text size="xl" fw={700}>{tags.length}</Text>
            <Text size="sm" c="dimmed">Total Tags</Text>
          </Stack>
        </Card>
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Stack gap="xs" align="center">
            <IconSearch size={24} style={{ color: 'var(--mantine-color-green-6)' }} />
            <Text size="xl" fw={700}>{filteredTags.length}</Text>
            <Text size="sm" c="dimmed">Filtered Results</Text>
          </Stack>
        </Card>
      </SimpleGrid>

      {/* Tags Display */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        {loading ? (
          <Stack align="center" py="xl">
            <Loader size="lg" />
            <Text>Loading tags...</Text>
          </Stack>
        ) : filteredTags.length === 0 ? (
          <Stack align="center" py="xl">
            <Text size="lg" c="dimmed">No tags found</Text>
            <Text size="sm" c="dimmed">
              {searchTerm 
                ? 'Try adjusting your search criteria' 
                : 'Create your first tag to get started'
              }
            </Text>
          </Stack>
        ) : (
          <Stack gap="md">
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Tag Name</Table.Th>
                  <Table.Th>Created</Table.Th>
                  <Table.Th>Last Updated</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredTags.map((tag) => (
                  <Table.Tr key={tag.id}>
                    <Table.Td>
                      <Group gap="xs">
                        <Badge variant="light" leftSection={<IconTag size={12} />}>
                          {tag.name}
                        </Badge>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{formatDate(tag.created_at)}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {tag.updated_at ? formatDate(tag.updated_at) : '-'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Menu shadow="md" width={150}>
                        <Menu.Target>
                          <ActionIcon variant="subtle">
                            <IconDotsVertical size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={<IconEdit size={14} />}
                            onClick={() => openEditModal(tag)}
                          >
                            Edit Tag
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item
                            leftSection={<IconTrash size={14} />}
                            color="red"
                            onClick={() => openDeleteModal(tag)}
                          >
                            Delete Tag
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Stack>
        )}
      </Card>

      {/* Create Tag Modal */}
      <Modal
        opened={createModalOpened}
        onClose={() => {
          setCreateModalOpened(false);
          setNewTagName('');
        }}
        title="Create New Tag"
        centered
      >
        <Stack gap="md">
          <TextInput
            label="Tag Name"
            placeholder="Enter tag name"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            data-autofocus
          />
          <Group justify="flex-end">
            <Button
              variant="subtle"
              onClick={() => {
                setCreateModalOpened(false);
                setNewTagName('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateTag} disabled={!newTagName.trim()}>
              Create Tag
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Edit Tag Modal */}
      <Modal
        opened={editModalOpened}
        onClose={() => {
          setEditModalOpened(false);
          setSelectedTag(null);
          setEditTagName('');
        }}
        title="Edit Tag"
        centered
      >
        <Stack gap="md">
          <TextInput
            label="Tag Name"
            placeholder="Enter tag name"
            value={editTagName}
            onChange={(e) => setEditTagName(e.target.value)}
            data-autofocus
          />
          <Group justify="flex-end">
            <Button
              variant="subtle"
              onClick={() => {
                setEditModalOpened(false);
                setSelectedTag(null);
                setEditTagName('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditTag} disabled={!editTagName.trim()}>
              Save Changes
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={() => {
          setDeleteModalOpened(false);
          setSelectedTag(null);
        }}
        title="Delete Tag"
        centered
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to delete the tag &quot;{selectedTag?.name}&quot;? This action cannot be undone.
          </Text>
          <Group justify="flex-end">
            <Button
              variant="subtle"
              onClick={() => {
                setDeleteModalOpened(false);
                setSelectedTag(null);
              }}
            >
              Cancel
            </Button>
            <Button color="red" onClick={handleDeleteTag}>
              Delete Tag
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}