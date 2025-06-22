import { getClose, getContainer, replaceLtGt, replaceNewLines, StringFormat } from "../base/string";
import { stringTokeniser } from "../base/string_tokeniser";
import { Skill } from "../services/skill_service";

export const mapElementAttribute = (attribute?: string): string | undefined => {
  switch (attribute) {
      case 'i': return 'Ice';
      case 'f': return 'Fire';
      case 'd': return 'Dark';
      case 'l': return 'Lightning';
      case 's': return 'Poison';
      case 'h': return 'Holy';
      default: return undefined;
  }
}

export const mapSkillType = (id: string): string => {
  const isHexaBoost = id.startsWith('50000');
  if (isHexaBoost) {
    return 'Passive';
  }
  return (Number(id).toString().slice(-4, -3) == '0') ? 'Passive' : 'Active';
}

/**
 * Cleans skill properties, removing non-string/number values
 * e.g. lt, rb
 */
export const cleanSkillProps = (props: Record<string, any>): Record<string, string> => {
  return Object.entries(props)
    .map(([k, v]) => {
      if (typeof v === 'string') {
        return [k, v];
      }
      if (typeof v === 'number') {
        return [k, v.toString()];
      }
      return null;
    })
    .filter(v => v != null)
    .reduce<Record<string, string>>((acc, [k, v]) => {
      acc[k] = v;
      return acc;
    }, {});
}

export const parseExpressions = (str: string, negated: boolean): string => {
  // Only numbers
  if (str.match(/^\d+$/g)) {
    return str;
  }
  // Has expression characters, e.g. +, -, *, /, (, ), etc.
  str = str.replace(/u\(/g, 'ceil(');
  str = str.replace(/d\(/g, 'floor(');

  // For logx(y), replace with ln(y)/ln(x) which #expr supports
  if (str.match(/log\d+\(.+?\)/g)) {
    str = str.replace(/log(\d+)\((.+?)\)/g, 'floor(ln($2)/ln($1))');
  }

  if (negated) {
    return `{#expr:-(${str})}`;
  }
  return `{#expr:${str}}`;
}
type ManualLevels = {
  maxLevel: number,
  levels: Record<string, any>[],
}

export const getManualLevels = (skill: Pick<Skill, 'common' | 'level'>): ManualLevels => {
  if (skill.common?.maxLevel != null) {
    return { maxLevel: skill.common?.maxLevel, levels: [] };
  }
  if (skill.level == null) {
    return { maxLevel: 0, levels: [] };
  }
  const levels = Object.entries(skill.level)
    .sort(([a], [b]) => {
      return a.localeCompare(b);
    })
    .map(([_, v]) => {
      return v;
    })
    
  return { maxLevel: levels.length, levels };
}

/**
 * Iterates over a string and performs replacements
 */
export const parseSkillFormula = (str: string, params: Record<string, string>, format: StringFormat) => {
  str = replaceLtGt(str);
  const tokens = stringTokeniser(str, Object.keys(params));
  let res = '';

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const prev = tokens[i - 1];

    switch (token.type) {
      case 'parameter':
        // MediaWiki does not support -{#expr:...}
        let negated = false;
        if (prev?.type === 'content' && prev.content[prev.content.length - 1] === '-') {
          res = res.slice(0, -1); // Remove the last character
          negated = true;
        }
        const value = params[token.parameter];
        if (value != null) {
          res += parseExpressions(value, negated);
        } else {
          res += `#${token.parameter}`;
        }
        break;
      case 'content':
        res += token.content;
        break;
      case 'start-container':
        res += getContainer(token.containerType, format);
        break;
      case 'end-container':
        res += getClose(token.containerType, format);
        break;
    }
  }

  res = replaceNewLines(res);
  return res;
}

/**
 * Iterates over a string and performs replacements
 */
export const parseSkillReadout = (str: string, params: Record<string, string>, format: StringFormat) => {
  str = replaceLtGt(str);
  const tokens = stringTokeniser(str, Object.keys(params));
  let res = '';

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    switch (token.type) {
      case 'parameter':
        res += `#${token.parameter}`;
        break;
      case 'content':
        res += token.content;
        break;
      case 'start-container':
        res += getContainer(token.containerType, format);
        break;
      case 'end-container':
        res += getClose(token.containerType, format);
        break;
    }
  }

  res = replaceNewLines(res);
  return res;
}