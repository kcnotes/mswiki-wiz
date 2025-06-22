import { stringTokeniser } from "../string_tokeniser";

describe('stringTokeniser', () => {
  it('Tokenises a string with parameters', () => {
    const str = 'MP Cost: #mpCon, Cooldown: #cooltime sec';
    const params = ['mpCon', 'cooltime'];

    const expectedTokens = [
      { type: 'content', content: 'MP Cost: ' },
      { type: 'parameter', parameter: 'mpCon' },
      { type: 'content', content: ', Cooldown: ' },
      { type: 'parameter', parameter: 'cooltime' },
      { type: 'content', content: ' sec' },
    ];
    const tokens = stringTokeniser(str, params);
    expect(tokens).toEqual(expectedTokens);
  });
  it('Tokenises a string with containers', () => {
    const str = '#cCooldown: 1 sec#k';

    const expectedTokens = [
      { type: 'start-container', containerType: 'c' },
      { type: 'content', content: 'Cooldown: 1 sec' },
      { type: 'end-container', containerType: 'c' },
    ];
    const tokens = stringTokeniser(str, []);
    expect(tokens).toEqual(expectedTokens);
  });
  it('Tokenises a string with reset characters', () => {
    const str = '#c#b<bold orange>#n<normal>';

    const expectedTokens = [
      { type: 'start-container', containerType: 'c' },
      { type: 'start-container', containerType: 'b' },
      { type: 'content', content: '<bold orange>' },
      { type: 'end-container', containerType: 'b' },
      { type: 'end-container', containerType: 'c' },
      { type: 'content', content: '<normal>' },
    ];
    const tokens = stringTokeniser(str, []);
    expect(tokens).toEqual(expectedTokens);
  });
  it('Tokenises a string with end character #', () => {
    const str = '#c<bold>#<normal>';

    const expectedTokens = [
      { type: 'start-container', containerType: 'c' },
      { type: 'content', content: '<bold>' },
      { type: 'end-container', containerType: 'c' },
      { type: 'content', content: '<normal>' },
    ];
    const tokens = stringTokeniser(str, []);
    expect(tokens).toEqual(expectedTokens);
  });
});