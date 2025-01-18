import { Affix, Transition, Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";

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
  return (
    <QuestExportContext.Provider value={{ selected, setSelected }}>
      {children}
      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition="slide-up" mounted={selected.length > 0}>
          {(transitionStyles) => (
            <Button variant="filled" onClick={open} style={transitionStyles}>
              Export
            </Button>
          )}
        </Transition>
      </Affix>
      <Modal size="lg" opened={opened} onClose={close} title="Export quest details">
        {selected.join(", ")}
      </Modal>
    </QuestExportContext.Provider>
  );
};
