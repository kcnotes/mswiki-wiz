import { Stack, Loader, Text, List, Flex } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Routes } from "../../paths";
import { QuestService } from "../../services/quest_service";

export const QuestPrerequisiteList = ({ id }: { id: number }) => {
  const {
    isLoading,
    error,
    data: quests,
  } = useQuery({
    queryKey: ['quest-prerequisites'],
    queryFn: () => QuestService.getQuestPrerequisites(),
  });

  if (error != null) {
    return (
      <Text c="red">{`Failed to load. Error: ${error}`}</Text>
    );
  }

  if (isLoading || quests == null) {
    return (
      <Flex align="center" gap="xs">
        <Loader />
        <Text>Loading quest prerequisites</Text>
      </Flex>
    );
  }

  const requires = quests.find(q => q.id === id)?.requires?.flatMap(prereq => quests.find(qq => qq.id === prereq)).filter(q => q != null);
  const unlocks = quests.filter(q => q.requires?.includes(id));

  return (
    <>
      {requires && requires.length > 0 && (
        <Stack gap="xs">
          <Text>This quest requires:</Text>
          <List>
            {requires.map(q => (
              <List.Item key={q.id}>
                <Link to={Routes.quest(`${q.id}.img`)}>{q.name} ({q.id})</Link>
              </List.Item>
            ))}
          </List>
        </Stack>
      )}
      {unlocks && unlocks.length > 0 && (
        <Stack gap="xs">
          <Text>This quest unlocks:</Text>
          <List>
            {unlocks.map(q => (
              <List.Item key={q.id}>
                <Link to={Routes.quest(`${q.id}.img`)}>{q.name} ({q.id})</Link>
              </List.Item>
            ))}
          </List>
        </Stack>
      )}
    </>
  );
};