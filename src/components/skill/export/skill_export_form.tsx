import { Button, Stack, Textarea } from "@mantine/core";
import React from "react";
import { Skill, SkillService } from "../../../services/skill_service";
import { SkillContext } from "../skill_context";
import { SkillProps } from "../skill_props";
import { mapSkills } from "../../../transforms/skill";

export const SkillExportForm = () => {
  // Allow people to add to a list of skills (with a preview)
  // Then export
  const moXuanBeginnerSkillIds = [
    '170000241',
    '170001000',
    '170000001',
    '170001005',
  ];

  const [input, setInput] = React.useState(moXuanBeginnerSkillIds.join('\n'));
  const [skills,  setSkills] = React.useState<Record<string, Skill>>({});
  const [loading, setLoading] = React.useState(false);
  const { strings } = React.useContext(SkillContext);
  
  const exportSkills = async (input: string) => {
    setLoading(true);
    const skillIds = parseInput(input);
    setSkills(await SkillService.getSkills(skillIds));
    setLoading(false);
  }

  const parseInput = (input: string) => {
    return input
      .trim()
      .split('\n')
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  const output = mapSkills(
    parseInput(input),
    skills,
    strings,
  );
  
  return (
    <Stack gap="xs">
      <Textarea value={input} onChange={(event) => setInput(event.currentTarget.value)} rows={4} />
      <Button onClick={() => exportSkills(input)} loading={loading}>
        Export
      </Button>
      {parseInput(input).length > 0 && (
        <Textarea
          value={JSON.stringify(output)}
          rows={8}
        />
      )}
      {parseInput(input).map((id) => skills[id] ? (
        <SkillProps key={id} id={id} skill={skills[id]} strings={strings[id]} />
      ) : null)}
    </Stack>
  );
};