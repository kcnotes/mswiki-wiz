import { Table, Text } from "@mantine/core";
import { parseString } from "../../base/string";
import { Skill, StringSkill } from "../../services/skill_service";
import { getElementAttribute, getSkillProps, getSkillType } from "./skill_util";

export const SkillProps = ({ id, skill, strings }: {
  id: string,
  skill: Skill,
  strings: StringSkill | null,
}) => {
  const props = {
    id,
    name: strings?.name ?? '',
    type: getSkillType(id),
    elementAttribute: getElementAttribute(skill.info?.elemAttr),
    levelRequirement: skill.info?.reqLev,
    maxLevel: skill.common?.maxLevel,
    combatOrders: skill.info?.combatOrders,
    vSkill: skill.info?.vSkill,
    bgm: skill.info?.bgm?.replace(/^.*\//g, ''),
    description: parseString(strings?.desc ?? '', {}, 'wikitext'),
    readout: strings?.h ?? '',
    formula: parseString(strings?.h ?? '', getSkillProps(skill), 'wikitext'),
  };

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
      </Table.Tbody>
    </Table>
  );
}