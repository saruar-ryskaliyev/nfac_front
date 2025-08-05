'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Alert,
  Tabs,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useAuth } from '@/context/AuthContext';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string | null>('signin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signin, signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (activeTab === 'signup') {
        await signup({
          email: formData.email,
          password: formData.password,
          username: formData.name,
        });
      } else {
        await signin({
          email: formData.email,
          password: formData.password,
        });
      }
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Container size={450} my={40}>
      <Title ta="center" mb="md">
        Welcome to NFactorial Quiz
      </Title>
      
      <Text c="dimmed" size="sm" ta="center" mb="xl">
        Sign in to your account or create a new one to start learning
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List grow>
            <Tabs.Tab value="signin">
              Sign In
            </Tabs.Tab>
            <Tabs.Tab value="signup">
              Sign Up
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="signin" pt="md">
            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                {error && (
                  <Alert icon={<IconAlertCircle size="1rem" />} color="red">
                    {error}
                  </Alert>
                )}

                <TextInput
                  label="Email"
                  placeholder="your@email.com"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />

                <PasswordInput
                  label="Password"
                  placeholder="Your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />

                <Button 
                  type="submit" 
                  fullWidth 
                  mt="xl" 
                  loading={loading}
                >
                  Sign In
                </Button>
              </Stack>
            </form>
          </Tabs.Panel>

          <Tabs.Panel value="signup" pt="md">
            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                {error && (
                  <Alert icon={<IconAlertCircle size="1rem" />} color="red">
                    {error}
                  </Alert>
                )}

                <TextInput
                  label="Username"
                  placeholder="Your username"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />

                <TextInput
                  label="Email"
                  placeholder="your@email.com"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />

                <PasswordInput
                  label="Password"
                  placeholder="Your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />

                <Button 
                  type="submit" 
                  fullWidth 
                  mt="xl" 
                  loading={loading}
                >
                  Create Account
                </Button>
              </Stack>
            </form>
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Container>
  );
}