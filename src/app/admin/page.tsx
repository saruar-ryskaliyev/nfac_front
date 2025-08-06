"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Stack, Title, Text, Tabs, Alert } from "@mantine/core";
import { IconShield, IconAlertCircle } from "@tabler/icons-react";
import { useAuth } from "@/context/AuthContext";
import { AdminDashboard } from "@/components/Admin/AdminDashboard";
import { QuizManagement } from "@/components/Admin/QuizManagement";
import { QuizGenerationForm } from "@/components/Admin/QuizGenerationForm";
import { UserManagement } from "@/components/Admin/UserManagement";
import { TagManagement } from "@/components/Admin/TagManagement";

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <Container size="lg" py="xl">
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Access Denied"
          color="red"
        >
          You do not have permission to access this page. Admin privileges
          required.
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Stack gap="xs">
          <Title
            order={1}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <IconShield size={32} color="var(--mantine-color-blue-6)" />
            Admin Dashboard
          </Title>
          <Text size="lg" c="dimmed">
            Manage quizzes, users, and system settings
          </Text>
        </Stack>

        {/* Admin Tabs */}
        <Tabs defaultValue="generate" orientation="horizontal">
          <Tabs.List>
            <Tabs.Tab value="generate">Generate Quiz</Tabs.Tab>
            <Tabs.Tab value="quizzes">Quiz Management</Tabs.Tab>
            {/* <Tabs.Tab value="users">User Management</Tabs.Tab> */}
            <Tabs.Tab value="tags">Tag Management</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="generate" pt="xl">
            <QuizGenerationForm />
          </Tabs.Panel>

          <Tabs.Panel value="quizzes" pt="xl">
            <QuizManagement />
          </Tabs.Panel>
{/* 
          <Tabs.Panel value="users" pt="xl">
            <UserManagement />
          </Tabs.Panel> */}

          <Tabs.Panel value="tags" pt="xl">
            <TagManagement />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}
