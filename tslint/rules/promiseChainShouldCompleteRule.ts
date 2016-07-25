import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import * as syntax from '../util/syntax';
import ContextAwareWalker from '../contextAwareWalker';

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = 'A promise chain should either use its result or call .done().';

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new PromiseChainWalker(sourceFile, this.getOptions()));
  }
}

interface Context {
  /**
   * Is this expression considered 'used' (a better term would be 'consumed')?
   */
  expressionUsed: boolean;
  /**
   * Did we see a call to .done() in this promise chain?
   */
  sawDone: boolean;
  /**
   * If we saw a call to .then(), this rule is considered active within the current context.
   */
  check: boolean;
}

class PromiseChainWalker extends ContextAwareWalker<Context> {
  /**
   * Should we report an error given the passed-in state?
   *
   * Definition: We should report an error if:
   * 1. The context's `check' flag is true (i.e., our heuristic tripped)., and
   * 2. The promise chain was neither consumed, nor was .done() called.
   */
  protected shouldReportError(context: Context): boolean {
    if (context.check) {
      return !(context.expressionUsed || context.sawDone);
    }

    return false;
  }

  protected defaultContext(): Context {
    return {
      expressionUsed: false,
      sawDone: false,
      check: false,
    };
  }

  /**
   * Helps construct a context in which the expression to be examined is already flagged as used.
   */
  protected enterContext(expressionUsed: boolean) {
    this.pushContext({
      expressionUsed,
      sawDone: false,
      check: false,
    });
  }

  /**
   * Helper method: pops a context off the stack and checks for error reporting.
   *
   * Known deficiences: abysmally imprecise error reporting in the case of an ExpressionStatement node, since it flags
   * the entire statement.
   */
  protected leaveContext(node: ts.Node): void {
    const context = this.popContext();

    if (this.shouldReportError(context)) {
      this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
    }
  }

  /**
   * Helper method: saves and restores the current context before visiting a given node.
   */
  protected checkWithContext(node: ts.Node, expressionUsed: boolean): void {
    this.enterContext(expressionUsed);
    this.visitNode(node);
    this.leaveContext(node);
  }

  protected visitCallExpression(node: ts.CallExpression): void {
    const context = this.context();

    if (syntax.isCallToThen(node)) {
      // (...).then(...) => this rule is now active
      context.check = true;
    } else if (syntax.isCallToDone(node)) {
      // (...).done() => cool, you're safe.
      context.sawDone = true;
    }

    // Function arguments are considered used
    for (const arg of node.arguments) {
      this.checkWithContext(arg, true);
    }

    // No need to call super() since we walked the arguments above.
  }

  protected visitExpressionStatement(node: ts.ExpressionStatement): void {
    this.pushContext();

    super.visitExpressionStatement(node);

    this.leaveContext(node);
  }

  protected visitBinaryExpression(node: ts.BinaryExpression): void {
    const inUse = /=/.test(node.operatorToken.getText());

    // Rules:
    // - LHS: Never considered used
    // - RHS: Considered used only if this binary operation is an assignment
    this.checkWithContext(node.left, false);
    this.checkWithContext(node.right, inUse);
  }

  protected visitSourceFile(node: ts.SourceFile): void {
    // Create an empty context to avoid popping `undefined' unexpectedly.
    this.pushContext();

    super.visitSourceFile(node);
  }
}
