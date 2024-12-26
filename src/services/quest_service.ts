import { WzReaderService } from "./wz_reader_service";

export const QuestPaths = {
  QUEST_DATA: 'Quest/QuestData',
  QUEST_CATEGORIES: 'Quest/QuestCategory.img',
};

export type QuestJson = Record<string, {
  Act: unknown,
  Check: unknown,
  QuestInfo: {
    name: string,
    area: number,
    parent?: string,
  }
}>;

export type Quest = {
  id: string,
  name?: string,
  area?: number,
  parent?: string,
};

export type QuestCategory = {
  category?: number,
  title?: string,
}

export const QuestService = {
  async getQuestNames(): Promise<Quest[]> {
    await WzReaderService.parseChildren({ path: QuestPaths.QUEST_DATA });
    const allQuests = await WzReaderService.getJson({ path: QuestPaths.QUEST_DATA }) as QuestJson;
    return Object.entries(allQuests).map(([questId, quest]) => ({
      id: questId,
      name: quest.QuestInfo.name,
      area: quest.QuestInfo.area,
      parent: quest.QuestInfo.parent,
    }));
  },
  
  async getQuestCategories(): Promise<QuestCategory[]> {
    await WzReaderService.parseNode({ path: QuestPaths.QUEST_CATEGORIES });
    const categories = await WzReaderService.getJson({ path: QuestPaths.QUEST_CATEGORIES }) as Record<number, QuestCategory>;
    return Object.values(categories).filter(
      (category) => category.category != null && category.title != null
    ).map((category) => ({
      category: category.category,
      title: category.title,
    }));
  }
}
