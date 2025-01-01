import { groupBy } from "../../base/array";
import { QuestSummary, QuestCategory, Quest, QuestItem } from "../../services/quest_service";

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
  name?: string,
  type?: string,
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

export const mapQuest = (quest: Quest): QuestDetail => {
  return {
    name: quest.QuestInfo.name,
    type: quest.QuestInfo.type,
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
