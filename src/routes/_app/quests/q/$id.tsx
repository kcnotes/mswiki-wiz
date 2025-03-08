import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { QuestService } from '../../../../services/quest_service'
import { Button, Code, Divider, Flex, Loader, Stack, Table, Text, Textarea, Title } from '@mantine/core'
import { NpcService } from '../../../../services/npc_service'
import React from 'react'
import { getFormattedString } from '../../../../base/string'
import { QuestPrerequisiteList } from '../../../../components/quest/quest_prerequisite_list'
import { Routes } from '../../../../paths'
import { Topbar } from '../../../../components/navigation/topbar'
import { QuestExporter } from '../../../../components/quest/quest_exporter'
import { QuestContext, QuestContextProvider } from '../../../../components/quest/quest_context'
import { copyQuestLink, getQuestPageWikitext } from '../../../../components/quest/quest_util'
import { IconCopy } from '@tabler/icons-react'
import { copy } from '../../../../components/base/copy'

export const Route = createFileRoute('/_app/quests/q/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams({})
  const [startingNpcPng, setStartingNpcPng] = React.useState<string | null>(
    null,
  )
  const [startingNpcName, setStartingNpcName] = React.useState<string | null>(
    null,
  )
  const {
    isLoading,
    error,
    data: quest,
  } = useQuery({
    queryKey: ['quest', id],
    queryFn: () => QuestService.getHydratedQuest({ img: id }),
  });
  const { quests } = React.useContext(QuestContext);
  const category = quests?.find(q => q.id === id)?.category ?? 'Unknown';

  const crumbs = [
    { label: 'Quests', path: Routes.questSearch() },
    { label: category, path: Routes.questCategory(category) },
    { label: id.toString(), path: Routes.quest(id) },
  ]

  React.useEffect(() => {
    if (quest?.questDetail?.startingNpc != null) {
      NpcService.getNpcPng({ id: quest.questDetail.startingNpc }).then((png) => {
        setStartingNpcPng(png);
      })
      NpcService.getNpcName({ id: quest.questDetail.startingNpc }).then((npc) => {
        setStartingNpcName(npc.name ?? null);
      })
    } else {
      setStartingNpcPng(null);
      setStartingNpcName(null);
    }
  }, [quest]);

  if (error != null) {
    return (
      <Text c="red">{`Failed to load. Error: ${error}`}</Text>
    )
  }

  if (isLoading || quest == null || quests == null) {
    return (
      <Stack px="xs" align="center">
        <Loader />
        <Text>Loading quest</Text>
      </Stack>
    )
  }

  return (
    <QuestContextProvider>
      <QuestExporter>
        <Stack gap="sm" align="start">
          <Topbar crumbs={crumbs} />
          <Title
            order={2}
          >
            {`${quest.questDetail.type ?? ''} ${quest.questDetail.name}${quest.questDetail.blocked ? ' (blocked)' : ''}`}
          </Title>
          <Flex gap="xs">
            <Button variant="outline" size="compact-sm" onClick={() => copy(quest.questDetail.id.toString())}>
              <Flex align="center" gap="xs">
                <IconCopy size={14} />
                Copy ID
              </Flex>
            </Button>
            <Button variant="outline" size="compact-sm" onClick={() => copyQuestLink(quest.questDetail.name)}>
              <Flex align="center" gap="xs">
                <IconCopy size={14} />
                Copy link
              </Flex>
            </Button>
            <Button variant="outline" size="compact-sm" onClick={() => copy(getQuestPageWikitext(quest, category))}>
              <Flex align="center" gap="xs">
                <IconCopy size={14} />
                Copy page
              </Flex>
            </Button>
          </Flex>
          <QuestPrerequisiteList id={Number(id.slice(0, -4))} />
          {startingNpcPng != null && (
            <img src={`data:image/png;base64,${startingNpcPng}`} />
          )}
          <Text>{startingNpcName ?? 'Self'}</Text>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>State</Table.Th>
                <Table.Th>Quest text</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>Available</Table.Td>
                <Table.Td>
                  <div dangerouslySetInnerHTML={{
                    __html: getFormattedString(quest.questDetail.text.available ?? '', quest.stringParams, 'html')
                  }} />
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>In progress</Table.Td>
                <Table.Td>
                  <div dangerouslySetInnerHTML={{
                    __html: getFormattedString(quest.questDetail.text.inProgress ?? '', quest.stringParams, 'html')
                  }} />
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Completed</Table.Td>
                <Table.Td>
                  <div dangerouslySetInnerHTML={{
                    __html: getFormattedString(quest.questDetail.text.completed ?? '', quest.stringParams, 'html')
                  }} />
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
          <Divider />
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>State</Table.Th>
                <Table.Th>Quest text</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>Available</Table.Td>
                <Code>
                  {getFormattedString(quest.questDetail.text.available ?? '', quest.stringParams, 'wikitext')}
                </Code>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>In progress</Table.Td>
                <Code>
                  {getFormattedString(quest.questDetail.text.inProgress ?? '', quest.stringParams, 'wikitext')}
                </Code>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Completed</Table.Td>
                <Code>
                  {getFormattedString(quest.questDetail.text.completed ?? '', quest.stringParams, 'wikitext')}
                </Code>
              </Table.Tr>
            </Table.Tbody>
          </Table>
          <Divider />
          <Textarea rows={30} value={JSON.stringify(quest, null, 4)} w="100%" />
        </Stack>
      </QuestExporter>
    </QuestContextProvider>
  )
}
