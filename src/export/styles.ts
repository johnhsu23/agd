/**
 * A subset of the values on DOM collections. This is intended to be used with the `each()` function by way of
 * assignment compatibility.
 */
interface DOMList<T> {
  item(index: number): T;
  length: number;
}

/**
 * Iterate over a DOM collection (think CSSRuleList or NodeList).
 */
function each<T>(list: DOMList<T>, callback: (item: T, index: number) => void): void {
  if (!list) {
    return;
  }

  for (let i = 0; i < list.length; i++) {
    callback(list.item(i), i);
  }
}

/**
 * Given an <svg> node, return an array of styles that apply to it and its children.
 */
export default function applicableStyles(node: SVGSVGElement): string[] {
  const styles: string[] = [];

  each(document.styleSheets, eachSheet);
  return styles;

  // These are all functions because otherwise I'd lose my dang mind with the rightward indentation drift

  function eachSheet(sheet: StyleSheet): void {
    if (sheet instanceof CSSStyleSheet) {
      each(sheet.rules, eachRule);
    }
  }

  /**
   * Given a CSS rule, push applicable rules on to the `styles` array.
   */
  function eachRule(rule: CSSRule): void {
    if (rule instanceof CSSStyleRule) {
      // If the node or one of its children match the rule, copy the style.
      if (node.matches(rule.selectorText) || node.querySelector(rule.selectorText)) {
        styles.push(rule.cssText);
        return;
      }

      // This node is not likely the root of the document, so
      // we need to copy "universal" stuff into the document.
      const rootMatches = document.body.matches(rule.selectorText)
                       || document.documentElement.matches(rule.selectorText);
      if (rootMatches) {
        // Given a rule like "html { property: value; }", we can read out the `style` property
        // (which returns basically the stuff inside the curly braces)
        // and create a new rule based on this node's tag name.
        //
        // NB. We should consider the compatibility of the ":root" selector and use that instead
        // of relying on the node's tag name as being unique.
        const decl = rule.style.cssText;
        const tag = node.tagName.toLowerCase();
        styles.push(`${tag} { ${decl} }`);
      }
    }
  }
}
