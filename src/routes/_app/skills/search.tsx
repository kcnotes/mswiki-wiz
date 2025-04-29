import { AnyRouter, createFileRoute, Link, useNavigate, useSearch } from '@tanstack/react-router';
import { SkillContext } from '../../../components/skill/skill_context';
import React from 'react';
import { Button, Grid, Stack, Table, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Routes } from '../../../paths';
import { getBookname } from '../../../components/skill/skill_util';

type SkillSearch = {
  q: string,
};

export const Route = createFileRoute('/_app/skills/search')({
  component: RouteComponent,
});

type Skill = {
  id: string,
  name: string,
};

function RouteComponent() {
  const navigate = useNavigate({ from: Route.fullPath });
  const search = useSearch({ from: '/_app/skills/search' });
  const { strings } = React.useContext(SkillContext);
  const [results, setResults] = React.useState<Skill[]>([]);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      search: search.q,
    },
  });

  React.useEffect(() => {
    if (search.q) {
      searchSkills(search.q);
    }
  }, [search.q]);

  function searchSkills(search: string) {
    const results = Object.entries(strings).filter(
      ([i, s]) => s?.name?.toLowerCase().includes(search.toLowerCase())
    ).map(([i, s]) => ({
      id: i,
      name: s?.name ?? '',
    }));
    if (results.length > 100) {
      return setResults(results.slice(0, 100));
    }
    console.log('results', results);
    setResults(results);
  }

  function onSubmit(search: string) {
    navigate({ search: { q: search } });
  }
  
  return (
    <Stack gap="sm">
      <form onSubmit={form.onSubmit((v) => onSubmit(v.search))}>
        <Grid align="center">
          <Grid.Col span="auto">
            <TextInput
              placeholder="Search by skill name"
              key={form.key('search')}
              {...form.getInputProps('search')}
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
            <Table.Th>Book</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {results.map((s) => (
            <Table.Tr key={s.id}>
              <Table.Td><Link to={Routes.skill(s.id)}>{s.id}</Link></Table.Td>
              <Table.Td>{s.name}</Table.Td>
              <Table.Td>{getBookname(strings, s.id)}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  );
}
