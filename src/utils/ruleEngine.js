// src/utils/ruleEngine.js

// Function to parse a rule string and create an Abstract Syntax Tree (AST)
export function createRule(ruleString) {
  // Tokenize the rule string using a regular expression to capture parentheses, words, operators, etc.
  const tokens = ruleString.match(/\(|\)|\w+|[<>=]+|AND|OR|\d+|'[^']*'/g) || [];
  let index = 0;

  // Recursive function to parse expressions
  function parseExpression() {
    let left = parseTerm(); // Parse the first part of the expression

    // Check for logical operators (AND, OR) and keep parsing if present
    while (tokens[index] === 'AND' || tokens[index] === 'OR') {
      const operator = tokens[index++]; // Get the logical operator
      const right = parseTerm(); // Parse the right-hand side of the expression
      left = { type: 'operator', operator, left, right }; // Create an operator node in the AST
    }

    return left;
  }

  // Function to parse individual terms (either parentheses or operands)
  function parseTerm() {
    if (tokens[index] === '(') {
      index++; // Skip the opening parenthesis
      const expression = parseExpression(); // Parse the expression inside the parentheses
      index++; // Skip the closing parenthesis
      return expression;
    } else {
      // Parse operands like attribute, operator, and value
      const attribute = tokens[index++];
      const operator = tokens[index++];
      const value = tokens[index++].replace(/'/g, ''); // Remove single quotes around values
      return { type: 'operand', attribute, operator, value };
    }
  }

  return parseExpression(); // Start parsing the expression
}

// Function to combine multiple rules into a single AST
export function combineRules(rules) {
  const parsedRules = rules.map(createRule); // Parse each rule into an AST

  // If there's only one rule, return it directly
  if (parsedRules.length === 1) {
    return parsedRules[0];
  }

  // Combine multiple rules using the AND operator
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

// Function to evaluate the parsed rule (AST) against provided data
export function evaluateRule(node, data) {
  // If the node is an operator (AND, OR), recursively evaluate the left and right sides
  if (node.type === 'operator') {
    const leftResult = evaluateRule(node.left, data);
    const rightResult = evaluateRule(node.right, data);

    switch (node.operator) {
      case 'AND':
        return leftResult && rightResult; // Logical AND
      case 'OR':
        return leftResult || rightResult; // Logical OR
      default:
        throw new Error(`Unsupported logical operator: ${node.operator}`);
    }
  } else {
    // If the node is an operand, compare the data using the specified operator
    const { attribute, operator, value } = node;
    const dataValue = data[attribute]; // Get the value from the provided data
    switch (operator) {
      case '>':
        return dataValue > Number(value);
      case '<':
        return dataValue < Number(value);
      case '=':
        return dataValue === value;
      default:
        throw new Error(`Unsupported relational operator: ${operator}`);
    }
  }
}

// Exporting the functions as default export
export default {
  createRule,
  combineRules,
  evaluateRule,
};
