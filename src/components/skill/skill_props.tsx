import { Button, Table, Text } from "@mantine/core";
import { Skill, StringSkill } from "../../services/skill_service";
import { openUrl } from "@tauri-apps/plugin-opener";
import { mapSkill } from "../../transforms/skill";

export const SkillProps = ({ id, skill, strings }: {
  id: string,
  skill: Skill,
  strings: StringSkill | null,
}) => {
  const props = mapSkill(id, skill, strings);

  const openSkill = async (name: string) => {
    await openUrl(`https://maplestorywiki.net/w/${name.replace(/ /g, '_')}`);
  }

  return (
    <Table>
      <Table.Tbody>
        {Object.entries(props).filter(([_, v]) => v != null).map(([key, value]) => (
          <Table.Tr key={key}>
            <Table.Td>
              <Text size="sm">{key}</Text>
            </Table.Td>
            <Table.Td>
              <Text size="sm">{value}</Text>
            </Table.Td>
          </Table.Tr>
        ))}
        <Table.Tr>
          <Table.Td>
            <Text size="sm">Wiki link</Text>
          </Table.Td>
          <Table.Td>
            <Button variant="subtle" onClick={() => openSkill(props.name)}>
              {props.name}
            </Button>
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
}