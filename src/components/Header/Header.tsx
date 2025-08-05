'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Group,
  Text,
  TextInput,
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
import { IconSearch, IconUser, IconLogout, IconSettings } from '@tabler/icons-react';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  height?: number;
}

export function Header({ height = 60 }: HeaderProps) {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [searchValue, setSearchValue] = useState('');
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

  const handleSearch = () => {
    if (searchValue.trim()) {
      // Handle search functionality here
      console.log('Searching for:', searchValue);
    }
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

            {/* Middle section - Search (hidden on mobile) */}
            <TextInput
              placeholder="Search quizzes..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSearch();
                }
              }}
              rightSection={
                <ActionIcon 
                  variant="light" 
                  onClick={handleSearch}
                  style={{ cursor: 'pointer' }}
                >
                  <IconSearch style={{ width: rem(16), height: rem(16) }} />
                </ActionIcon>
              }
              style={{ 
                minWidth: '300px',
                maxWidth: '400px',
                flex: 1,
                margin: '0 2rem'
              }}
              visibleFrom="md"
            />

            {/* Right section - Profile and mobile menu */}
            <Group gap="md">
              {/* Search icon for mobile */}
              <ActionIcon
                variant="light"
                size="lg"
                hiddenFrom="md"
                onClick={() => {
                  // For mobile, you might want to open a search modal or drawer
                  console.log('Mobile search clicked');
                }}
              >
                <IconSearch style={{ width: rem(18), height: rem(18) }} />
              </ActionIcon>

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
          <TextInput
            placeholder="Search quizzes..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSearch();
                close();
              }
            }}
            rightSection={
              <ActionIcon 
                variant="light" 
                onClick={() => {
                  handleSearch();
                  close();
                }}
              >
                <IconSearch style={{ width: rem(16), height: rem(16) }} />
              </ActionIcon>
            }
          />

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