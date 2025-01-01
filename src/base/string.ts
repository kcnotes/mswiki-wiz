import { unique } from "./array";

export type StringParams = {
  maps: Record<number, string | null>,
  items: Record<number, string | null>,
  itemImages: Record<number, string | null>,
  npcs: Record<number, string | null>,
  mobs: Record<number, string | null>,
};

// From maplestory.wiki
export const getRawHtml = (str: string, params: StringParams) => {
  str = str.replace(/</ig, '&lt;');
  str = str.replace(/>/ig, '&gt;');
  str = str.replace(/(\r)?\n/ig, '<br />');
  str = str.replace(/\\[rn]/ig, '<br />');
  str = str.replace(/\/[nr]/ig, '<br />');

  // Not sure what the #a or #c method is supposed to be, but nop'ing it for now.
  str = str.replace(/#a([0-9]+)#?/ig, '');
  str = str.replace(/#c([0-9]+)#?/ig, '0');

  // Map
  str = str.replace(/#m([0-9]+):?#[kn]?/ig, (_, contents) => params.maps[Number(contents)] ?? 'unknown');
  // Item
  str = str.replace(/#i([0-9]+):?#[kn]?/ig, (_, contents) => `<img src="data:image/png;base64,${params.itemImages[Number(contents)]}" />`);
  str = str.replace(/#v([0-9]+):?#[kn]?/ig, (_, contents) => `<img src="data:image/png;base64,${params.itemImages[Number(contents)]}" /> ${params.items[Number(contents)]}`);
  str = str.replace(/#t([0-9]+):?#[kn]?/ig, (_, contents) => params.items[Number(contents)] ?? 'unknown');
  // NPC
  str = str.replace(/#p([0-9]+):?#[kn]?/ig, (_, contents) => params.npcs[Number(contents)] ?? 'unknown');
  // Mob
  str = str.replace(/#o([0-9]+):?#[kn]?/ig, (_, contents) => params.mobs[Number(contents)] ?? 'unknown');

  // Text
  // Account for #'s that do not end
  str = str.replace(/#f([^#\n]+)#[kn]?/ig, (_, contents) => `tbd (${contents})`);
  str = str.replace(/#b([^#\n]+)#[knb]?/ig, '<span class="blue-text">$1</span>');
  str = str.replace(/#c([^#\n]+)/ig, '<span class="tbd">$1</span>');
  str = str.replace(/#r([^#\n]+)#[kn]?/ig, '<span class="red-text">$1</span>');
  str = str.replace(/#r([^#\n]+)/ig, '<span class="red-text">$1</span>');
  str = str.replace(/#c([^#\n]+)#[kn]?/ig, '<span class="tbd">$1</span>');
  str = str.replace(/#e([^#\n]+)#[kn]?/ig, '<strong>$1</strong>');
  str = str.replace(/#e([^#\n]+)/ig, '<strong>$1</strong>');
  str = str.replace(/#b([^#\n]+)/ig, '<span class="blue-text">$1</span>');
  str = str.replace(/#([^#\n]+)#[kn]?/ig, '<span class="orange-text">$1</span>');
  str = str.replace(/#([^#\n]+)/ig, '<span class="orange-text">$1</span>');

  str = str.replace(/\n/i, '<br />');

  return str;
}

export const getRawWikitext = (str: string, params: StringParams) => {
  str = str.replace(/</ig, '&lt;');
  str = str.replace(/>/ig, '&gt;');
  str = str.replace(/(\r)?\n/ig, '<br />');
  str = str.replace(/\\[rn]/ig, '<br />');
  str = str.replace(/\/[nr]/ig, '<br />');

  // Not sure what the #a or #c method is supposed to be, but nop'ing it for now.
  str = str.replace(/#a([0-9]+)#?/ig, '');
  str = str.replace(/#c([0-9]+)#?/ig, '0');

  // Map
  str = str.replace(/#m([0-9]+):?#[kn]?/ig, (_, contents) => params.maps[Number(contents)] ?? 'unknown');
  // Item
  str = str.replace(/#i([0-9]+):?#[kn]?/ig, (_, contents) => `[[File:${params.itemImages[Number(contents)]}]]`);
  str = str.replace(/#v([0-9]+):?#[kn]?/ig, (_, contents) => `[[File:${params.itemImages[Number(contents)]}]] ${params.items[Number(contents)]}`);
  str = str.replace(/#t([0-9]+):?#[kn]?/ig, (_, contents) => params.items[Number(contents)] ?? 'unknown');
  // NPC
  str = str.replace(/#p([0-9]+):?#[kn]?/ig, (_, contents) => params.npcs[Number(contents)] ?? 'unknown');
  // Mob
  str = str.replace(/#o([0-9]+):?#[kn]?/ig, (_, contents) => params.mobs[Number(contents)] ?? 'unknown');

  // Text
  // Account for #'s that do not end
  str = str.replace(/#f([^#\n]+)#[kn]?/ig, (_, contents) => `tbd (${contents})`);
  str = str.replace(/#b([^#\n]+)#[knb]?/ig, '<span class="blue-text">$1</span>');
  str = str.replace(/#c([^#\n]+)/ig, '<span class="tbd">$1</span>');
  str = str.replace(/#r([^#\n]+)#[kn]?/ig, '<span class="red-text">$1</span>');
  str = str.replace(/#r([^#\n]+)/ig, '<span class="red-text">$1</span>');
  str = str.replace(/#c([^#\n]+)#[kn]?/ig, '<span class="tbd">$1</span>');
  str = str.replace(/#e([^#\n]+)#[kn]?/ig, '<strong>$1</strong>');
  str = str.replace(/#e([^#\n]+)/ig, '<strong>$1</strong>');
  str = str.replace(/#b([^#\n]+)/ig, '<span class="blue-text">$1</span>');
  str = str.replace(/#([^#\n]+)#[kn]?/ig, '<span class="orange-text">$1</span>');
  str = str.replace(/#([^#\n]+)/ig, '<span class="orange-text">$1</span>');

  str = str.replace(/\n/i, '<br />');

  return str;
}

export const getRequestedFields = (strs: string[]) => {
  const maps = strs.flatMap(str => [...str.matchAll(/#m([0-9]+):?#[kn]?/ig)]);
  const items = strs.flatMap(str => [...str.matchAll(/#[ivt]([0-9]+):?#[kn]?/ig)]);
  const npcs = strs.flatMap(str => [...str.matchAll(/#p([0-9]+):?#[kn]?/ig)]);
  const mobs = strs.flatMap(str => [...str.matchAll(/#o([0-9]+):?#[kn]?/ig)]);
  return {
    maps: unique(maps.map(m => Number(m[1]))),
    items: unique(items.map(m => Number(m[1]))),
    npcs: unique(npcs.map(m => Number(m[1]))),
    mobs: unique(mobs.map(m => Number(m[1]))),
  }
};
