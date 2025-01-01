import { StringService } from "./string_service";
import { WzReaderService } from "./wz_reader_service";

export const ItemPaths = {
  ETC_IMG: (group: number) => `Item/Etc/0${group}.img`,
  ETC_IMG_ICON: (group: number, id: number) => `Item/Etc/0${group}.img/0${id}/info/iconRaw`,
}

export const ItemService = {
  async getItemNames({ ids }: { ids: number[] }): Promise<Record<number, string>> {
    const promises = ids.map((id) => (
      new Promise(async (resolve) => resolve({
        id,
        name: (await StringService.getItemName({ id }))?.name,
      }))
    ));
    const items = await Promise.all(promises) as { id: number, name: string }[];
    return items.reduce((acc: Record<number, string>, item) => {
      acc[item.id] = item.name;
      return acc;
    }, {});
  },
  async getItemImage({ id }: { id: number }): Promise<string | null> {
    switch (Math.floor(id / 1000000)) {
      case 4:
        await WzReaderService.parseNode({ path: ItemPaths.ETC_IMG(Math.floor(id / 10000)) });
        return WzReaderService.getPng({ path: ItemPaths.ETC_IMG_ICON(Math.floor(id / 10000), id) });
      default:
        return null;
    }
  },
  async getItemImages({ ids }: { ids: number[] }): Promise<Record<number, string | null>> {
    const promises = ids.map((id) => (
      new Promise(async (resolve) => resolve({
        id,
        image: await ItemService.getItemImage({ id }),
      })
    )));
    const items = await Promise.all(promises) as { id: number, image: string | null }[];
    return items.reduce((acc: Record<number, string | null>, item) => {
      acc[item.id] = item.image;
      return acc;
    }, {});
  },
};
