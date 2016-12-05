"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lint = require("tslint/lib/lint");
var syntax = require("../util/syntax");
var contextAwareWalker_1 = require("../contextAwareWalker");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new PromiseChainWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
Rule.FAILURE_STRING = 'A promise chain should either use its result or call .done().';
var PromiseChainWalker = (function (_super) {
    __extends(PromiseChainWalker, _super);
    function PromiseChainWalker() {
        return _super.apply(this, arguments) || this;
    }
    /**
     * Should we report an error given the passed-in state?
     *
     * Definition: We should report an error if:
     * 1. The context's `check' flag is true (i.e., our heuristic tripped)., and
     * 2. The promise chain was neither consumed, nor was .done() called.
     */
    PromiseChainWalker.prototype.shouldReportError = function (context) {
        if (context.check) {
            return !(context.expressionUsed || context.sawDone);
        }
        return false;
    };
    PromiseChainWalker.prototype.defaultContext = function () {
        return {
            expressionUsed: false,
            sawDone: false,
            check: false,
        };
    };
    /**
     * Helps construct a context in which the expression to be examined is already flagged as used.
     */
    PromiseChainWalker.prototype.enterContext = function (expressionUsed) {
        this.pushContext({
            expressionUsed: expressionUsed,
            sawDone: false,
            check: false,
        });
    };
    /**
     * Helper method: pops a context off the stack and checks for error reporting.
     *
     * Known deficiences: abysmally imprecise error reporting in the case of an ExpressionStatement node, since it flags
     * the entire statement.
     */
    PromiseChainWalker.prototype.leaveContext = function (node) {
        var context = this.popContext();
        if (this.shouldReportError(context)) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
    };
    /**
     * Helper method: saves and restores the current context before visiting a given node.
     */
    PromiseChainWalker.prototype.checkWithContext = function (node, expressionUsed) {
        this.enterContext(expressionUsed);
        this.visitNode(node);
        this.leaveContext(node);
    };
    PromiseChainWalker.prototype.visitCallExpression = function (node) {
        var context = this.context();
        if (syntax.isCallToThen(node)) {
            // (...).then(...) => this rule is now active
            context.check = true;
        }
        else if (syntax.isCallToDone(node)) {
            // (...).done() => cool, you're safe.
            context.sawDone = true;
        }
        // Function arguments are considered used
        for (var _i = 0, _a = node.arguments; _i < _a.length; _i++) {
            var arg = _a[_i];
            this.checkWithContext(arg, true);
        }
        // No need to call super() since we walked the arguments above.
    };
    PromiseChainWalker.prototype.visitExpressionStatement = function (node) {
        this.pushContext();
        _super.prototype.visitExpressionStatement.call(this, node);
        this.leaveContext(node);
    };
    PromiseChainWalker.prototype.visitBinaryExpression = function (node) {
        var inUse = /=/.test(node.operatorToken.getText());
        // Rules:
        // - LHS: Never considered used
        // - RHS: Considered used only if this binary operation is an assignment
        this.checkWithContext(node.left, false);
        this.checkWithContext(node.right, inUse);
    };
    PromiseChainWalker.prototype.visitSourceFile = function (node) {
        // Create an empty context to avoid popping `undefined' unexpectedly.
        this.pushContext();
        _super.prototype.visitSourceFile.call(this, node);
    };
    return PromiseChainWalker;
}(contextAwareWalker_1.default));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvbWlzZUNoYWluU2hvdWxkQ29tcGxldGVSdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicHJvbWlzZUNoYWluU2hvdWxkQ29tcGxldGVSdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHNDQUF3QztBQUV4Qyx1Q0FBeUM7QUFDekMsNERBQXVEO0FBRXZEO0lBQTBCLHdCQUF1QjtJQUFqRDs7SUFNQSxDQUFDO0lBSFEsb0JBQUssR0FBWixVQUFhLFVBQXlCO1FBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksa0JBQWtCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDckYsQ0FBQztJQUNILFdBQUM7QUFBRCxDQUFDLEFBTkQsQ0FBMEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZO0FBQWpELG9CQU1DO0FBTGUsbUJBQWMsR0FBRywrREFBK0QsQ0FBQztBQXNCakc7SUFBaUMsc0NBQTJCO0lBQTVEOztJQXFHQSxDQUFDO0lBcEdDOzs7Ozs7T0FNRztJQUNPLDhDQUFpQixHQUEzQixVQUE0QixPQUFnQjtRQUMxQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNsQixNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RELENBQUM7UUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVTLDJDQUFjLEdBQXhCO1FBQ0UsTUFBTSxDQUFDO1lBQ0wsY0FBYyxFQUFFLEtBQUs7WUFDckIsT0FBTyxFQUFFLEtBQUs7WUFDZCxLQUFLLEVBQUUsS0FBSztTQUNiLENBQUM7SUFDSixDQUFDO0lBRUQ7O09BRUc7SUFDTyx5Q0FBWSxHQUF0QixVQUF1QixjQUF1QjtRQUM1QyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQ2YsY0FBYyxnQkFBQTtZQUNkLE9BQU8sRUFBRSxLQUFLO1lBQ2QsS0FBSyxFQUFFLEtBQUs7U0FDYixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDTyx5Q0FBWSxHQUF0QixVQUF1QixJQUFhO1FBQ2xDLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUVsQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBQzdGLENBQUM7SUFDSCxDQUFDO0lBRUQ7O09BRUc7SUFDTyw2Q0FBZ0IsR0FBMUIsVUFBMkIsSUFBYSxFQUFFLGNBQXVCO1FBQy9ELElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFUyxnREFBbUIsR0FBN0IsVUFBOEIsSUFBdUI7UUFDbkQsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRS9CLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLDZDQUE2QztZQUM3QyxPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUN2QixDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLHFDQUFxQztZQUNyQyxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUN6QixDQUFDO1FBRUQseUNBQXlDO1FBQ3pDLEdBQUcsQ0FBQyxDQUFjLFVBQWMsRUFBZCxLQUFBLElBQUksQ0FBQyxTQUFTLEVBQWQsY0FBYyxFQUFkLElBQWM7WUFBM0IsSUFBTSxHQUFHLFNBQUE7WUFDWixJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ2xDO1FBRUQsK0RBQStEO0lBQ2pFLENBQUM7SUFFUyxxREFBd0IsR0FBbEMsVUFBbUMsSUFBNEI7UUFDN0QsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRW5CLGlCQUFNLHdCQUF3QixZQUFDLElBQUksQ0FBQyxDQUFDO1FBRXJDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVTLGtEQUFxQixHQUEvQixVQUFnQyxJQUF5QjtRQUN2RCxJQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUVyRCxTQUFTO1FBQ1QsK0JBQStCO1FBQy9CLHdFQUF3RTtRQUN4RSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRVMsNENBQWUsR0FBekIsVUFBMEIsSUFBbUI7UUFDM0MscUVBQXFFO1FBQ3JFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUVuQixpQkFBTSxlQUFlLFlBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUNILHlCQUFDO0FBQUQsQ0FBQyxBQXJHRCxDQUFpQyw0QkFBa0IsR0FxR2xEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQgKiBhcyBMaW50IGZyb20gJ3RzbGludC9saWIvbGludCc7XG5cbmltcG9ydCAqIGFzIHN5bnRheCBmcm9tICcuLi91dGlsL3N5bnRheCc7XG5pbXBvcnQgQ29udGV4dEF3YXJlV2Fsa2VyIGZyb20gJy4uL2NvbnRleHRBd2FyZVdhbGtlcic7XG5cbmV4cG9ydCBjbGFzcyBSdWxlIGV4dGVuZHMgTGludC5SdWxlcy5BYnN0cmFjdFJ1bGUge1xuICBwdWJsaWMgc3RhdGljIEZBSUxVUkVfU1RSSU5HID0gJ0EgcHJvbWlzZSBjaGFpbiBzaG91bGQgZWl0aGVyIHVzZSBpdHMgcmVzdWx0IG9yIGNhbGwgLmRvbmUoKS4nO1xuXG4gIHB1YmxpYyBhcHBseShzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlKTogTGludC5SdWxlRmFpbHVyZVtdIHtcbiAgICByZXR1cm4gdGhpcy5hcHBseVdpdGhXYWxrZXIobmV3IFByb21pc2VDaGFpbldhbGtlcihzb3VyY2VGaWxlLCB0aGlzLmdldE9wdGlvbnMoKSkpO1xuICB9XG59XG5cbmludGVyZmFjZSBDb250ZXh0IHtcbiAgLyoqXG4gICAqIElzIHRoaXMgZXhwcmVzc2lvbiBjb25zaWRlcmVkICd1c2VkJyAoYSBiZXR0ZXIgdGVybSB3b3VsZCBiZSAnY29uc3VtZWQnKT9cbiAgICovXG4gIGV4cHJlc3Npb25Vc2VkOiBib29sZWFuO1xuICAvKipcbiAgICogRGlkIHdlIHNlZSBhIGNhbGwgdG8gLmRvbmUoKSBpbiB0aGlzIHByb21pc2UgY2hhaW4/XG4gICAqL1xuICBzYXdEb25lOiBib29sZWFuO1xuICAvKipcbiAgICogSWYgd2Ugc2F3IGEgY2FsbCB0byAudGhlbigpLCB0aGlzIHJ1bGUgaXMgY29uc2lkZXJlZCBhY3RpdmUgd2l0aGluIHRoZSBjdXJyZW50IGNvbnRleHQuXG4gICAqL1xuICBjaGVjazogYm9vbGVhbjtcbn1cblxuY2xhc3MgUHJvbWlzZUNoYWluV2Fsa2VyIGV4dGVuZHMgQ29udGV4dEF3YXJlV2Fsa2VyPENvbnRleHQ+IHtcbiAgLyoqXG4gICAqIFNob3VsZCB3ZSByZXBvcnQgYW4gZXJyb3IgZ2l2ZW4gdGhlIHBhc3NlZC1pbiBzdGF0ZT9cbiAgICpcbiAgICogRGVmaW5pdGlvbjogV2Ugc2hvdWxkIHJlcG9ydCBhbiBlcnJvciBpZjpcbiAgICogMS4gVGhlIGNvbnRleHQncyBgY2hlY2snIGZsYWcgaXMgdHJ1ZSAoaS5lLiwgb3VyIGhldXJpc3RpYyB0cmlwcGVkKS4sIGFuZFxuICAgKiAyLiBUaGUgcHJvbWlzZSBjaGFpbiB3YXMgbmVpdGhlciBjb25zdW1lZCwgbm9yIHdhcyAuZG9uZSgpIGNhbGxlZC5cbiAgICovXG4gIHByb3RlY3RlZCBzaG91bGRSZXBvcnRFcnJvcihjb250ZXh0OiBDb250ZXh0KTogYm9vbGVhbiB7XG4gICAgaWYgKGNvbnRleHQuY2hlY2spIHtcbiAgICAgIHJldHVybiAhKGNvbnRleHQuZXhwcmVzc2lvblVzZWQgfHwgY29udGV4dC5zYXdEb25lKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcm90ZWN0ZWQgZGVmYXVsdENvbnRleHQoKTogQ29udGV4dCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGV4cHJlc3Npb25Vc2VkOiBmYWxzZSxcbiAgICAgIHNhd0RvbmU6IGZhbHNlLFxuICAgICAgY2hlY2s6IGZhbHNlLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogSGVscHMgY29uc3RydWN0IGEgY29udGV4dCBpbiB3aGljaCB0aGUgZXhwcmVzc2lvbiB0byBiZSBleGFtaW5lZCBpcyBhbHJlYWR5IGZsYWdnZWQgYXMgdXNlZC5cbiAgICovXG4gIHByb3RlY3RlZCBlbnRlckNvbnRleHQoZXhwcmVzc2lvblVzZWQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLnB1c2hDb250ZXh0KHtcbiAgICAgIGV4cHJlc3Npb25Vc2VkLFxuICAgICAgc2F3RG9uZTogZmFsc2UsXG4gICAgICBjaGVjazogZmFsc2UsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSGVscGVyIG1ldGhvZDogcG9wcyBhIGNvbnRleHQgb2ZmIHRoZSBzdGFjayBhbmQgY2hlY2tzIGZvciBlcnJvciByZXBvcnRpbmcuXG4gICAqXG4gICAqIEtub3duIGRlZmljaWVuY2VzOiBhYnlzbWFsbHkgaW1wcmVjaXNlIGVycm9yIHJlcG9ydGluZyBpbiB0aGUgY2FzZSBvZiBhbiBFeHByZXNzaW9uU3RhdGVtZW50IG5vZGUsIHNpbmNlIGl0IGZsYWdzXG4gICAqIHRoZSBlbnRpcmUgc3RhdGVtZW50LlxuICAgKi9cbiAgcHJvdGVjdGVkIGxlYXZlQ29udGV4dChub2RlOiB0cy5Ob2RlKTogdm9pZCB7XG4gICAgY29uc3QgY29udGV4dCA9IHRoaXMucG9wQ29udGV4dCgpO1xuXG4gICAgaWYgKHRoaXMuc2hvdWxkUmVwb3J0RXJyb3IoY29udGV4dCkpIHtcbiAgICAgIHRoaXMuYWRkRmFpbHVyZSh0aGlzLmNyZWF0ZUZhaWx1cmUobm9kZS5nZXRTdGFydCgpLCBub2RlLmdldFdpZHRoKCksIFJ1bGUuRkFJTFVSRV9TVFJJTkcpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGVscGVyIG1ldGhvZDogc2F2ZXMgYW5kIHJlc3RvcmVzIHRoZSBjdXJyZW50IGNvbnRleHQgYmVmb3JlIHZpc2l0aW5nIGEgZ2l2ZW4gbm9kZS5cbiAgICovXG4gIHByb3RlY3RlZCBjaGVja1dpdGhDb250ZXh0KG5vZGU6IHRzLk5vZGUsIGV4cHJlc3Npb25Vc2VkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5lbnRlckNvbnRleHQoZXhwcmVzc2lvblVzZWQpO1xuICAgIHRoaXMudmlzaXROb2RlKG5vZGUpO1xuICAgIHRoaXMubGVhdmVDb250ZXh0KG5vZGUpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHZpc2l0Q2FsbEV4cHJlc3Npb24obm9kZTogdHMuQ2FsbEV4cHJlc3Npb24pOiB2b2lkIHtcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5jb250ZXh0KCk7XG5cbiAgICBpZiAoc3ludGF4LmlzQ2FsbFRvVGhlbihub2RlKSkge1xuICAgICAgLy8gKC4uLikudGhlbiguLi4pID0+IHRoaXMgcnVsZSBpcyBub3cgYWN0aXZlXG4gICAgICBjb250ZXh0LmNoZWNrID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHN5bnRheC5pc0NhbGxUb0RvbmUobm9kZSkpIHtcbiAgICAgIC8vICguLi4pLmRvbmUoKSA9PiBjb29sLCB5b3UncmUgc2FmZS5cbiAgICAgIGNvbnRleHQuc2F3RG9uZSA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gRnVuY3Rpb24gYXJndW1lbnRzIGFyZSBjb25zaWRlcmVkIHVzZWRcbiAgICBmb3IgKGNvbnN0IGFyZyBvZiBub2RlLmFyZ3VtZW50cykge1xuICAgICAgdGhpcy5jaGVja1dpdGhDb250ZXh0KGFyZywgdHJ1ZSk7XG4gICAgfVxuXG4gICAgLy8gTm8gbmVlZCB0byBjYWxsIHN1cGVyKCkgc2luY2Ugd2Ugd2Fsa2VkIHRoZSBhcmd1bWVudHMgYWJvdmUuXG4gIH1cblxuICBwcm90ZWN0ZWQgdmlzaXRFeHByZXNzaW9uU3RhdGVtZW50KG5vZGU6IHRzLkV4cHJlc3Npb25TdGF0ZW1lbnQpOiB2b2lkIHtcbiAgICB0aGlzLnB1c2hDb250ZXh0KCk7XG5cbiAgICBzdXBlci52aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQobm9kZSk7XG5cbiAgICB0aGlzLmxlYXZlQ29udGV4dChub2RlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB2aXNpdEJpbmFyeUV4cHJlc3Npb24obm9kZTogdHMuQmluYXJ5RXhwcmVzc2lvbik6IHZvaWQge1xuICAgIGNvbnN0IGluVXNlID0gLz0vLnRlc3Qobm9kZS5vcGVyYXRvclRva2VuLmdldFRleHQoKSk7XG5cbiAgICAvLyBSdWxlczpcbiAgICAvLyAtIExIUzogTmV2ZXIgY29uc2lkZXJlZCB1c2VkXG4gICAgLy8gLSBSSFM6IENvbnNpZGVyZWQgdXNlZCBvbmx5IGlmIHRoaXMgYmluYXJ5IG9wZXJhdGlvbiBpcyBhbiBhc3NpZ25tZW50XG4gICAgdGhpcy5jaGVja1dpdGhDb250ZXh0KG5vZGUubGVmdCwgZmFsc2UpO1xuICAgIHRoaXMuY2hlY2tXaXRoQ29udGV4dChub2RlLnJpZ2h0LCBpblVzZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdmlzaXRTb3VyY2VGaWxlKG5vZGU6IHRzLlNvdXJjZUZpbGUpOiB2b2lkIHtcbiAgICAvLyBDcmVhdGUgYW4gZW1wdHkgY29udGV4dCB0byBhdm9pZCBwb3BwaW5nIGB1bmRlZmluZWQnIHVuZXhwZWN0ZWRseS5cbiAgICB0aGlzLnB1c2hDb250ZXh0KCk7XG5cbiAgICBzdXBlci52aXNpdFNvdXJjZUZpbGUobm9kZSk7XG4gIH1cbn1cbiJdfQ==