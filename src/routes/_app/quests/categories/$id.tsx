import { createFileRoute } from '@tanstack/react-router'
import { QuestList } from '../../../../components/quest/quest_list';
import { QuestContext } from '../../../../components/quest/quest_context';
import React from 'react';

export const Route = createFileRoute('/_app/quests/categories/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams();
  const data = React.useContext(QuestContext);

  const quests = data.quests?.filter(q  => q.category === id);

  return (
    <QuestList quests={quests || []} />
  );
}
