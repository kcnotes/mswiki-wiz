import { Button, Grid, Stack, Table, TextInput } from "@mantine/core";
import { createFileRoute, Link } from "@tanstack/react-router";
import React from "react";
import { QuestSummary } from "../../../services/quest_service";
import { useForm } from "@mantine/form";
import { Routes } from "../../../paths";
import { QuestContext } from "../../../components/quest/quest_context";

export const Route = createFileRoute("/_app/quests/search")({
  component: RouteComponent,
});

function RouteComponent() {
  const {quests} = React.useContext(QuestContext);
  const [results, setResults] = React.useState<QuestSummary[]>([]);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      search: "",
    },
  });

  function searchQuests(search: string) {
    const results = quests?.filter((q) => q.name?.toLowerCase().includes(search.toLowerCase()));
    if (results != null && results.length > 500) {
      return setResults([]);
    }
    setResults(results || []);
  }

  return (
    <Stack gap="sm">
      <form onSubmit={form.onSubmit((v) => searchQuests(v.search))}>
        <Grid align="center">
          <Grid.Col span="auto">
            <TextInput
              placeholder="Search by quest name"
              key={form.key("search")}
              {...form.getInputProps("search")}
            />
          </Grid.Col>
          <Grid.Col span="content">
            <Button type="submit" variant="outline">
              Search
            </Button>
          </Grid.Col>
        </Grid>
      </form>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Name</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {results.map((q) => (
            <Table.Tr key={q.id}>
              <Table.Td><Link to={Routes.quest(q.id)}>{q.id}</Link></Table.Td>
              <Table.Td>{q.name}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  );
}
