import { Skill, StringSkillMap } from "../../services/skill_service";

export const getBookname = (stringSkillMap: StringSkillMap, skillId: string): string => {
  const bookId = getBookId(skillId);
  return stringSkillMap[bookId]?.bookName ?? 'Unknown';
}

export const getBookId = (skillId: string): string => {
  if (skillId.startsWith('800')) {
    return skillId.slice(0, -2);
  }
  return skillId.slice(0, -4);
}

export const getSkillProps = (skill: Skill): Record<string, string> => {
  const common = Object.entries(skill.common || {})
    .map(([k, v]) => {
      if (typeof v === 'string') {
        return [k, v];
      }
      if (typeof v === 'number') {
        return [k, v.toString()];
      }
      return null;
    })
    .filter(v => v !== null)
    .map(([k, v]) => [k, transformPropExpression(v)]);
  
  return common.reduce<Record<string, string>>((acc, [k, v]) => {
    acc[k] = v;
    return acc;
  }, {});
}

export const transformPropExpression = (str: string) => {
  // Only numbers
  if (str.match(/^\d+$/g)) {
    return str;
  }
  // Has expression characters, e.g. +, -, *, /, (, ), etc.
  str = str.replace(/u\(/g, 'ceil(');
  str = str.replace(/d\(/g, 'floor(');
  return `{#expr:${str}}`;
}

export const getSkillType = (id: string): string => {
  const isHexaBoost = id.startsWith('50000');
  if (isHexaBoost) {
    return 'Passive';
  }
  return (Number(id).toString().slice(-4, -3) == '0') ? 'Passive' : 'Active';
}

export const getElementAttribute = (attribute?: string): string | undefined => {
  switch (attribute) {
      case 'i': return 'Ice';
      case 'f': return 'Fire';
      case 'd': return 'Dark';
      case 'l': return 'Lightning';
      case 's': return 'Poison';
      case 'h': return 'Holy';
      default: return undefined;
  }
}