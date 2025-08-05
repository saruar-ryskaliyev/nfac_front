'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Group,
  Text,
  Avatar,
  ActionIcon,
  Burger,
  Drawer,
  Stack,
  Button,
  Menu,
  rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconUser, IconLogout, IconSettings, IconShield } from '@tabler/icons-react';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  height?: number;
}

export function Header({ height = 60 }: HeaderProps) {
  const [opened, { toggle, close }] = useDisclosure(false);
  const { user, isAuthenticated, signout } = useAuth();
  const router = useRouter();

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      router.push('/auth');
    }
  };

  const handleSignout = () => {
    signout();
    router.push('/');
  };


  return (
    <>
      <header 
        style={{ 
          height: `${height}px`,
          padding: '1rem',
          borderBottom: '1px solid #dee2e6',
          backgroundColor: 'white',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Group justify="space-between" style={{ flex: 1 }}>
            {/* Left section - Title */}
            <Text
              size="xl"
              fw={700}
              style={{ 
                color: 'var(--mantine-color-blue-6)',
                cursor: 'pointer',
                fontSize: 'clamp(1.2rem, 4vw, 1.5rem)'
              }}
              onClick={() => router.push('/')}
            >
              NFactorial Quiz
            </Text>


            {/* Right section - Profile and mobile menu */}
            <Group gap="md">

              {/* Profile section */}
              {isAuthenticated && user ? (
                <Menu shadow="md" width={180}>
                  <Menu.Target>
                    <div style={{ cursor: 'pointer' }}>
                      <Group gap="xs">
                        <Avatar
                          size="sm"
                          radius="xl"
                          color="blue"
                        >
                          {user.username?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                        </Avatar>
                        <Text 
                          size="sm" 
                          visibleFrom="sm"
                          style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                        >
                          {user.username || user.email}
                        </Text>
                      </Group>
                    </div>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Label>Account</Menu.Label>
                    {user.role === 'admin' && (
                      <>
                        <Menu.Item 
                          leftSection={<IconShield style={{ width: rem(14), height: rem(14) }} />}
                          onClick={() => router.push('/admin')}
                        >
                          Admin Dashboard
                        </Menu.Item>
                        <Menu.Divider />
                      </>
                    )}
                    <Menu.Item 
                      leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}
                    >
                      Settings
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item 
                      color="red"
                      leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
                      onClick={handleSignout}
                    >
                      Sign Out
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ) : (
                <div
                  style={{ cursor: 'pointer' }}
                  onClick={handleProfileClick}
                >
                  <Group gap="xs">
                    <ActionIcon variant="light" size="lg">
                      <IconUser style={{ width: rem(18), height: rem(18) }} />
                    </ActionIcon>
                    <Text size="sm" visibleFrom="sm">
                      Sign In
                    </Text>
                  </Group>
                </div>
              )}

              {/* Mobile menu burger */}
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="md"
                size="sm"
              />
            </Group>
          </Group>
        </div>
      </header>

      {/* Mobile drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        size="sm"
        title="Menu"
      >
        <Stack gap="md">
          {!isAuthenticated ? (
            <Button 
              variant="filled"
              onClick={() => {
                router.push('/auth');
                close();
              }}
            >
              Sign In
            </Button>
          ) : (
            <Stack gap="xs">
              <Text size="sm" c="dimmed">
                Signed in as {user?.username || user?.email}
              </Text>
              {user?.role === 'admin' && (
                <Button 
                  variant="light"
                  color="blue"
                  leftSection={<IconShield style={{ width: rem(16), height: rem(16) }} />}
                  onClick={() => {
                    router.push('/admin');
                    close();
                  }}
                >
                  Admin Dashboard
                </Button>
              )}
              <Button 
                variant="light"
                color="red"
                leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} />}
                onClick={() => {
                  handleSignout();
                  close();
                }}
              >
                Sign Out
              </Button>
            </Stack>
          )}
        </Stack>
      </Drawer>
    </>
  );
}