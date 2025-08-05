import { QuizGrid } from "@/components/QuizGrid";
import { Container } from "@mantine/core";

export default function HomePage() {
  return (
    <Container size="xl" py="md">
      <QuizGrid />
    </Container>
  );
}
