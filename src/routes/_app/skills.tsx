import { createFileRoute, Outlet } from '@tanstack/react-router'
import { SkillContextProvider } from '../../components/skill/skill_context';

export const Route = createFileRoute('/_app/skills')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SkillContextProvider>
      <Outlet />
    </SkillContextProvider>
  );
}
