"use client";

import { Title, Text, Button, Container } from "@mantine/core";

export function Welcome() {
  return (
    <Container size="md" py="xl">
      <Title
        order={1}
        size="h1"
        style={{ fontFamily: "Greycliff CF, var(--mantine-font-family)" }}
        ta="center"
        mt="xl"
      >
        Welcome to{" "}
        <Text
          inherit
          variant="gradient"
          component="span"
          gradient={{ from: "pink", to: "yellow" }}
        >
          Mantine
        </Text>
      </Title>
      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        This starter Next.js project includes a minimal setup for server side
        rendering, if you want to learn more on Mantine + Next.js integration
        follow{" "}
        <Text
          component="a"
          c="blue"
          href="https://mantine.dev/guides/next/"
          target="_blank"
        >
          this guide
        </Text>
        . To get started edit src/app/page.tsx file.
      </Text>
      <Button
        size="xl"
        variant="gradient"
        gradient={{ from: "pink", to: "yellow" }}
        mt="xl"
        mx="auto"
        style={{ display: "block" }}
      >
        Get started
      </Button>
    </Container>
  );
}
