"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var lint_1 = require("tslint/lib/lint");
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
var ContextAwareWalker = (function (_super) {
    __extends(ContextAwareWalker, _super);
    function ContextAwareWalker() {
        var _this = _super.apply(this, arguments) || this;
        /**
         * The context stack. Descendent classes should consider using the provided methods over manipulating this directly.
         */
        _this.contexts = [];
        return _this;
    }
    /**
     * Return the current context, if any.
     */
    ContextAwareWalker.prototype.context = function () {
        var contexts = this.contexts;
        return contexts[contexts.length - 1];
    };
    /**
     * Place a new context onto the context stack. If a context is not provided, a default one is created.
     */
    ContextAwareWalker.prototype.pushContext = function (context) {
        if (context === void 0) { context = this.defaultContext(); }
        this.contexts.push(context);
    };
    /**
     * Pop a context off the stack. The popped stack is returned.
     */
    ContextAwareWalker.prototype.popContext = function () {
        return this.contexts.pop();
    };
    /**
     * Helper update function. Apply `func' to the current context.
     */
    ContextAwareWalker.prototype.modifyContext = function (func) {
        var contexts = this.contexts, context = contexts[contexts.length - 1];
        contexts[contexts.length - 1] = func(context);
    };
    /**
     * Replaces the current context with the given one.
     * Equivalent to calling modifyContext() with `() => context' as an argument.
     */
    ContextAwareWalker.prototype.replaceContext = function (context) {
        this.modifyContext(function () { return context; });
    };
    return ContextAwareWalker;
}(lint_1.RuleWalker));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ContextAwareWalker;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dEF3YXJlV2Fsa2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29udGV4dEF3YXJlV2Fsa2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUE2QztBQUU3Qzs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUNIO0lBQW1ELHNDQUFVO0lBQTdEO1FBQUEsa0RBbURDO1FBN0NDOztXQUVHO1FBQ08sY0FBUSxHQUFjLEVBQUUsQ0FBQzs7SUEwQ3JDLENBQUM7SUF4Q0M7O09BRUc7SUFDTyxvQ0FBTyxHQUFqQjtRQUNFLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFFL0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRDs7T0FFRztJQUNPLHdDQUFXLEdBQXJCLFVBQXNCLE9BQXdDO1FBQXhDLHdCQUFBLEVBQUEsVUFBbUIsSUFBSSxDQUFDLGNBQWMsRUFBRTtRQUM1RCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQ7O09BRUc7SUFDTyx1Q0FBVSxHQUFwQjtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFRDs7T0FFRztJQUNPLDBDQUFhLEdBQXZCLFVBQXdCLElBQW1DO1FBQ3pELElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQ3hCLE9BQU8sR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUU5QyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVEOzs7T0FHRztJQUNPLDJDQUFjLEdBQXhCLFVBQXlCLE9BQWdCO1FBQ3ZDLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBTSxPQUFBLE9BQU8sRUFBUCxDQUFPLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBQ0gseUJBQUM7QUFBRCxDQUFDLEFBbkRELENBQW1ELGlCQUFVLEdBbUQ1RDs7QUFFRCxrQkFBZSxrQkFBa0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJ1bGVXYWxrZXIgfSBmcm9tICd0c2xpbnQvbGliL2xpbnQnO1xuXG4vKipcbiAqIEEgY29udGV4dC1hd2FyZSB3YWxrZXIgaXMgYSB0c2xpbnQgUnVsZVdhbGtlciBjbGFzcyBhdWdtZW50ZWQgd2l0aCBhIGNvbnRleHQgc3RhY2suIFRoZSBgQ29udGV4dGAgdHlwZSBwYXJhbWV0ZXJcbiAqIHJlcHJlc2VudHMgdGhlIGNvbnRleHR1YWwgaW5mb3JtYXRpb24gdHJhY2tlZCBieSBkZXNjZW5kYW50IGNsYXNzZXMuXG4gKlxuICogQ29uY2VwdHVhbGx5LCBhIENvbnRleHQgaXMgYSBzZXQgb2Ygc3RhdGUgdmFyaWFibGVzIHRoYXQgY2FuIGJlIHNhdmVkIGFuZCByZXN0b3JlZCBiYXNlZCBvbiBjZXJ0YWluIGNvbmRpdGlvbnMuXG4gKlxuICogVGhlIHR5cGljYWwgaWRpb20gZm9yIHVzaW5nIGEgY29udGV4dCBpcyBsaWtlIHNvOlxuICogcHJvdGVjdGVkIHZpc2l0U29tZU5vZGVUeXBlKG5vZGU6IHRzLlNvbWVOb2RlVHlwZSk6IHZvaWQge1xuICogICB0aGlzLnB1c2hDb250ZXh0KCk7XG4gKiAgIHN1cGVyLnZpc2l0U29tZU5vZGVUeXBlKG5vZGUpO1xuICogICB0aGlzLnBvcENvbnRleHQoKTtcbiAqIH1cbiAqXG4gKiBUT0RPOiBOZWVkcyBhIGJldHRlciBuYW1lLlxuICovXG5hYnN0cmFjdCBjbGFzcyBDb250ZXh0QXdhcmVXYWxrZXI8Q29udGV4dD4gZXh0ZW5kcyBSdWxlV2Fsa2VyIHtcbiAgLyoqXG4gICAqIENyZWF0ZSBhIGRlZmF1bHQgY29udGV4dCAob3IgYW4gZW1wdHkgb25lLCBpZiB5b3UgcHJlZmVyIHRoYXQgaW50dWl0aW9uKS5cbiAgICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBkZWZhdWx0Q29udGV4dCgpOiBDb250ZXh0O1xuXG4gIC8qKlxuICAgKiBUaGUgY29udGV4dCBzdGFjay4gRGVzY2VuZGVudCBjbGFzc2VzIHNob3VsZCBjb25zaWRlciB1c2luZyB0aGUgcHJvdmlkZWQgbWV0aG9kcyBvdmVyIG1hbmlwdWxhdGluZyB0aGlzIGRpcmVjdGx5LlxuICAgKi9cbiAgcHJvdGVjdGVkIGNvbnRleHRzOiBDb250ZXh0W10gPSBbXTtcblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBjdXJyZW50IGNvbnRleHQsIGlmIGFueS5cbiAgICovXG4gIHByb3RlY3RlZCBjb250ZXh0KCk6IENvbnRleHQge1xuICAgIGNvbnN0IGNvbnRleHRzID0gdGhpcy5jb250ZXh0cztcblxuICAgIHJldHVybiBjb250ZXh0c1tjb250ZXh0cy5sZW5ndGggLSAxXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQbGFjZSBhIG5ldyBjb250ZXh0IG9udG8gdGhlIGNvbnRleHQgc3RhY2suIElmIGEgY29udGV4dCBpcyBub3QgcHJvdmlkZWQsIGEgZGVmYXVsdCBvbmUgaXMgY3JlYXRlZC5cbiAgICovXG4gIHByb3RlY3RlZCBwdXNoQ29udGV4dChjb250ZXh0OiBDb250ZXh0ID0gdGhpcy5kZWZhdWx0Q29udGV4dCgpKTogdm9pZCB7XG4gICAgdGhpcy5jb250ZXh0cy5wdXNoKGNvbnRleHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBvcCBhIGNvbnRleHQgb2ZmIHRoZSBzdGFjay4gVGhlIHBvcHBlZCBzdGFjayBpcyByZXR1cm5lZC5cbiAgICovXG4gIHByb3RlY3RlZCBwb3BDb250ZXh0KCk6IENvbnRleHQge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHRzLnBvcCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhlbHBlciB1cGRhdGUgZnVuY3Rpb24uIEFwcGx5IGBmdW5jJyB0byB0aGUgY3VycmVudCBjb250ZXh0LlxuICAgKi9cbiAgcHJvdGVjdGVkIG1vZGlmeUNvbnRleHQoZnVuYzogKGNvbnRleHQ6IENvbnRleHQpID0+IENvbnRleHQpOiB2b2lkIHtcbiAgICBjb25zdCBjb250ZXh0cyA9IHRoaXMuY29udGV4dHMsXG4gICAgICAgICAgY29udGV4dCA9IGNvbnRleHRzW2NvbnRleHRzLmxlbmd0aCAtIDFdO1xuXG4gICAgY29udGV4dHNbY29udGV4dHMubGVuZ3RoIC0gMV0gPSBmdW5jKGNvbnRleHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2VzIHRoZSBjdXJyZW50IGNvbnRleHQgd2l0aCB0aGUgZ2l2ZW4gb25lLlxuICAgKiBFcXVpdmFsZW50IHRvIGNhbGxpbmcgbW9kaWZ5Q29udGV4dCgpIHdpdGggYCgpID0+IGNvbnRleHQnIGFzIGFuIGFyZ3VtZW50LlxuICAgKi9cbiAgcHJvdGVjdGVkIHJlcGxhY2VDb250ZXh0KGNvbnRleHQ6IENvbnRleHQpOiB2b2lkIHtcbiAgICB0aGlzLm1vZGlmeUNvbnRleHQoKCkgPT4gY29udGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29udGV4dEF3YXJlV2Fsa2VyO1xuIl19