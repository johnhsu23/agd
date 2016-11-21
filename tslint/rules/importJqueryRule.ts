import * as Lint from 'tslint/lib/lint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = 'Do not use global jQuery.';

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new ImportJqueryWalker(sourceFile, this.getOptions()));
  }
}

interface SawJqueryScope {
  dollarSign: boolean;
  jQuery: boolean;
}

class ImportJqueryWalker extends Lint.BlockScopeAwareRuleWalker<SawJqueryScope, SawJqueryScope> {
  public createBlockScope(): SawJqueryScope {
    if ((this as {} as { blockScopeStack: {} }).blockScopeStack) {
      return Object.create(this.getCurrentBlockScope());
    } else {
      return Object.create(null);
    }
  }

  public createScope(): SawJqueryScope {
    if ((this as {} as { scopeStack: {} }).scopeStack) {
      return Object.create(this.getCurrentScope());
    } else {
      return Object.create(null);
    }
  }

  protected sawDollarSign(): boolean {
    return this.getCurrentBlockScope().dollarSign
        || this.getAllScopes().some(scope => scope.dollarSign);
  }

  protected sawJquery(): boolean {
    return this.getCurrentBlockScope().jQuery
        || this.getAllScopes().some(scope => scope.jQuery);
  }

  protected inspect(scope: SawJqueryScope, text: string): void {
    switch (text) {
      case '$':
        scope.dollarSign = true;
        break;

      case 'jQuery':
        scope.jQuery = true;
        break;
    }
  }

  protected visitImportDeclaration(node: ts.ImportDeclaration): void {
    const scope = this.getCurrentScope();

    const clause = node.importClause;

    // This is an import like "import 'foo';"
    if (!clause) {
      return;
    }

    // Default import
    if (clause.name) {
      this.inspect(scope, clause.name.getText());
    }

    const bindings = clause.namedBindings;
    if (!bindings) {
      return;
    }

    // import * as foo from 'module';
    if (bindings.kind === ts.SyntaxKind.NamespaceImport) {
      return this.inspect(scope, bindings.name.getText());
    }

    // import {...} from 'module';
    if (bindings.kind === ts.SyntaxKind.NamedImports) {
      for (const element of bindings.elements) {
        this.inspect(scope, element.name.getText());
      }
    }
  }

  protected visitClassExpression(node: ts.ClassExpression): void {
    const scope = this.getCurrentBlockScope();

    if (node.name) {
      this.inspect(scope, node.name.getText());
    }

    return super.visitClassExpression(node);
  }

  protected visitClassDeclaration(node: ts.ClassDeclaration): void {
    const scope = Object.getPrototypeOf(this.getCurrentBlockScope());

    if (node.name) {
      this.inspect(scope, node.name.getText());
    }

    return super.visitClassDeclaration(node);
  }

  protected visitFunctionExpression(node: ts.FunctionExpression): void {
    if (node.name) {
      this.inspect(this.getCurrentScope(), node.name.getText());
    }

    return super.visitFunctionExpression(node);
  }

  protected visitFunctionDeclaration(node: ts.FunctionDeclaration): void {
    const scope = Object.getPrototypeOf(this.getCurrentScope());

    if (node.name) {
      this.inspect(scope, node.name.getText());
    }

    return super.visitFunctionDeclaration(node);
  }

  protected visitParameterDeclaration(node: ts.ParameterDeclaration): void {
    const scope = this.getCurrentScope();

    const name = node.name;
    if (name.kind === ts.SyntaxKind.Identifier) {
      // (name)
      this.inspect(scope, name.getText());
    } else {
      // ({name}) or ([name]) or ...
      this.inspectBindings(scope, name);
    }
  }

  protected visitIdentifier(node: ts.Identifier): void {
    const ident = node.getText(),
          isFailure = (ident === '$' && !this.sawDollarSign())
                   || (ident === 'jQuery' && !this.sawJquery());

    if (isFailure) {
      this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
    }
  }

  protected visitVariableStatement(node: ts.VariableStatement): void {
    const list = node.declarationList;

    const isBlockScoped = (list.flags & (ts.NodeFlags.Const | ts.NodeFlags.Let)) !== 0;

    const scope = isBlockScoped ? this.getCurrentBlockScope() : this.getCurrentScope();

    for (const decl of list.declarations) {
      this.inspectDeclaration(scope, decl);
    }
  }

  protected visitMethodDeclaration(node: ts.MethodDeclaration): void {
    for (const param of node.parameters) {
      this.visitNode(param);
    }

    if (node.body) {
      this.visitNode(node.body);
    }
  }

  protected visitPropertyAssignment(node: ts.PropertyAssignment): void {
    this.visitNode(node.initializer);
  }

  protected visitPropertyAccessExpression(node: ts.PropertyAccessExpression): void {
    this.visitNode(node.expression);
  }

  protected visitPropertyDeclaration(node: ts.PropertyDeclaration): void {
    if (node.initializer) {
      super.visitNode(node.initializer);
    }
  }

  protected inspectBindings(scope: SawJqueryScope, node: ts.BindingPattern): void {
    for (const binding of node.elements) {
      if (binding.kind !== ts.SyntaxKind.OmittedExpression) {
        this.inspectBinding(scope, binding);

        if (binding.initializer) {
          this.visitNode(binding.initializer);
        }
      }
    }
  }

  protected inspectBinding(scope: SawJqueryScope, node: ts.BindingElement | ts.ArrayBindingElement): void {
    if (node.kind === ts.SyntaxKind.BindingElement) {
      const name = node.name;

      if (name.kind === ts.SyntaxKind.Identifier) {
        this.inspect(scope, name.getText());
      } else {
        this.inspectBindings(scope, name);
      }

      if (node.initializer) {
        this.visitNode(node.initializer);
      }
    }
  }

  protected inspectDeclaration(scope: SawJqueryScope, node: ts.VariableDeclaration) {
    const name = node.name;
    if (name.kind === ts.SyntaxKind.Identifier) {
      this.inspect(scope, name.getText());
    } else {
      this.inspectBindings(scope, name);
    }

    if (node.initializer) {
      this.visitNode(node.initializer);
    }
  }
}
