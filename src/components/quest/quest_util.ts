import { groupBy } from "../../base/array";
import { Quest, QuestCategory } from "../../services/quest_service";

export type QuestWithCategory = Quest & { category: string };

export const guessCategoryNames = (quests: Quest[], questCategories: QuestCategory[]): QuestWithCategory[] => {
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
} 