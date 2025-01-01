import { StringService } from "./string_service";

export const MapService = {
  async getMapNames({ ids }: { ids: number[] }): Promise<Record<number, string>> {
    const promises = ids.map((id) => (
      new Promise(async (resolve) => resolve({
        id,
        name: (await StringService.getMapName({ id }))?.mapName,
      }))
    ));
    const maps = await Promise.all(promises) as { id: number, name: string }[];
    return maps.reduce((acc: Record<number, string>, map) => {
      acc[map.id] = map.name;
      return acc;
    }, {});
  }
}