import { Stack, Text, Loader } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { QuestService } from '../../../../services/quest_service';
import { QuestList } from '../../../../components/quest/quest_list';
import { guessCategoryNames } from '../../../../components/quest/quest_util';

export const Route = createFileRoute('/_app/quests/categories/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams({});
  const {
    isPending,
    error,
    data: quests,
  } = useQuery({
    queryKey: ['quests'],
    queryFn: QuestService.getQuestNames,
  });
  const { error: categoryError, data: questCategories } = useQuery({
    queryKey: ['questCategories'],
    queryFn: QuestService.getQuestCategories,
  });
  
  if (error != null || categoryError != null) {
    return (
      <Text c="red">{`Failed to load. Error: ${error} ${categoryError}`}</Text>
    );
  }
  
  if (isPending || error || id == null || quests == null || questCategories == null) {
    return (
      <Stack px="xs" align="center">
        <Loader />
        <Text>Loading all quests and categories (~30 seconds)</Text>
      </Stack>
    )
  }

  const questsWithCategories = guessCategoryNames(quests, questCategories).filter(q => q.category === id);

  return <QuestList quests={questsWithCategories} />;
}
