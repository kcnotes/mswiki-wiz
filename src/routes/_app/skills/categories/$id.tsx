import { createFileRoute, Link } from '@tanstack/react-router'
import React from 'react'
import { SkillCategory, SkillService } from '../../../../services/skill_service'
import { Checkbox, Flex, Stack, TableOfContents, Title } from '@mantine/core';
import { SkillContext } from '../../../../components/skill/skill_context';
import { Routes } from '../../../../paths';
import { SkillProps } from '../../../../components/skill/skill_props';

export const Route = createFileRoute('/_app/skills/categories/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams();
  const [category, setCategory] = React.useState<SkillCategory | null>(null);
  const [icons, setIcons] = React.useState<{ id: string, icon: string }[]>([]);
  const [showInvisible, setShowInvisible] = React.useState(false);
  const { strings } = React.useContext(SkillContext);

  React.useEffect(() => {
    SkillService.getSkillCategory(id).then(c => {
      setCategory(c);
      SkillService.getSkillPngs(id, c).then(icons => {
        setIcons(icons);
      });
    });
  }, [id]);

  const reinitializeRef = React.useRef(() => {});

  React.useEffect(() => {
    reinitializeRef.current();
  }, [showInvisible, category]);
  
  const skills = Object.entries(category?.skill || {})
    .filter(([_, skill]) => showInvisible || !skill.invisible);
  
  const numInvisible = Object.entries(category?.skill || {})
    .filter(([_, skill]) => skill.invisible).length;

  return (
    <Stack gap="md">
      <Checkbox checked={showInvisible} onChange={() => setShowInvisible(!showInvisible)} label={`Show invisible (${numInvisible})`} />
      <TableOfContents
        reinitializeRef={reinitializeRef}
        scrollSpyOptions={{
          selector: ':is(h1, h2, h3, h4, h5, h6)',
        }}
        getControlProps={({ data }) => ({
          onClick: () => data.getNode().scrollIntoView(),
          children: data.value,
        })}
      />
      {skills.map(([skillId, skill]) => (
        <Stack key={`${skillId}`} gap="xs">
          <Flex align="center" gap="xs">
            {icons?.find(i => i.id === skillId)?.icon && (
              <img src={`data:image/png;base64,${icons?.find(i => i.id === skillId)?.icon}`} width="32px" height="32px" />
            )}
            <Title order={2}>
              <Link to={Routes.skill(skillId)}>
                {strings[skillId]?.name ?? 'Unknown skill'}
              </Link>&nbsp;({skillId})
            </Title>
          </Flex>
          <SkillProps id={skillId} skill={skill} strings={strings[skillId]} />
        </Stack>
      ))}
    </Stack>
  );
}
