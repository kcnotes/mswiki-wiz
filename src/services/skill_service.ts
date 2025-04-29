import { getBookId } from "../components/skill/skill_util";
import { WzReaderService } from "./wz_reader_service";

export const SkillPaths = {
  SKILL: 'Skill',
  SKILL_STRING: 'String/Skill.img',
  SKILL_CATEGORY: (categoryId: string) => `Skill/${categoryId}.img`,
  SKILL_INDIVIDUAL: (categoryId: string, id: string) => `Skill/${categoryId}.img/skill/${id}`,
  SKILL_ICON: (categoryId: string, id: string) => `Skill/_Canvas/${categoryId}.img/skill/${id}/icon`,
};

export type SkillCategorySummary = {
  id: string,
  name: string,
};

export type StringSkill = {
  name?: string,
  desc?: string,
  h?: string,
  bookName?: string,
};

export type Skill = {
  common?: Record<string, any>,
  info?: Record<string, any>,
  disable?: number,
  invisible?: number,
  icon: {
    _outlink?: string,
  }
};

export type StringSkillMap = Record<string, StringSkill | null>;

export type SkillCategory = {
  skill: {
    [key: string]: Skill,
  },
  strings: StringSkillMap,
};

export const SkillService = {
  async getSkillBootstrap(): Promise<{ categories: SkillCategorySummary[], strings: StringSkillMap }> {
    const res = await WzReaderService.getChildren({ path: SkillPaths.SKILL });
    await WzReaderService.parseNode({ path: SkillPaths.SKILL_STRING });
    const strings = await WzReaderService.getJson<StringSkillMap>({ path: SkillPaths.SKILL_STRING });

    var categories = Object.values(res)
      .map(v => v.name.split('/')?.[1] ?? v.name)
      .filter(k => k?.endsWith('.img'))
      .map(k => k.slice(0, -4))
      .filter(k => !isNaN(Number(k)))
      .sort((a, b) => Number(a) - Number(b))
      .map(k => ({
        id: k,
        name: strings[Number(k)]?.bookName ?? 'Unknown',
      }));
    return {
      categories,
      strings
    };
  },

  async getSkill(id: string): Promise<Skill> {
    const categoryId = getBookId(id);
    await WzReaderService.parseNode({ path: SkillPaths.SKILL_CATEGORY(categoryId) });
    return await WzReaderService.getJson({ path: SkillPaths.SKILL_INDIVIDUAL(categoryId, id) });
  },

  async getSkillCategory(categoryId: string): Promise<SkillCategory> {
    const path = `${SkillPaths.SKILL}/${categoryId}.img`;
    await WzReaderService.parseNode({ path });
    return await WzReaderService.getJson({ path });
  },
  
  async getSkillPngs(categoryId: string, category: SkillCategory): Promise<{ id: string, icon: string }[]> {
    const promises = Object.entries(category.skill).map(([id, skill]) => {
      return WzReaderService.getPng({ path: skill.icon['_outlink'] ?? SkillPaths.SKILL_ICON(categoryId, id) });
    });
    return Promise.allSettled(promises).then((icons) => {
      return icons.map((icon, i) => {
        if (icon.status === 'rejected') {
          console.error(`Failed to load icon for skill ${i}:`, icon.reason);
          return { id: '', icon: '' };
        }
        return { id: Object.keys(category.skill)[i], icon: icon.value };
      });
    });
  },

};
