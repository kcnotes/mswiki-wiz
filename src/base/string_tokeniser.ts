type StartContainerToken = {
  // e.g. #cCooldown: 1 sec#
  type: 'start-container',
  containerType: 'c' | 'r' | 'b' | 'e',
};

type EndContainerToken = {
  // e.g. #k: </span>
  type: 'end-container',
  containerType: 'c' | 'r' | 'b' | 'e',
};

type ContentToken = {
  // generic text
  type: 'content',
  content: string,
};

type ParameterToken = {
  // e.g. #time
  type: 'parameter',
  parameter: string,
};

export type Token = StartContainerToken
  | EndContainerToken
  | ContentToken
  | ParameterToken;

const CLOSE_CHARACTER = 'k'; // #k: </span>
const RESET_CHARACTER = 'n'; // #n: <normal font>
const CONTAINER_CHARACTERS = ['c', 'r', 'b', 'e'];

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

export const stringTokeniser = (str: string, params: string[]): Token[] => {
  const tokens: Token[] = [];
  let i = 0;
  let containerStack: StartContainerToken['containerType'][] = [];

  while (i < str.length) {
    const c = str[i];
    const next = str[i + 1]?.toLowerCase();

    // Handle control characters
    if (c === '#') {
      const parameter = getParameter(str, i);
      if (params.includes(parameter)) {
        tokens.push({ type: 'parameter', parameter });
        i += parameter.length + 1;
      }
      else if (next === CLOSE_CHARACTER) {
        const c = containerStack.pop();
        if (c) {
          tokens.push({ type: 'end-container', containerType: c });
        }
        i += 2; // Skip the # and the character
      }
      else if (next === RESET_CHARACTER) {
        containerStack.reverse().forEach(c => {
          tokens.push({ type: 'end-container', containerType: c });
        });
        containerStack = [];
        i += 2; // Skip the # and the character
      } else if (CONTAINER_CHARACTERS.includes(next)) {
        const containerType = next as StartContainerToken['containerType'];
        tokens.push({ type: 'start-container', containerType });
        containerStack.push(containerType);
        i += 2; // Skip the # and the character
      } else {
        // Most likely a single closing control character, e.g. #
        const c = containerStack.pop();
        if (c) {
          tokens.push({ type: 'end-container', containerType: c });
        }
        i++;
      }
    }
    else {
      // Generic text
      // if the last token is text, pop it
      let lastToken = tokens[tokens.length - 1];
      if (lastToken && lastToken.type === 'content') {
        tokens.pop();
      } else {
        lastToken = { type: 'content', content: '' };
      }

      // Add till next #
      while (i < str.length && str[i] !== '#') {
        lastToken.content += str[i];
        i++;
      }
      tokens.push(lastToken);
    }
  }
  // Close off any open containers
  containerStack.reverse().forEach(c => {
    tokens.push({ type: 'end-container', containerType: c });
  });
  return tokens;
}
