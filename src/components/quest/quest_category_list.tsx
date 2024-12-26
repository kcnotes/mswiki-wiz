import { Quest, QuestCategory } from "../../services/quest_service";
import { RowProps, Table } from "../table/table";
import { groupBy } from "../../base/array";
import { Link } from "@tanstack/react-router";
import { TableTd, TableTh, TableTr } from "@mantine/core";
import { guessCategoryNames } from "./quest_util";

type Column = "id" | "count";

const Row = ({ row }: RowProps<Column>) => (
  <TableTr>
      <TableTd><Link to={`/quests/${row.id}`}>{row.id}</Link></TableTd>
      <TableTd>{row.count}</TableTd>
  </TableTr>
);

const Header = () => (
  <TableTr>
    <TableTh>Category</TableTh>
    <TableTh>Count</TableTh>
  </TableTr>
);

export const QuestCategoryList = ({ quests, questCategories }: { quests: Quest[], questCategories: QuestCategory[] }) => {
  const questsWithCategories = guessCategoryNames(quests, questCategories);
  const questsByCategory = groupBy(questsWithCategories, (q) => q.category);
  const data = Object.entries(questsByCategory).map(([category, quests]) => ({
    id: category,
    count: quests.length.toString(),
  }));

  return <Table data={data} Header={Header} Row={Row} />;
};
