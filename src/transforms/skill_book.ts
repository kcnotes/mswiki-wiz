import { StringSkillMap } from "../services/skill_service";

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
