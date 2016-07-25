import { RuleWalker } from 'tslint/lib/lint';

/**
 * A context-aware walker is a tslint RuleWalker class augmented with a context stack. The `Context` type parameter
 * represents the contextual information tracked by descendant classes.
 *
 * Conceptually, a Context is a set of state variables that can be saved and restored based on certain conditions.
 *
 * The typical idiom for using a context is like so:
 * protected visitSomeNodeType(node: ts.SomeNodeType): void {
 *   this.pushContext();
 *   super.visitSomeNodeType(node);
 *   this.popContext();
 * }
 *
 * TODO: Needs a better name.
 */
abstract class ContextAwareWalker<Context> extends RuleWalker {
  /**
   * Create a default context (or an empty one, if you prefer that intuition).
   */
  protected abstract defaultContext(): Context;

  /**
   * The context stack. Descendent classes should consider using the provided methods over manipulating this directly.
   */
  protected contexts: Context[] = [];

  /**
   * Return the current context, if any.
   */
  protected context(): Context {
    const contexts = this.contexts;

    return contexts[contexts.length - 1];
  }

  /**
   * Place a new context onto the context stack. If a context is not provided, a default one is created.
   */
  protected pushContext(context: Context = this.defaultContext()): void {
    this.contexts.push(context);
  }

  /**
   * Pop a context off the stack. The popped stack is returned.
   */
  protected popContext(): Context {
    return this.contexts.pop();
  }

  /**
   * Helper update function. Apply `func' to the current context.
   */
  protected modifyContext(func: (context: Context) => Context): void {
    const contexts = this.contexts,
          context = contexts[contexts.length - 1];

    contexts[contexts.length - 1] = func(context);
  }

  /**
   * Replaces the current context with the given one.
   * Equivalent to calling modifyContext() with `() => context' as an argument.
   */
  protected replaceContext(context: Context): void {
    this.modifyContext(() => context);
  }
}

export default ContextAwareWalker;
