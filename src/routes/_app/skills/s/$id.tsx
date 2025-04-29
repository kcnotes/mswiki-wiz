import { Flex, Stack, Table, Text, Title } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router'
import { Topbar } from '../../../../components/navigation/topbar';
import { getBookId, getBookname, getSkillProps } from '../../../../components/skill/skill_util';
import { SkillContext } from '../../../../components/skill/skill_context';
import React from 'react';
import { Routes } from '../../../../paths';
import { useQuery } from '@tanstack/react-query';
import { SkillService } from '../../../../services/skill_service';
import { parseString } from '../../../../base/string';
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
    error,
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
    </Stack>
  );
}
