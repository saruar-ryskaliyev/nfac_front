'use client';

import { useState } from 'react';
import { Button, TextInput, Paper, Title, Stack, Alert, Text, Group } from '@mantine/core';
import { useAuth } from '@/hooks/useAuth';

export default function TestAuthPage() {
  const { user, signin, signup, signout, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignin = async () => {
    try {
      setError('');
      setSuccess('');
      await signin({ email, password });
      setSuccess('Signed in successfully!');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Signin failed');
      }
    }
  };

  const handleSignup = async () => {
    try {
      setError('');
      setSuccess('');
      await signup({ email, password, username });
      setSuccess('Signed up successfully!');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Signup failed');
      }
    }
  };

  const handleSignout = () => {
    signout();
    setSuccess('Signed out successfully!');
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <Title order={1} mb="xl">Auth Test Page</Title>
      
      {error && (
        <Alert color="red" mb="md">
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert color="green" mb="md">
          {success}
        </Alert>
      )}

      {isAuthenticated ? (
        <Paper p="xl" withBorder>
          <Title order={2} mb="md">User Info</Title>
          <Stack gap="sm">
            <Text><strong>Email:</strong> {user?.email}</Text>
            <Text><strong>Username:</strong> {user?.username}</Text>
            <Text><strong>ID:</strong> {user?.id}</Text>
            <Text><strong>Active:</strong> {user?.is_active ? 'Yes' : 'No'}</Text>
            <Text><strong>Verified:</strong> {user?.is_verified ? 'Yes' : 'No'}</Text>
            <Button onClick={handleSignout} color="red">
              Sign Out
            </Button>
          </Stack>
        </Paper>
      ) : (
        <Paper p="xl" withBorder>
          <Stack gap="md">
            <TextInput
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
            />
            <TextInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <TextInput
              label="Username (for signup)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
            
            <Group>
              <Button onClick={handleSignin} disabled={!email || !password}>
                Sign In
              </Button>
              <Button 
                onClick={handleSignup} 
                disabled={!email || !password || !username}
                variant="outline"
              >
                Sign Up
              </Button>
            </Group>
          </Stack>
        </Paper>
      )}
    </div>
  );
}