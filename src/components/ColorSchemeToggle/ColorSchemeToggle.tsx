"use client";

import { Button, Group, useMantineColorScheme } from "@mantine/core";

export function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <Group justify="center" mt="xl">
      <Button
        onClick={() => setColorScheme("light")}
        variant={colorScheme === "light" ? "filled" : "outline"}
      >
        Light
      </Button>
      <Button
        onClick={() => setColorScheme("dark")}
        variant={colorScheme === "dark" ? "filled" : "outline"}
      >
        Dark
      </Button>
      <Button
        onClick={() => setColorScheme("auto")}
        variant={colorScheme === "auto" ? "filled" : "outline"}
      >
        Auto
      </Button>
    </Group>
  );
}
