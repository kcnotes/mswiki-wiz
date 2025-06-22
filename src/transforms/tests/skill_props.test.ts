import { cleanSkillProps, getManualLevels, parseExpressions } from "../skill_props";

describe('parseExpressions', () => {
  it('correctly transforms ceil', () => {
    const result = parseExpressions('u(1.5)', false);
    expect(result).toBe('{#expr:ceil(1.5)}');
  });
  it('correctly transforms floor', () => {
    const result = parseExpressions('d(1.5)', false);
    expect(result).toBe('{#expr:floor(1.5)}');
  });
  it('correctly transforms log', () => {
    const result = parseExpressions('log2(8)', false);
    expect(result).toBe('{#expr:floor(ln(8)/ln(2))}');
  });
  it('correctly transforms negated expression', () => {
    const result = parseExpressions('u(1.5)', true);
    expect(result).toBe('{#expr:-(ceil(1.5))}');
  });
  it('correctly transforms expression with operators', () => {
    const result = parseExpressions('u(1.5) + d(2.5)', false);
    expect(result).toBe('{#expr:ceil(1.5) + floor(2.5)}');
  });
});

describe('cleanSkillProps', () => {
  it('correctly cleans skill properties', () => {
    const input = {
      prop1: 'value1',
      prop2: 2,
      prop3: {
        lt: 1,
        rb: 2,
      },
      prop4: undefined,
    };
    const result = cleanSkillProps(input);
    expect(result).toEqual({
      prop1: 'value1',
      prop2: '2',
    });
  });
});

describe('getManualLevels', () => {
  it('returns maxLevel and levels', () => {
    const skill = {
      level: {
        1: { prop: '1' },
        2: { prop: '2' },
      },
    };
    const result = getManualLevels(skill);
    expect(result).toEqual({
      maxLevel: 2,
      levels: [
        { prop: '1' },
        { prop: '2' },
      ],
    });
  });
});
