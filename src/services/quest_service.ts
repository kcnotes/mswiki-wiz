import { unique } from "../base/array";
import { getRequestedFields } from "../base/string";
import { mapQuest } from "../components/quest/quest_util";
import { ItemService } from "./item_service";
import { MapService } from "./map_service";
import { NpcService } from "./npc_service";
import { WzReaderService } from "./wz_reader_service";

export const QuestPaths = {
  QUEST_DATA: 'Quest/QuestData',
  QUEST_CATEGORIES: 'Quest/QuestCategory.img',
  QUEST_IMG: (img: string) => `Quest/QuestData/${img}`,
};

export type QuestSummary = {
  id: string,
  name?: string,
  area?: number,
};

export type QuestPrerequisites = {
  id: number,
  name?: string,
  requires?: number[],
};

export type QuestCategory = {
  category?: number,
  title?: string,
};

export type QuestItem = {
  id: number,
  count: number,
  order?: number,
};

export type Quest = {
  Act: {
    0: unknown,
    1: {
      exp: number,
      item?: Record<string, QuestItem>,
    },
  },
  Check: {
    0?: {
      lvmin?: number,
      npc?: number,
      quest?: Record<string, {
        id: number,
        order: number,
        state: number,
      }>,
    },
    1: {
      item?: Record<string, QuestItem>,
    },
  },
  QuestInfo: {
    0?: string,
    1?: string,
    2?: string,
    type?: string,
    area?: number,
    autoStart?: number,
    demandSummary?: string,
    name?: string,
  },
  Say: {
    0: unknown,
    1: unknown,
  }
}

export const QuestService = {
  async getQuestNames(): Promise<QuestSummary[]> {
    await WzReaderService.parseChildren({ path: QuestPaths.QUEST_DATA });
    const allQuests = await WzReaderService.getJson<Record<string, Quest>>({ path: QuestPaths.QUEST_DATA });
    return Object.entries(allQuests).map(([questId, quest]) => ({
      id: questId,
      name: quest.QuestInfo.name,
      area: quest.QuestInfo.area,
    }));
  },

  async getQuestPrerequisites(): Promise<QuestPrerequisites[]> {
    await WzReaderService.parseChildren({ path: QuestPaths.QUEST_DATA });
    const allQuests = await WzReaderService.getJson<Record<string, Quest>>({ path: QuestPaths.QUEST_DATA });
    return Object.entries(allQuests).map(([questId, quest]) => ({
      id: Number(questId.slice(0, -4)),
      name: quest.QuestInfo.name,
      requires: quest.Check['0']?.quest != null ? Object.values(quest.Check['0'].quest).map(q => q.id) : [],
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
  },

  async getQuest({ img }: { img: string }): Promise<Quest> {
    await WzReaderService.parseNode({ path: QuestPaths.QUEST_IMG(img) });
    return await WzReaderService.getJson({ path: QuestPaths.QUEST_IMG(img) }) as Quest;
  },

  async getHydratedQuest({ img }: { img: string }) {
    const quest = await this.getQuest({ img });
    const questDetail = mapQuest(quest);
    const fields = getRequestedFields([
      questDetail?.text.available || '',
      questDetail?.text.inProgress || '',
      questDetail?.text.completed || '',
    ]);
    fields.items = unique([
      ...fields.items,
      ...questDetail.inProgress.items.map(i => i.id),
      ...questDetail.complete.items.map(i => i.id),
    ]);
    const stringParams = {
      maps: await MapService.getMapNames({ ids: fields.maps }),
      items: await ItemService.getItemNames({ ids: fields.items }),
      itemImages: await ItemService.getItemImages({ ids: fields.items }),
      npcs: await NpcService.getNpcs({ ids: fields.npcs }),
      mobs: {},
    };
    return { quest, questDetail, stringParams };
  }
}
