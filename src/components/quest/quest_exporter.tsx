import { Affix, Transition, Text, Button, Modal, Textarea, Group, Divider, Loader, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import { HydratedQuest, QuestService } from "../../services/quest_service";
import { mapLuaQuestDetailTemplate } from "./quest_util";

export type QuestExportState = {
  selected: string[],
  setSelected: (selected: string[]) => void,
};

export const QuestExportContext = React.createContext<QuestExportState>({
  selected: [],
  setSelected: () => null,
});

export const QuestExporter = ({ children }: {
  children: React.ReactNode,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [quests, setQuests] = React.useState<HydratedQuest[]>([]); 

  const openAndFetch = async () => {
    setQuests([]);
    open();
    setQuests(await QuestService.getHydratedQuests({ ids: selected }));
  }
  
  return (
    <QuestExportContext.Provider value={{ selected, setSelected }}>
      {children}
      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition="slide-up" mounted={selected.length > 0}>
          {(transitionStyles) => (
            <Group>
              <Button variant="filled" onClick={() => openAndFetch()} style={transitionStyles}>
                Export
              </Button>
              <Button variant="outline" onClick={() => setSelected([])} style={transitionStyles}>
                Clear
              </Button>
            </Group>
          )}
        </Transition>
      </Affix>
      <Modal size="lg" opened={opened} onClose={close} title="Export quest details">
        {quests.length === 0 && <Loader />}
        {quests.length > 0 && (
          <Stack>
            <Text>{quests.length} quests to be exported</Text>
            <Textarea value={mapLuaQuestDetailTemplate(quests)} rows={20} />
            <Divider />
            <Textarea value={JSON.stringify(quests, null, 2)} rows={20} />
          </Stack>
        )}
      </Modal>
    </QuestExportContext.Provider>
  );
};
