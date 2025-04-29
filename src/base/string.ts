import { unique } from "./array";

export type StringParams = {
  maps: Record<number, string | null>,
  items: Record<number, string | null>,
  itemImages: Record<number, string | null>,
  npcs: Record<number, string | null>,
  mobs: Record<number, string | null>,
  quests: Record<number, string | null>,
};

type StringFormat = 'html' | 'wikitext';

const CONTAINER_CHARACTERS = [
  'c', // #c: <span class="darkorange-text">
  'r', // #r: <span class="red-text">
  'b', // #b: <span class="blue-text">
  'e', // #e: <strong>
];
const REPLACER_CHARACTERS = [
  'a', // #a: Mob state
  'o', // #o: Mob name
  'p', // #p: NPC name
  'm', // #m: Map name
  't', // #t: Item name
  'y', // #y: Quest name
  'u', // #u: Quest state
  'i', // #i: Item image
  'v', // #v: Item image + name
];
// const FUNCTION_CHARACTERS = [
//   's', // #fs: Font size
//   'n', // #fn: unknown
// ];
const FUNCTION_CHARACTER = 'f'; // #fX: Some function
const QUESTORDER_CHARACTER = 'q'; // #questorder1#
const CLOSE_CHARACTER = 'k'; // #k: </span>
const RESET_CHARACTER = 'n'; // #n: <normal font>

const getContainer = (control: string, format: StringFormat) => {
  if (format === 'wikitext' && control === 'e') {
    return "'''";
  }
  switch (control) {
    case 'c': return '<span class="darkorange-text">';
    case 'r': return '<span class="red-text">';
    case 'b': return '<span class="blue-text">';
    case 'e': return '<strong>';
    default: return '';
  }
};

const getReplacer = (control: string, id: number, params: StringParams, format: StringFormat) => {
  if (format === 'wikitext') {
    switch (control) {
      case 'i': return `[[File:${params.items[id]}.png]] `;
      case 'v': return `[[File:${params.items[id]}.png]] ${params.items[id] ?? `{item ${id}}`}`;
    }
  }
  switch (control) {
    case 'a': return `{mob-state ${id}}`;
    case 'o': return params.mobs[id] ?? `{mob ${id}}`;
    case 'p': return params.npcs[id] ?? `{npc ${id}}`;
    case 'm': return params.maps[id] ?? `{map ${id}}`;
    case 't': return params.items[id] ?? `{item ${id}}`;
    case 'y': return params.quests[id] ?? `{quest ${id}}`;
    case 'u': return 'Not started';
    case 'i': return `<img src="data:image/png;base64,${params.itemImages[id]}" /> `;
    case 'v': return `<img src="data:image/png;base64,${params.itemImages[id]}" /> ${params.items[id] ?? `{item ${id}}`}`;
    default: return `{character ${control}, id ${id}}`;
  }
};

const getClose = (control: string, format: StringFormat) => {
  if (format === 'wikitext' && control === 'e') {
    return "'''";
  }
  switch (control) {
    case 'c': return '</span>';
    case 'r': return '</span>';
    case 'b': return '</span>';
    case 'e': return '</strong>';
    case 'f': return '';
    default: return '';
  }
};

const PARAMETER_CHARACTERS = /[a-zA-Z0-9_]/g;
/**
 * At str[i] there is a #. Returns the parameter after the #.
 */
const getParameter = (str: string, i: number): string => {
  let param = '';
  i++;
  while (i < str.length && str[i].match(PARAMETER_CHARACTERS)) {
    param += str[i];
    i++;
  }
  return param;
}

/**
 * Iterates over a string and performs replacements
 */
export const parseString = (str: string, params: Record<string, string>, format: StringFormat) => {
  str = str.replace(/</ig, '&lt;');
  str = str.replace(/>/ig, '&gt;');

  // Stack containing starting characters (e.g. start <span>)
  let containerStack: string[] = [];
  let i = 0;
  let res = '';
  
  while (i < str.length) {
    const c = str[i];
    const next = str[i + 1]?.toLowerCase();

    // Handle control characters
    if (c === '#') {
      const parameter = getParameter(str, i);
      console.log('parameter', parameter);
      if (params[parameter]) {
        res += params[parameter];
        i += parameter.length;
      }
      else if (next === CLOSE_CHARACTER) {
        const control = containerStack.pop();
        if (control) {
          res += getClose(control, format);
        }
        i++; // Even if we don't find the close, we skip the close
      } else if (next === RESET_CHARACTER) {
        res += containerStack.reverse().map(c => getClose(c, format)).join('');
        containerStack = [];
        i++;
      } else if (CONTAINER_CHARACTERS.includes(next)) {
        const replacement = getContainer(next, format);
        if (replacement) {
          res += replacement;
          containerStack.push(next);
        }
        i++;
      } else {
        // Most likely a single closing control character, e.g. #
        const control = containerStack.pop();
        if (control) {
          res += getClose(control, format);
        }
      }
    } else {
      res += c;
    }
    i++;
  }

  res = res.replace(/(\r)?\n/ig, '<br />');
  res = res.replace(/(\\r)?\\n/ig, '<br />');
  res = res.replace(/(\/r)?\/n/ig, '<br />');
  res = res.replace(/\/t/ig, '	');
  
  // Remove any starting or trailing new lines
  res = res.replace(/^(<br \/>)+/ig, '');
  res = res.replace(/(<br \/>)+$/ig, '');
  res = res.trim();
  return res;
}

/**
 * TODO: use getString
 */
export const getFormattedString = (str: string, params: StringParams, format: StringFormat) => {
  str = str.replace(/</ig, '&lt;');
  str = str.replace(/>/ig, '&gt;');

  // Loop through strings and perform replacements
  let containerStack: string[] = [];
  let i = 0;
  let res = '';
  while (i < str.length) {
    const c = str[i];
    const next = str[i + 1]?.toLowerCase();

    // Handle control characters
    if (c === '#') {
      if (next === CLOSE_CHARACTER) {
        const control = containerStack.pop();
        if (control) {
          res += getClose(control, format);
        }
        i++; // Even if we don't find the close, we skip the close
      } else if (next === RESET_CHARACTER) {
        res += containerStack.reverse().map(c => getClose(c, format)).join('');
        containerStack = [];
        i++;
      } else if (REPLACER_CHARACTERS.includes(next)) {
        const control = next;
        i += 2;
        let id = '';
        while (str[i] !== '#') {
          id += str[i];
          i++;
        }
        res += getReplacer(control, Number(id), params, format);
      } else if (CONTAINER_CHARACTERS.includes(next)) {
        const replacement = getContainer(next, format);
        if (replacement) {
          res += replacement;
          containerStack.push(next);
        }
        i++;
      } else if (next === FUNCTION_CHARACTER || next === QUESTORDER_CHARACTER) {
        i += 2; // Functions have an extra character
        while (str[i] !== '#') {
          // Ignore functions for now
          i++;
        }
      } else {
        // Most likely a single closing control character, e.g. #
        const control = containerStack.pop();
        if (control) {
          res += getClose(control, format);
        }
      }
    } else {
      res += c;
    }
    i++;
  }

  res = res.replace(/(\r)?\n/ig, '<br />');
  res = res.replace(/(\\r)?\\n/ig, '<br />');
  res = res.replace(/(\/r)?\/n/ig, '<br />');
  res = res.replace(/\/t/ig, '	');
  
  // Remove any starting or trailing new lines
  res = res.replace(/^(<br \/>)+/ig, '');
  res = res.replace(/(<br \/>)+$/ig, '');
  res = res.trim();
  return res;
}

export const getRequestedFields = (strs: string[]) => {
  const maps = strs.flatMap(str => [...str.matchAll(/#m([0-9]+):?#[kn]?/ig)]);
  const items = strs.flatMap(str => [...str.matchAll(/#[ivt]([0-9]+):?#[kn]?/ig)]);
  const npcs = strs.flatMap(str => [...str.matchAll(/#p([0-9]+):?#[kn]?/ig)]);
  const mobs = strs.flatMap(str => [...str.matchAll(/#o([0-9]+):?#[kn]?/ig)]);
  const quests = strs.flatMap(str => [...str.matchAll(/#y([0-9]+)#[kn]?/ig)]);
  return {
    maps: unique(maps.map(m => Number(m[1]))),
    items: unique(items.map(m => Number(m[1]))),
    npcs: unique(npcs.map(m => Number(m[1]))),
    mobs: unique(mobs.map(m => Number(m[1]))),
    quests: unique(quests.map(m => Number(m[1]))),
  }
};
