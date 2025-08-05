"use client";

import { useState, useEffect } from "react";
import {
  Stack,
  Title,
  SimpleGrid,
  Card,
  Text,
  Group,
  Badge,
  Progress,
  Loader,
  Alert,
  Button,
} from "@mantine/core";
import {
  IconUsers,
  IconClipboardList,
  IconTag,
  IconTrophy,
  IconRefresh,
  IconAlertCircle,
  IconTrendingUp,
  IconClock,
} from "@tabler/icons-react";
import { userService } from "@/services/user";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  recentRegistrations: number;
  totalQuizzes: number;
  publicQuizzes: number;
  totalTags: number;
  totalAttempts: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const userStats = await userService.getUserStats().catch(() => ({
        total_users: 0,
        active_users: 0,
        admin_users: 0,
        recent_registrations: 0,
      }));

      const realStats: DashboardStats = {
        totalUsers: userStats.total_users,
        activeUsers: userStats.active_users,
        adminUsers: userStats.admin_users,
        recentRegistrations: userStats.recent_registrations,
        totalQuizzes: 0, // TODO: Add quiz stats API endpoint
        publicQuizzes: 0, // TODO: Add quiz stats API endpoint
        totalTags: 0, // TODO: Add tag stats API endpoint
        totalAttempts: 0, // TODO: Add attempt stats API endpoint
      };

      setStats(realStats);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch statistics"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Stack align="center" py="xl">
        <Loader size="lg" />
        <Text>Loading dashboard statistics...</Text>
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert
        icon={<IconAlertCircle size="1rem" />}
        title="Error Loading Dashboard"
        color="red"
        variant="light"
      >
        <Text mb="md">{error}</Text>
        <Button variant="light" size="sm" onClick={fetchStats}>
          Try Again
        </Button>
      </Alert>
    );
  }

  if (!stats) return null;

  const userActivityRate =
    stats.totalUsers > 0 ? (stats.activeUsers / stats.totalUsers) * 100 : 0;
  const quizPublicRate =
    stats.totalQuizzes > 0
      ? (stats.publicQuizzes / stats.totalQuizzes) * 100
      : 0;

  return (
    <Stack gap="xl">
    
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Text size="lg" fw={600}>
            Quick Actions
          </Text>
          <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
            <Button variant="light" color="blue" fullWidth>
              Create New Quiz
            </Button>
            <Button variant="light" color="green" fullWidth>
              Add New User
            </Button>
            <Button variant="light" color="violet" fullWidth>
              Manage Tags
            </Button>
            <Button variant="light" color="orange" fullWidth>
              View Reports
            </Button>
          </SimpleGrid>
        </Stack>
      </Card>
    </Stack>
  );
}
