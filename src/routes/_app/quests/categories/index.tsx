import { createFileRoute } from '@tanstack/react-router'
import { QuestCategoryList } from '../../../../components/quest/quest_category_list'
import { QuestContext } from '../../../../components/quest/quest_context'
import React from 'react'

export const Route = createFileRoute('/_app/quests/categories/')({
  component: RouteComponent,
})

function RouteComponent() {
  const {quests} = React.useContext(QuestContext);
  return <QuestCategoryList quests={quests || []} />
}
