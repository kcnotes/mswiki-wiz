import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/quests/categories')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />;
}
