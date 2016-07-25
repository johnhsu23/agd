import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';
import toHex from '../util/hex';

// TODO: This rule needs a better name.

/**
 * Creates a four-digit Unicode escape from a given hexadecimal char code.
 *
 * This needs updating to support astral plane characters (code point > 0xFFFF).
 */
function makeEscape(code: number): string {
  const hex = toHex(code);

  switch (hex.length) {
    case 1:
      return '\\u000' + hex;

    case 2:
      return '\\u00' + hex;

    case 3:
      return '\\u0' + hex;

    default:
      return '\\u' + hex;
  }
}

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING_FACTORY =
    (char: string) => `Character '${char}' should be written as '${makeEscape(char.charCodeAt(0))}'`;

  // TODO: Differentiate between enforcing 8-bitness (no code points above 0x100) and enforcing ASCII-ness
  // (that is, no code points above 0x7f).

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new NoAsciiWalker(sourceFile, this.getOptions()));
  }
}

class NoAsciiWalker extends Lint.RuleWalker {
  // Note: The character range [0x80 - 0xFF] is considered ASCII even though it's technically Latin-1.
  // Oh well.
  protected static NON_ASCII_REGEX = /[\u0100-\uFFFF]/;

  protected visitStringLiteral(node: ts.StringLiteral): void {
    this.checkLiteralNode(node);

    super.visitStringLiteral(node);
  }

  protected visitTemplateExpression(node: ts.TemplateExpression): void {
    this.checkLiteralNode(node.head);

    ts.forEachChild(node, (child: ts.TemplateSpan) => {
      if (child.literal) {
        this.checkLiteralNode(child.literal);
      }
    });

    super.visitTemplateExpression(node);
  }

  protected visitNode(node: ts.Node): void {
    // tslint doesn't seem have a visitFoo() method for nodes like `foo`,
    // So we have to check here.
    if (node.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
      this.checkLiteralNode(node as ts.TemplateLiteralFragment);
    }

    super.visitNode(node);
  }

  /**
   * Check a string literal for offending Unicode characters.
   */
  protected checkLiteralNode(node: ts.LiteralLikeNode): void {
    const text = node.text;
    const match = text.match(NoAsciiWalker.NON_ASCII_REGEX);

    if (match) {
      const offender = text.charAt(match.index);
      this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_FACTORY(offender)));
    }
  }
}
