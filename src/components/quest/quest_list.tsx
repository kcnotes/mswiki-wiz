import { QuestService, QuestSummary } from "../../services/quest_service";
import { RowProps } from "../table/table";
import { Link } from "@tanstack/react-router";
import { Checkbox, Stack, Table as BaseTable, TableTd, TableTh, TableTr } from "@mantine/core";
import { Routes } from "../../paths";
import React from "react";
import { unique } from "../../base/array";
import { QuestDetail } from "./quest_util";
import { QuestExportContext } from "./quest_exporter";

type Column = "id" | "name" | "blocked";

const Row = ({ row, checked, select }: RowProps<Column> & { 
  checked: boolean,
  select: (checked: boolean, id: string, shiftKey: boolean) => void
 }) => (
  <TableTr p="xs">
    <TableTd p="xs">
      <Checkbox
        checked={checked}
        onChange={() => { }}
        onClick={(e) => select(e.currentTarget.checked, row.id, e.shiftKey)}
      />
    </TableTd>
    <TableTd p="xs">
      <Link to={Routes.quest(row.id)}>{row.id}</Link>
    </TableTd>
    <TableTd p="xs">{row.name}</TableTd>
    <TableTd p="xs">{row.blocked}</TableTd>
  </TableTr>
);

const Header = () => (
  <TableTr>
    <TableTh></TableTh>
    <TableTh>ID</TableTh>
    <TableTh>Name</TableTh>
    <TableTh>Blocked</TableTh>
  </TableTr>
);

export const QuestList = ({ quests }: { quests: QuestSummary[] }) => {
  const { selected, setSelected } = React.useContext(QuestExportContext);
  const [showBlocked, setShowBlocked] = React.useState(false);
  const [lastSelected, setLastSelected] = React.useState<string | null>(null);
  const data = quests
    .filter((q) => q.name != null)
    .filter((q) => (showBlocked ? true : !q.blocked))
    .map((q) => ({
      id: q.id,
      name: q.name ?? "",
      blocked: q.blocked ? "True" : "False",
    }));
  
  
  const select = async (checked: boolean, id: string, shiftKey: boolean) => {
    if (shiftKey && lastSelected != null) {
      const lastSelectedIndex = data.findIndex((d) => d.id === lastSelected);
      const currentIndex = data.findIndex((d) => d.id === id);
      const [start, end] = [lastSelectedIndex, currentIndex].sort((a, b) => a - b);
      if (selected.includes(lastSelected)) {
        setSelected(unique([...selected, ...data.slice(start, end + 1).map((d) => d.id)]));
      } else {
        console.log(selected, start, end);
        setSelected(unique(selected.filter((s) => !data.slice(start, end + 1).map((d) => d.id).includes(s))));
      }
    } else {
      if (checked) {
        setSelected(unique([...selected, id]));
      }
      else {
        setSelected(selected.filter((s) => s !== id));
      }
      setLastSelected(id);
    }
    const quests: QuestDetail[] = [];
    for (const img of selected) {
      quests.push((await QuestService.getHydratedQuest({ img })).questDetail);
    }
  }

  return (
    <Stack>
      <Checkbox checked={showBlocked} onChange={() => setShowBlocked(!showBlocked)} label="Show blocked quests" />
      <BaseTable horizontalSpacing="md" verticalSpacing="xs" miw={700}>
        <BaseTable.Thead>
          <Header />
        </BaseTable.Thead>
        <BaseTable.Tbody>
          {data.length > 0 && data.map((row) => (
            <Row row={row} key={row.id} select={select} checked={selected.includes(row.id)} />
          ))}
        </BaseTable.Tbody>
      </BaseTable>
    </Stack>
  );
};
