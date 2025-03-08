import { Stack, Text, List, ActionIcon, Tooltip, Flex } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { Routes } from "../../paths";
import { QuestContext } from "./quest_context";
import React from "react";
import { IconCopy } from "@tabler/icons-react";
import { copyQuestLink } from "./quest_util";

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
                <Flex gap="xs">
                  <Link to={Routes.quest(q.id)}>{q.name} ({q.id})</Link>
                  {q.blocked && <Text span={true}>(blocked)</Text>}
                  <Tooltip label="Copy wikitext link">
                    <ActionIcon variant="subtle" onClick={() => copyQuestLink(q.name)}>
                      <IconCopy size={14} />
                    </ActionIcon>
                  </Tooltip>
                </Flex>
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
                <Flex gap="xs">
                  <Link to={Routes.quest(q.id)}>{q.name} ({q.id})</Link>
                  {q.blocked && <Text span={true}> (blocked)</Text>}
                  <Tooltip label="Copy wikitext link">
                    <ActionIcon variant="subtle" onClick={() => copyQuestLink(q.name)}>
                      <IconCopy size={14} />
                    </ActionIcon>
                  </Tooltip>
                </Flex>
              </List.Item>
            ))}
          </List>
        </Stack>
      )}
    </>
  );
};