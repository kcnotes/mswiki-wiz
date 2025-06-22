import { Stack, Text } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import { SkillExportForm } from '../../../../components/skill/export/skill_export_form';

export const Route = createFileRoute('/_app/skills/export/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack gap="xs">
      <Text>Exports skills into wiki-compatible JSON format. Provide a list of skill IDs.</Text>
      <SkillExportForm />
    </Stack>
  );
}
