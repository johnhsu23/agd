import * as Lint from 'tslint/lib/lint';
import * as ts from 'typescript';
import ContextAwareWalker from '../contextAwareWalker';

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = 'Do not nest ternary operators.';

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new NoNestedTernaryWalker(sourceFile, this.getOptions()));
  }
}

class NoNestedTernaryWalker extends ContextAwareWalker<boolean> {
  protected defaultContext(): boolean {
    return false;
  }

  protected markInsideTernary() {
    this.replaceContext(true);
  }

  protected insideTernary(): boolean {
    return this.context();
  }

  protected markOutsideTernary() {
    this.replaceContext(false);
  }

  public visitConditionalExpression(node: ts.ConditionalExpression) {
    if (this.insideTernary()) {
      this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));

      super.visitConditionalExpression(node);
    } else {
      this.markInsideTernary();
      super.visitConditionalExpression(node);
      this.markOutsideTernary();
    }
  }

  /*
   * We consider new blocks to be non-nested.
   * This causes a situation like the following to be considered valid:
   *   foo ? bar : function () { foo ? bar : baz };
   *
   * However, the rule in play here mandates that ternary _expressions_ cannot be nested, and creating
   * a new block inside a ternary, while most certainly a violation of common sense, isn't a violation
   * of this rule per se.
   */
  public visitBlock(node: ts.Block) {
    this.pushContext();

    super.visitBlock(node);

    this.popContext();
  }
}
