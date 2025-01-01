import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { QuestService } from '../../../services/quest_service'
import { Divider, Loader, Stack, Text, Textarea, Title } from '@mantine/core';
import { NpcService } from '../../../services/npc_service';
import React from 'react';
import { getRawHtml, getRawWikitext } from '../../../base/string';
import { QuestPrerequisiteList } from '../../../components/quest/quest_prerequisite_list';

export const Route = createFileRoute('/_app/quests/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams({});
  const [startingNpcPng, setStartingNpcPng] = React.useState<string | null>(null);
  const [startingNpcName, setStartingNpcName] = React.useState<string | null>(null);
  const {
    isLoading,
    error,
    data: quest,
  } = useQuery({
    queryKey: ['quest', id],
    queryFn: () => QuestService.getHydratedQuest({ img: id }),
  });
  const {
    error: questsError,
    data: quests,
  } = useQuery({
    queryKey: ["quests"],
    queryFn: QuestService.getQuestNames,
  });
  
  if (error != null || questsError != null) {
    console.log(error, questsError);
    return (
      <Text c="red">{`Failed to load. Error: ${error} ${questsError}`}</Text>
    );
  }

  if (isLoading || quest == null || quests == null) {
    return (
      <Stack px="xs" align="center">
        <Loader />
        <Text>Loading all quests and categories (~30 seconds)</Text>
      </Stack>
    );
  }

  if (quest.questDetail?.startingNpc != null) {
    NpcService.getNpcPng({ id: quest.questDetail.startingNpc }).then(png => {
      setStartingNpcPng(png);
    });
    NpcService.getNpcName({ id: quest.questDetail.startingNpc }).then(npc => {
      setStartingNpcName(npc.name ?? null);
    });
  }

  return (
    <Stack gap="sm" align="start">
      <Title order={2}>{`${quest.questDetail.type ?? ''} ${quest.questDetail.name}`}</Title>
      <QuestPrerequisiteList id={Number(id.slice(0, -4))} />
      {startingNpcPng != null && (
        <img src={`data:image/png;base64,${startingNpcPng}`} />
      )}
      <Text>{startingNpcName}</Text>
      {quest.stringParams && (
        <>
          <div dangerouslySetInnerHTML={{ __html: getRawHtml(quest.questDetail.text.available ?? '', quest.stringParams) }} />
          <div dangerouslySetInnerHTML={{ __html: getRawHtml(quest.questDetail.text.inProgress ?? '', quest.stringParams) }} />
          <div dangerouslySetInnerHTML={{ __html: getRawHtml(quest.questDetail.text.completed ?? '', quest.stringParams) }} />
        </>
      )}
      <Textarea rows={1} value={getRawWikitext(quest.questDetail.text.available ?? '', quest.stringParams)} w="100%" />
      <Textarea rows={1} value={getRawWikitext(quest.questDetail.text.inProgress ?? '', quest.stringParams)} w="100%" />
      <Textarea rows={1} value={getRawWikitext(quest.questDetail.text.completed ?? '', quest.stringParams)} w="100%" />
      <Divider/>
      <Textarea rows={30} value={JSON.stringify(quest, null, 4)} w="100%"/>
    </Stack>
  );
}
