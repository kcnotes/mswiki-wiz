import { useState } from 'react';
import { keys, Table as BaseTable, UnstyledButton, Group, Text, Center, TextInput, Stack } from '@mantine/core';
import { IconSelector, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import classes from './table.module.css';
import { debounce } from '../../base/debounce';

type RowData<T extends string> = Record<T, string> & Record<'id', string>;

export type HeaderProps<T extends string> = {
  sortBy: 'id' | T | null,
  reverseSortDirection: boolean,
  setSorting(by: T): void
};

export type RowProps<T extends string> = {
  row: RowData<T>,
};

export type TableSortProps<T extends string> = {
  data: RowData<T>[],
  hideSearch?: boolean,
  Header: React.ComponentType<HeaderProps<T>>,
  Row: React.ComponentType<RowProps<T>>
};

interface TableHeaderProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

export function TableHeader({ children, reversed, sorted, onSort }: TableHeaderProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size="14px" stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

function filterData<T extends string>(data: RowData<T>[], search: string) {
  const query = search?.toLowerCase().trim();
  return data.filter((item) => {
    return keys(data[0]).some((key) => item[key] != null && item[key].toString().toLowerCase().includes(query));
  });
}

function sortData<T extends string>(
  data: RowData<T>[],
  payload: { sortBy: keyof RowData<T> | null; reversed: boolean; search: string },
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData<T>(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search,
  );
}

export function Table<T extends string>({ data, hideSearch, Header, Row }: TableSortProps<T>) {
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData<T> | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field: keyof RowData<T>) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    debounce(() => { setSortedData(sortData(data, { sortBy: field, reversed, search })) }, 500)();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    debounce(() => { setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value })) }, 500)();
  };

  const rows = sortedData.map((row) => (
    <Row row={row} key={row.id} />
  ));

  return (
    <Stack gap="sm">
      {!hideSearch && <TextInput
        placeholder="Search by any field"
        value={search}
        onChange={handleSearchChange}
      />}
      <BaseTable horizontalSpacing="md" verticalSpacing="xs" miw={700}>
        <BaseTable.Thead>
          <Header setSorting={setSorting} sortBy={sortBy} reverseSortDirection={reverseSortDirection} />
        </BaseTable.Thead>
        <BaseTable.Tbody>
          {rows.length > 0 && (
            rows
          )}
        </BaseTable.Tbody>
      </BaseTable>
    </Stack>
  );
}
