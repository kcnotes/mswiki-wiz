import { unique } from "../base/array";
import { getRequestedFields, StringParams } from "../base/string";
import { mapQuest } from "../components/quest/quest_util";
import { ItemService } from "./item_service";
import { MapService } from "./map_service";
import { MobService } from "./mob_service";
import { NpcService } from "./npc_service";
import { WzReaderService } from "./wz_reader_service";

export const QuestPaths = {
  QUEST_DATA: 'Quest/QuestData',
  QUEST_CATEGORIES: 'Quest/QuestCategory.img',
  QUEST_IMG: (img: string) => `Quest/QuestData/${img}`,
};

export type QuestCategories = {
  [x: number]: {
    [y: number]: {
      title: string,
      priority: number,
    }
    title: string,
    priority: number,
  },
  reqType: {
    [x: number]: string,
  },
};

export type QuestSummary = {
  id: string,
  name?: string,
  area?: number,
  blocked: boolean,
  requires?: number[],
};

export type QuestPrerequisites = {
  id: number,
  name?: string,
  requires?: number[],
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
    blocked?: number,
    autoStart?: number,
    demandSummary?: string,
    name?: string,
  },
  Say: {
    0: unknown,
    1: unknown,
  }
}

export type HydratedQuest = {
  quest: Quest,
  questDetail: ReturnType<typeof mapQuest>,
  stringParams: StringParams,
}

export const QuestService = {
  async getQuestSummaries(): Promise<QuestSummary[]> {
    await WzReaderService.parseChildren({ path: QuestPaths.QUEST_DATA });
    const allQuests = await WzReaderService.getJson<Record<string, Quest>>({ path: QuestPaths.QUEST_DATA });
    return Object.entries(allQuests).map(([questId, quest]) => ({
      id: questId,
      name: quest.QuestInfo.name,
      area: quest.QuestInfo.area,
      blocked: quest.QuestInfo.blocked === 1,
      requires: quest.Check['0']?.quest != null ? Object.values(quest.Check['0'].quest).map(q => q.id) : [],
    }));
  },

  async getQuestNames(ids: number[]): Promise<Record<string, string>> {
    const promises = ids.map((id) => (
      new Promise(async (resolve) => resolve({
        id,
        name: (await WzReaderService.getJson<Quest>({ path: QuestPaths.QUEST_IMG(`${id}.img`) }))?.QuestInfo.name,
      }))
    ));
    const quests = await Promise.all(promises) as { id: number, name: string }[];
    return quests.reduce((acc: Record<string, string>, quest) => {
      acc[quest.id] = quest.name;
      return acc;
    }, {});
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
  
  async getQuestCategories(): Promise<QuestCategories> {
    await WzReaderService.parseNode({ path: QuestPaths.QUEST_CATEGORIES });
    const categories = await WzReaderService.getJson({ path: QuestPaths.QUEST_CATEGORIES }) as QuestCategories;
    return categories;
  },

  async getQuest({ img }: { img: string }): Promise<Quest> {
    await WzReaderService.parseNode({ path: QuestPaths.QUEST_IMG(img) });
    return await WzReaderService.getJson({ path: QuestPaths.QUEST_IMG(img) }) as Quest;
  },

  async getHydratedQuest({ img }: { img: string }): Promise<HydratedQuest> {
    const quest = await this.getQuest({ img });
    const questDetail = mapQuest(img, quest);
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
    fields.npcs = unique([
      ...fields.npcs,
      ...questDetail.startingNpc != null ? [questDetail.startingNpc] : [],
    ]);
    const stringParams = {
      maps: await MapService.getMapNames({ ids: fields.maps }),
      items: await ItemService.getItemNames({ ids: fields.items }),
      itemImages: await ItemService.getItemImages({ ids: fields.items }),
      npcs: await NpcService.getNpcs({ ids: fields.npcs }),
      mobs: await MobService.getMobNames({ ids: fields.mobs }),
      quests: await this.getQuestNames(fields.quests),
    };
    return { quest, questDetail, stringParams };
  },

  async getHydratedQuests({ ids }: { ids: string[] }): Promise<HydratedQuest[]> {
    const quests = await Promise.all(ids.map((id) => this.getHydratedQuest({ img: id })));
    return quests;
  }
}
