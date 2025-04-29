import { Table } from '@mantine/core'
import { createFileRoute, Link } from '@tanstack/react-router'
import { SkillContext } from '../../../../components/skill/skill_context';
import React from 'react';
import { Routes } from '../../../../paths';

export const Route = createFileRoute('/_app/skills/categories/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { categories } = React.useContext(SkillContext);
  
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>ID</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {categories.map(c => (
          <Table.Tr>
            <Table.Td>
              <Link to={Routes.skillCategory(c.id)}>{c.id}</Link>
            </Table.Td>
            <Table.Td>
              {c.name}
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}
