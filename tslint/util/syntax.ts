import * as ts from 'typescript';

/*
 * Helper function for maximum type safety.
 *
 * Pros: avoids a type assertion.
 * Cons: adds a stack frame.
 *
 * Oh well.
 */
function isPropertyAccess(node: ts.Node): node is ts.PropertyAccessExpression {
  return node.kind === ts.SyntaxKind.PropertyAccessExpression;
}

/*
 * Helper function: determine if the callee of this CallExpression is a reference to the named method.
 */
function isCallToMethod(node: ts.CallExpression, method: string): boolean {
  const callee = node.expression;

  if (!callee) {
    return false;
  }

  if (isPropertyAccess(callee)) {
    return callee.name.text === method;
  }

  // TODO: look for ["then"] access pattern

  return false;
}

/**
 * Is this call expression like <something>.done(...) ?
 */
export function isCallToDone(node: ts.CallExpression): boolean {
  return isCallToMethod(node, 'done');
}

/**
 * Is this call expression like <something>.then(...) ?
 */
export function isCallToThen(node: ts.CallExpression): boolean {
  return isCallToMethod(node, 'then');
}
