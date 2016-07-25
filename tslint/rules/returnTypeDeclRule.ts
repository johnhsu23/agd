import * as Lint from 'tslint/lib/lint';
import * as ts from 'typescript';
import ContextAwareWalker from '../contextAwareWalker';

export class Rule extends Lint.Rules.AbstractRule {
  public static makeErrorString(type: 'Function' | 'Method', name: string): string {
    return `${type} '${name}' does not declare a return type.`;
  }

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new ReturnTypeDeclWalker(sourceFile, this.getOptions()));
  }
}

class ReturnTypeDeclWalker extends ContextAwareWalker<boolean> {
  protected defaultContext() {
    return false;
  }

  protected createDeclarationFailure(type: 'Function' | 'Method', node: ts.FunctionLikeDeclaration): Lint.RuleFailure {
    const {name, parameters} = node;

    const start = name.getStart(),
          end = parameters.end,
          // Add 1 to account for the trailing ')'
          width = (end - start) + 1;

    const message = Rule.makeErrorString(type, name.getText());

    return this.createFailure(start, width, message);
  }

  protected visitObjectLiteralExpression(node: ts.ObjectLiteralExpression): void {
    this.pushContext(false);
    super.visitObjectLiteralExpression(node);
    this.popContext();
  }

  protected visitClassDeclaration(node: ts.ClassDeclaration): void {
    this.pushContext(true);
    super.visitClassDeclaration(node);
    this.popContext();
  }

  protected visitClassExpression(node: ts.ClassExpression): void {
    this.pushContext(true);
    super.visitClassExpression(node);
    this.popContext();
  }

  protected visitFunctionDeclaration(node: ts.FunctionDeclaration): void {
    // Unconditionally check all function declarations
    if (!node.type) {
      this.addFailure(this.createDeclarationFailure('Function', node));
    }

    super.visitFunctionDeclaration(node);
  }

  protected visitMethodDeclaration(node: ts.MethodDeclaration): void {
    // Only check method declarations when we've been told to
    if (this.context() && !node.type) {
      this.addFailure(this.createDeclarationFailure('Method', node));
    }

    super.visitMethodDeclaration(node);
  }

  protected visitSourceFile(node: ts.SourceFile): void {
    this.pushContext();
    super.visitSourceFile(node);
  }
}
