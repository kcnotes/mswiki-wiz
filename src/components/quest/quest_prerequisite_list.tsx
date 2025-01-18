import { Stack, Loader, Text, List, Flex } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Routes } from "../../paths";
import { QuestService } from "../../services/quest_service";
import { QuestContext } from "./quest_context";
import React from "react";

export const QuestPrerequisiteList = ({ id }: { id: number }) => {

  const {quests} = React.useContext(QuestContext);

  const requires = quests.find(q => Number(q.id.split('.')[0]) === id)?.requires?.flatMap(prereq => quests.find(qq => Number(qq.id.split('.')[0]) === prereq)).filter(q => q != null);
  const unlocks = quests.filter(q => q.requires?.includes(id));

  return (
    <>
      {requires && requires.length > 0 && (
        <Stack gap="xs">
          <Text>This quest requires:</Text>
          <List>
            {requires.map(q => (
              <List.Item key={q.id}>
                <Link to={Routes.quest(q.id)}>{q.name} ({q.id})</Link>
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
                <Link to={Routes.quest(q.id)}>{q.name} ({q.id})</Link>
              </List.Item>
            ))}
          </List>
        </Stack>
      )}
    </>
  );
};