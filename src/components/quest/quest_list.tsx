import { QuestSummary } from "../../services/quest_service";
import { RowProps, Table } from "../table/table";
import { Link } from "@tanstack/react-router";
import { TableTd, TableTh, TableTr } from "@mantine/core";
import { Routes } from "../../paths";

type Column = "id" | "name";

const Row = ({ row }: RowProps<Column>) => (
  <TableTr p="xs">
      <TableTd p="xs"><Link to={Routes.quest(row.id)}>{row.id}</Link></TableTd>
      <TableTd p="xs">{row.name}</TableTd>
  </TableTr>
);

const Header = () => (
  <TableTr>
    <TableTh>ID</TableTh>
    <TableTh>Name</TableTh>
  </TableTr>
);

export const QuestList = ({ quests, hideSearch }: { quests: QuestSummary[], hideSearch?: boolean }) => {
  var data = quests.filter(q => q.name != null).map(q => ({
    id: q.id,
    name: q.name ?? '',
  }));
  return <Table data={data} Header={Header} Row={Row} hideSearch={hideSearch} />;
};
