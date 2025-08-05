import { QuizGrid } from "@/components/QuizGrid";
import { SearchAndFilter } from "@/components/SearchAndFilter";
import { Container } from "@mantine/core";

export default function HomePage() {
  return (
    <Container size="xl" py="md">
      <SearchAndFilter />
      <QuizGrid />
    </Container>
  );
}
