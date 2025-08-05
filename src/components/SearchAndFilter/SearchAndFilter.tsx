'use client';

import {
  Group,
  TextInput,
  Select,
  ActionIcon,
  rem,
  Stack,
  Paper,
} from '@mantine/core';
import { IconSearch, IconTag } from '@tabler/icons-react';
import { useSearch } from '@/context/SearchContext';
import { useTags } from '@/hooks/useTags';

export function SearchAndFilter() {
  const { searchQuery, selectedTag, setSearchQuery, setSelectedTag } = useSearch();
  const { tags, loading: tagsLoading } = useTags();

  const handleSearchInput = (value: string) => {
    setSearchQuery(value);
  };

  const handleSearch = () => {
    // Search is handled automatically via context and debounce
    // This function can be used for additional search actions if needed
  };

  return (
    <Paper p="md" radius="md" shadow="xs" style={{ marginBottom: '1.5rem' }}>
      <Stack gap="md">
        {/* Desktop layout */}
        <Group gap="md" visibleFrom="sm">
          <TextInput
            placeholder="Search quizzes..."
            value={searchQuery}
            onChange={(event) => handleSearchInput(event.currentTarget.value)}
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
              flex: 1,
              minWidth: '250px',
            }}
          />
          <Select
            placeholder="Filter by tag"
            value={selectedTag || ''}
            onChange={(value) => setSelectedTag(value || null)}
            data={[
              { value: '', label: 'All Tags' },
              ...tags.map(tag => ({ value: tag.name, label: tag.name }))
            ]}
            clearable
            leftSection={<IconTag style={{ width: rem(16), height: rem(16) }} />}
            style={{ 
              minWidth: '200px',
            }}
            disabled={tagsLoading}
          />
        </Group>

        {/* Mobile layout - stacked */}
        <Stack gap="sm" hiddenFrom="sm">
          <TextInput
            placeholder="Search quizzes..."
            value={searchQuery}
            onChange={(event) => handleSearchInput(event.currentTarget.value)}
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
          />
          <Select
            placeholder="Filter by tag"
            value={selectedTag || ''}
            onChange={(value) => setSelectedTag(value || null)}
            data={[
              { value: '', label: 'All Tags' },
              ...tags.map(tag => ({ value: tag.name, label: tag.name }))
            ]}
            clearable
            leftSection={<IconTag style={{ width: rem(16), height: rem(16) }} />}
            disabled={tagsLoading}
          />
        </Stack>
      </Stack>
    </Paper>
  );
}