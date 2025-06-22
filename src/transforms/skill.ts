import { Skill, StringSkill, StringSkillMap } from "../services/skill_service";
import { getManualLevels, cleanSkillProps, mapSkillType, mapElementAttribute, parseSkillFormula, parseSkillReadout } from "./skill_props";

export type WikiSkill = {
  id: string;
  name: string;
  type: string;
  elementAttribute?: string;
  levelRequirement?: number;
  maxLevel: number;
  combatOrders?: boolean;
  vSkill?: boolean;
  bgm?: string;
  description: string;
  readout: string;
  formula: string;
}

export const mapSkill = (id: string, skill: Skill, strings: StringSkill | null): WikiSkill => {
  const { maxLevel, levels } = getManualLevels(skill);
  console.log(levels);
  const skillProps = maxLevel === 1 && levels.length === 1
    ? cleanSkillProps(levels[0])
    : cleanSkillProps(skill.common || {});

  return {
    id,
    name: strings?.name ?? '',
    type: mapSkillType(id),
    elementAttribute: mapElementAttribute(skill.info?.elemAttr),
    levelRequirement: skill.info?.reqLev,
    maxLevel,
    combatOrders: skill.info?.combatOrders,
    vSkill: skill.info?.vSkill,
    bgm: skill.info?.bgm?.replace(/^.*\//g, ''),
    description: parseSkillFormula(strings?.desc ?? '', {}, 'wikitext'),
    readout: parseSkillReadout(strings?.h ?? '', skillProps, 'wikitext'),
    formula: parseSkillFormula(strings?.h ?? '', skillProps, 'wikitext'),
  };
}

export const mapSkills = (
  ids: string[],
  skills: Record<string, Skill>,
  strings: StringSkillMap,
) => {
  const skillOutputs = ids.reduce<Record<string, WikiSkill>>((acc, id) => {
    const skill = skills[id];
    if (skill) {
      const props = mapSkill(id, skill, strings[id]);
      return { ...acc, [id]: props };
    }
    return acc;
  }, {});

  return {
    _metadata: {
      version: '1.0',
      date: new Date().toISOString().split('T')[0],
    }, 
    skills: skillOutputs,
  }
};
