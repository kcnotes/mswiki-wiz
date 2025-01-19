import { StringService } from "./string_service";

export const MobService = {
  async getMobNames({ ids }: { ids: number[] }): Promise<Record<number, string>> {
    const promises = ids.map((id) => (
      new Promise(async (resolve) => resolve({
        id,
        name: (await StringService.getMobName({ id })),
      }))
    ));
    const mobs = await Promise.all(promises) as { id: number, name: string }[];
    return mobs.reduce((acc: Record<number, string>, mob) => {
      acc[mob.id] = mob.name;
      return acc;
    }, {});
  }
}