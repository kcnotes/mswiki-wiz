import { AppShell } from '@mantine/core';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Navigation } from '../components/navigation/navigation';

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppShell
      navbar={{ width: 240, breakpoint: 0, collapsed: { mobile: false } }}
      padding="sm"
    >
      <AppShell.Navbar p="md">
        <Navigation />
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}