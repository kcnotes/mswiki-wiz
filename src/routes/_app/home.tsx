import { createFileRoute } from '@tanstack/react-router'
import { Alert, Stack } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react';

export const Route = createFileRoute('/_app/home')({
  component: RouteComponent,
})

function RouteComponent() {
  const icon = <IconInfoCircle />;
  return <Stack gap="0">
    <Alert icon={icon} title="Welcome!" color="blue"/>
  </Stack>
}
