import { groupBy } from "../../base/array";
import { getFormattedString } from "../../base/string";
import { QuestSummary, QuestCategory, Quest, QuestItem, HydratedQuest } from "../../services/quest_service";

export type QuestWithCategory = QuestSummary & { category: string };

export const guessCategoryNames = (quests: QuestSummary[], questCategories: QuestCategory[]): QuestWithCategory[] => {
  // Sort by [] category first, then by area category
  const questsByCategory = groupBy(quests, (q) => {
    const name = q.name;
    const category = name?.startsWith('[') && name?.includes(']')
      ? name.slice(1, name.indexOf(']'))
      : q.area != null
        ? questCategories.find(c => c.category === q.area)?.title ?? 'Uncategorized'
        : 'Uncategorized';
    return category;
  });
  
  return Object.entries(questsByCategory).flatMap(([category, quests]) => (
    quests.map(q => ({ ...q, category }))
  ));
};

export type QuestDetail = {
  id: number,
  name?: string,
  type?: string,
  blocked?: boolean,
  text: {
    available?: string,
    inProgress?: string,
    completed?: string,
  },
  prerequisites: {
    level?: number,
    quests: number[],
  },
  inProgress: {
    items: QuestItem[],
  }
  complete: {
    items: QuestItem[],
  },
  startingNpc?: number,
};

export const mapQuest = (img: string, quest: Quest): QuestDetail => {
  return {
    id: Number(img.slice(0, -4)),
    name: quest.QuestInfo.name,
    type: quest.QuestInfo.type,
    blocked: quest.QuestInfo.blocked === 1,
    text: {
      available: quest.QuestInfo['0'],
      inProgress: quest.QuestInfo['1'],
      completed: quest.QuestInfo['2'],
    },
    prerequisites: {
      level: quest.Check['0']?.lvmin,
      quests: Object.values(quest.Check['0']?.quest ?? {}).map(q => q.id),
    },
    inProgress: {
      items: quest.Check['1']?.item ? Object.values(quest.Check['1']?.item).map(i => ({
        id: i.id,
        count: i.count,
        order: i.order,
      })) : [],
    },
    complete: {
      items: quest.Act['1']?.item ? Object.values(quest.Act['1']?.item).map(i => ({
        id: i.id,
        count: i.count,
        order: i.order,
      })) : [],
    },
    startingNpc: quest.Check['0']?.npc,
  }
}

export const mapLuaQuestDetailTemplate = (quests: HydratedQuest[]): string => {
  return `
return {
  ${quests.map(q => `  ['${q.questDetail.id}'] = {
    avail = '${getFormattedString(q.questDetail.text.available ?? '', q.stringParams, 'wikitext').replace(/'/g, "\\'")}',
    prog  = '${getFormattedString(q.questDetail.text.inProgress ?? '', q.stringParams, 'wikitext').replace(/'/g, "\\'")}',
    comp  = '${getFormattedString(q.questDetail.text.completed ?? '', q.stringParams, 'wikitext').replace(/'/g, "\\'")}',
  }`).join(',\n')}
}`;
};