import { Node, UserData } from '../types/ruleEngine';

export function createRule(ruleString: string): Node {
  const tokens = ruleString.match(/\(|\)|\w+|[<>=]+|\d+|'[^']*'/g) || [];
  let index = 0;

  function parseExpression(): Node {
    if (tokens[index] === '(') {
      index++;
      const left = parseExpression();
      const operator = tokens[index++];
      const right = parseExpression();
      index++; // Skip closing parenthesis
      return { type: 'operator', left, right, operator };
    } else {
      const attribute = tokens[index++];
      const operator = tokens[index++];
      const value = tokens[index++].replace(/'/g, '');
      return { type: 'operand', attribute, operator, value };
    }
  }

  return parseExpression();
}

export function combineRules(rules: string[]): Node {
  const parsedRules = rules.map(createRule);
  return {
    type: 'operator',
    operator: 'AND',
    left: parsedRules[0],
    right: parsedRules.slice(1).reduce((acc, rule) => ({
      type: 'operator',
      operator: 'AND',
      left: acc,
      right: rule,
    })),
  };
}

export function evaluateRule(node: Node, data: UserData): boolean {
  if (node.type === 'operator') {
    const leftResult = evaluateRule(node.left!, data);
    const rightResult = evaluateRule(node.right!, data);
    return node.operator === 'AND' ? leftResult && rightResult : leftResult || rightResult;
  } else {
    const { attribute, operator, value } = node;
    const dataValue = data[attribute!];
    switch (operator) {
      case '>':
        return dataValue > Number(value);
      case '<':
        return dataValue < Number(value);
      case '=':
        return dataValue === value;
      default:
        throw new Error(`Unsupported operator: ${operator}`);
    }
  }
}