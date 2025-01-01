import { Loader, Stack, Text } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import { QuestService } from '../../../../services/quest_service'
import { QuestCategoryList } from '../../../../components/quest/quest_category_list'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/_app/quests/categories/')({
  component: RouteComponent,
})

function RouteComponent() {
  const {
    isPending,
    error,
    data: quests,
  } = useQuery({
    queryKey: ['quests'],
    queryFn: QuestService.getQuestNames,
  });
  const { data: questCategories } = useQuery({
    queryKey: ['questCategories'],
    queryFn: QuestService.getQuestCategories,
  });
  
  if (error != null) {
    return (
      <Text c="red">{`Failed to load. Error: ${error}`}</Text>
    );
  }

  if (isPending || quests == null || questCategories == null) {
    return (
      <Stack px="xs" align="center">
        <Loader />
        <Text>Loading all quests and categories (~30 seconds)</Text>
      </Stack>
    )
  }

  return <QuestCategoryList quests={quests} questCategories={questCategories} />
}
