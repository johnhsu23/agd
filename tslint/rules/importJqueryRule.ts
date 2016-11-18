import * as Lint from 'tslint/lib/lint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = 'Do not use global jQuery.';

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new ImportJqueryWalker(sourceFile, this.getOptions()));
  }
}

class ImportJqueryWalker extends Lint.RuleWalker {
  /**
   * Indicates the source file imported jQuery as $.
   */
  protected sawDollarSign = false;

  /**
   * Indicates the source file imported jQuery.
   */
  protected sawJquery = false;

  protected visitImportDeclaration(node: ts.ImportDeclaration): void {
    // Ensure this is an import of the module named 'jquery'.
    const specifier = node.moduleSpecifier;
    if (specifier.kind !== ts.SyntaxKind.StringLiteral || (specifier as ts.StringLiteral).text !== 'jquery') {
      return;
    }

    // Ensure there is an import clause, and that it has named bindings (i.e., isn't a default import)
    const clause = node.importClause;
    if (!(clause && clause.namedBindings)) {
      return;
    }

    // Ensure this is a namespace (import * as foo) import.
    const bindings = clause.namedBindings;
    if (bindings.kind !== ts.SyntaxKind.NamespaceImport) {
      return;
    }

    switch (bindings.name.getText()) {
      case '$':
        this.sawDollarSign = true;
        break;

      case 'jQuery':
        this.sawJquery = true;
        break;
    }
  }

  protected visitIdentifier(node: ts.Identifier): void {
    const ident = node.getText(),
          isFailure = (ident === '$' && !this.sawDollarSign)
                   || (ident === 'jQuery' && !this.sawJquery);

    if (isFailure) {
      this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
    }
  }
}
