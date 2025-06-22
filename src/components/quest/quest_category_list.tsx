import { QuestSummary } from "../../services/quest_service";
import { RowProps, Table } from "../table/table";
import { groupBy } from "../../base/array";
import { Link } from "@tanstack/react-router";
import { TableTd, TableTh, TableTr } from "@mantine/core";
import { Routes } from "../../paths";

type Column = "id" | "count";

const Row = ({ row }: RowProps<Column>) => (
  <TableTr p="xs">
      <TableTd p="xs"><Link to={Routes.questCategory(row.id)}>{row.id}</Link></TableTd>
      <TableTd p="xs">{row.count}</TableTd>
  </TableTr>
);

const Header = () => (
  <TableTr>
    <TableTh>Category</TableTh>
    <TableTh>Count</TableTh>
  </TableTr>
);

export const QuestCategoryList = ({ quests }: { quests: QuestSummary[] }) => {
  const questsByCategory = groupBy(quests, (q) => q.area?.toString() ?? 'Unknown');
  const data = Object.entries(questsByCategory).map(([category, quests]) => ({
    id: category,
    count: quests.length.toString(),
  }));

  return <Table data={data} Header={Header} Row={Row} />;
};
