import { WzReaderService } from "./wz_reader_service";

export const NpcPaths = {
  NPC: 'Npc',
  STRING_NPC: 'String/Npc.img',
  NPC_IMG: (img: string) => `Npc/${img}`,
  NPC_IMG_STAND: (img: string) => `Npc/${img}/stand/0`,
};

export type Npc = {
  d0?: string,
  d1?: string,
  func?: string,
  name?: string,
}

export type NpcNamesResponse = Record<number, string>;

export const NpcService = {
  async getNpcPng({ id }: { id: number }): Promise<string> {
    await WzReaderService.parseNode({ path: NpcPaths.NPC_IMG(`${id}.img`) });
    return WzReaderService.getPng({ path: NpcPaths.NPC_IMG_STAND(`${id}.img`) });
  },
  
  async getNpcName({ id }: { id: number }): Promise<Npc> {
    await WzReaderService.parseNode({ path: NpcPaths.STRING_NPC });
    return WzReaderService.getJson({ path: `${NpcPaths.STRING_NPC}/${id}` }) as Npc;
  },

  async getNpcs({ ids }: { ids: number[] }): Promise<NpcNamesResponse> {
    const promises = ids.map((id) => (
      new Promise(async (resolve) => resolve({
        id,
        name: (await this.getNpcName({ id })).name,
      }))
    ));
    const npcs = await Promise.all(promises) as { id: number, name: string }[];
    return npcs.reduce((acc: NpcNamesResponse, npc) => {
      acc[npc.id] = npc.name;
      return acc;
    }, {});
  },
};
