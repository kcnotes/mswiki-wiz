import { createFileRoute, Outlet } from '@tanstack/react-router'
import { QuestContextProvider } from '../../components/quest/quest_context';
import { QuestExporter } from '../../components/quest/quest_exporter';

export const Route = createFileRoute('/_app/quests')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <QuestContextProvider>
      <QuestExporter>
        <Outlet />
      </QuestExporter>
    </QuestContextProvider>
  );
}
