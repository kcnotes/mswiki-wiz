import { WzReaderService } from "./wz_reader_service";

export type EquipStrings = {
  [key: string]: Record<string, MapleString>,
}

export type MapStrings = {
  [key: string]: Record<number, MapString>,
}

export type MapleString = {
  name: string,
  desc?: string,
};

export type MapString = {
  mapName: string,
  streetName: string,
};

export const StringPaths = {
  STRING_EQUIP: "String/Eqp.img",
  STRING_USE: "String/Consume.img",
  STRING_INS: "String/Ins.img",
  STRING_ETC: "String/Etc.img",
  STRING_CASH: "String/Cash.img",
  STRING_EQUIP_ALL: "String/Eqp.img/Eqp",
  STRING_EQUIP_ID: (category: string, id: number) => `String/Eqp.img/Eqp/${category}/${id}`,
  STRING_USE_ID: (id: number) => `String/Consume.img/${id}`,
  STRING_INS_ID: (id: number) => `String/Ins.img/${id}`,
  STRING_ETC_ID: (id: number) => `String/Etc.img/Etc/${id}`,
  STRING_CASH_ID: (id: number) => `String/Cash.img/${id}`,

  STRING_MAP: "String/Map.img",
};

export const StringService = {
  async getItemName({ id }: { id: number }): Promise<MapleString | undefined> {
    const categories = [
      StringPaths.STRING_EQUIP,
      StringPaths.STRING_USE,
      StringPaths.STRING_INS,
      StringPaths.STRING_ETC,
      StringPaths.STRING_CASH,
    ].map((path) => WzReaderService.parseNode({ path }));
    await Promise.all(categories);

    switch (Math.floor(id / 1000000)) {
      case 1: {
        const allEquips = await WzReaderService.getJson<EquipStrings>({ path: StringPaths.STRING_EQUIP_ALL });
        for (const equips of Object.values(allEquips)) {
          if (equips[id]) return equips[id];
        }
        return undefined;
      }
      case 2:
        return WzReaderService.getJson<MapleString>({ path: StringPaths.STRING_USE_ID(id) });
      case 3:
        return WzReaderService.getJson<MapleString>({ path: StringPaths.STRING_INS_ID(id) });
      case 4:
        return WzReaderService.getJson<MapleString>({ path: StringPaths.STRING_ETC_ID(id) });
      case 5:
        return WzReaderService.getJson<MapleString>({ path: StringPaths.STRING_CASH_ID(id) });
      default:
        return undefined;
    }
  },
  async getMapName({ id }: { id: number }): Promise<MapString | undefined> {
    await WzReaderService.parseNode({ path: StringPaths.STRING_MAP });
    const maps = await WzReaderService.getJson<MapStrings>({ path: StringPaths.STRING_MAP });
    for (const map of Object.values(maps)) {
      if (map[id]) return map[id];
    }
  }

};
