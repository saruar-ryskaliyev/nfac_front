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
  Switch,
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
  IconShield,
  IconUser,
} from "@tabler/icons-react";
import { User } from "@/types/user";
import { userService } from "@/services/user";

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        role: roleFilter || undefined,
        is_active:
          statusFilter === "active"
            ? true
            : statusFilter === "inactive"
            ? false
            : undefined,
      };

      const result = await userService.getAllUsers();
      setUsers(result.items);
      setTotalPages(result.pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, roleFilter, statusFilter]);

  const handleToggleUserStatus = async (user: User) => {
    try {
      const updatedUser = await userService.updateUser(user.id, {
        is_active: !user.is_active,
      });
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update user status"
      );
    }
  };

  const handleToggleUserRole = async (user: User) => {
    try {
      const newRole = user.role === "admin" ? "user" : "admin";
      const updatedUser = await userService.updateUser(user.id, {
        role: newRole,
      });
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update user role"
      );
    }
  };

  const handleDeleteUser = async (user: User) => {
    setUserToDelete(user);
    setDeleteModalOpened(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await userService.deleteUser(userToDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setDeleteModalOpened(false);
      setUserToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFullName = (user: User) => {
    if (user.first_name || user.last_name) {
      return `${user.first_name || ""} ${user.last_name || ""}`.trim();
    }
    return user.username;
  };

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between" align="center">
        <div>
          <Title order={2}>User Management</Title>
          <Text size="sm" c="dimmed">
            Manage user accounts, roles, and permissions
          </Text>
        </div>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => {
            /* TODO: Open create user modal */
          }}
        >
          Add User
        </Button>
      </Group>

      {/* Filters */}
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Group>
          <TextInput
            placeholder="Search users..."
            leftSection={<IconSearch size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Filter by role"
            data={[
              { value: "", label: "All Roles" },
              { value: "user", label: "User" },
              { value: "admin", label: "Admin" },
            ]}
            value={roleFilter}
            onChange={(value) => setRoleFilter(value || "")}
            clearable
          />
          <Select
            placeholder="Filter by status"
            data={[
              { value: "", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value || "")}
            clearable
          />
          <Button
            variant="light"
            leftSection={<IconRefresh size={16} />}
            onClick={fetchUsers}
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

      {/* Users Table */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        {loading ? (
          <Stack align="center" py="xl">
            <Loader size="lg" />
            <Text>Loading users...</Text>
          </Stack>
        ) : users.length === 0 ? (
          <Stack align="center" py="xl">
            <Text size="lg" c="dimmed">
              No users found
            </Text>
            <Text size="sm" c="dimmed">
              {searchTerm || roleFilter || statusFilter
                ? "Try adjusting your search criteria"
                : "No users available"}
            </Text>
          </Stack>
        ) : (
          <Stack gap="md">
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>User</Table.Th>
                  <Table.Th>Email</Table.Th>
                  <Table.Th>Role</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Registered</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {users.map((user) => (
                  <Table.Tr key={user.id}>
                    <Table.Td>
                      <div>
                        <Text fw={500}>{getFullName(user)}</Text>
                        <Text size="xs" c="dimmed">
                          @{user.username}
                        </Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{user.email}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Badge
                          variant="light"
                          color={user.role === "admin" ? "blue" : "gray"}
                          leftSection={
                            user.role === "admin" ? (
                              <IconShield size={12} />
                            ) : (
                              <IconUser size={12} />
                            )
                          }
                        >
                          {user.role}
                        </Badge>
                        <Switch
                          size="xs"
                          checked={user.role === "admin"}
                          onChange={() => handleToggleUserRole(user)}
                          title="Toggle admin role"
                        />
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Badge
                          variant="light"
                          color={user.is_active ? "green" : "red"}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Switch
                          size="xs"
                          checked={user.is_active}
                          onChange={() => handleToggleUserStatus(user)}
                          title="Toggle user status"
                        />
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{formatDate(user.created_at)}</Text>
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
                            View Profile
                          </Menu.Item>
                          <Menu.Item leftSection={<IconEdit size={14} />}>
                            Edit User
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item
                            leftSection={<IconTrash size={14} />}
                            color="red"
                            onClick={() => handleDeleteUser(user)}
                          >
                            Delete User
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
        title="Delete User"
        centered
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to delete user &quot;{userToDelete?.username}
            &quot;? This action cannot be undone.
          </Text>
          <Group justify="flex-end">
            <Button
              variant="subtle"
              onClick={() => setDeleteModalOpened(false)}
            >
              Cancel
            </Button>
            <Button color="red" onClick={confirmDelete}>
              Delete User
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
