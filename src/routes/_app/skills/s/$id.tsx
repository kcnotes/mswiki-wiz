import { Flex, Stack, Textarea, Title } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router'
import { Topbar } from '../../../../components/navigation/topbar';
import { getBookId, getBookname } from '../../../../transforms/skill_book';
import { SkillContext } from '../../../../components/skill/skill_context';
import React from 'react';
import { Routes } from '../../../../paths';
import { useQuery } from '@tanstack/react-query';
import { SkillService } from '../../../../services/skill_service';
import { SkillProps } from '../../../../components/skill/skill_props';

export const Route = createFileRoute('/_app/skills/s/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams();
  const { strings } = React.useContext(SkillContext);
  const bookId = getBookId(id);
  const crumbs = [
    { label: 'Skills', path: Routes.skillSearch() },
    { label: `${getBookname(strings, id)} (${getBookId(id)})`, path: Routes.skillCategory(bookId) },
    { label: strings[id]?.name ?? 'Unknown skill', path: Routes.skill(id) },
  ];

  const {
    isLoading,
    data: skill,
  } = useQuery({
    queryKey: ["skill", id],
    queryFn: () => SkillService.getSkill(id),
  });

  if (isLoading || skill == null) {
    return (
      <Stack px="xs" align="center">
        <Title order={2}>Loading skill...</Title>
      </Stack>
    );
  }

  return (
    <Stack gap="sm">
      <Topbar crumbs={crumbs} />
      <Flex align="center" gap="xs">
        <Title order={2}>{strings[id]?.name ?? 'Unknown skill'} ({id})</Title>
      </Flex>
      <SkillProps id={id} skill={skill} strings={strings[id]} />
      <Textarea
        value={JSON.stringify({skill, string: strings[id]}, null, 2)}
        rows={18}
      />
    </Stack>
  );
}
