"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lint = require('tslint/lib/lint');
var syntax = require('../util/syntax');
var contextAwareWalker_1 = require('../contextAwareWalker');
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new PromiseChainWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = 'A promise chain should either use its result or call .done().';
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var PromiseChainWalker = (function (_super) {
    __extends(PromiseChainWalker, _super);
    function PromiseChainWalker() {
        _super.apply(this, arguments);
    }
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
    PromiseChainWalker.prototype.enterContext = function (expressionUsed) {
        this.pushContext({
            expressionUsed: expressionUsed,
            sawDone: false,
            check: false,
        });
    };
    PromiseChainWalker.prototype.leaveContext = function (node) {
        var context = this.popContext();
        if (this.shouldReportError(context)) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
    };
    PromiseChainWalker.prototype.checkWithContext = function (node, expressionUsed) {
        this.enterContext(expressionUsed);
        this.visitNode(node);
        this.leaveContext(node);
    };
    PromiseChainWalker.prototype.visitCallExpression = function (node) {
        var context = this.context();
        if (syntax.isCallToThen(node)) {
            context.check = true;
        }
        else if (syntax.isCallToDone(node)) {
            context.sawDone = true;
        }
        for (var _i = 0, _a = node.arguments; _i < _a.length; _i++) {
            var arg = _a[_i];
            this.checkWithContext(arg, true);
        }
    };
    PromiseChainWalker.prototype.visitExpressionStatement = function (node) {
        this.pushContext();
        _super.prototype.visitExpressionStatement.call(this, node);
        this.leaveContext(node);
    };
    PromiseChainWalker.prototype.visitBinaryExpression = function (node) {
        var inUse = /=/.test(node.operatorToken.getText());
        this.checkWithContext(node.left, false);
        this.checkWithContext(node.right, inUse);
    };
    PromiseChainWalker.prototype.visitSourceFile = function (node) {
        this.pushContext();
        _super.prototype.visitSourceFile.call(this, node);
    };
    return PromiseChainWalker;
}(contextAwareWalker_1.default));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvbWlzZUNoYWluU2hvdWxkQ29tcGxldGVSdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicHJvbWlzZUNoYWluU2hvdWxkQ29tcGxldGVSdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLElBQVksSUFBSSxXQUFNLGlCQUFpQixDQUFDLENBQUE7QUFFeEMsSUFBWSxNQUFNLFdBQU0sZ0JBQWdCLENBQUMsQ0FBQTtBQUN6QyxtQ0FBK0IsdUJBQXVCLENBQUMsQ0FBQTtBQUV2RDtJQUEwQix3QkFBdUI7SUFBakQ7UUFBMEIsOEJBQXVCO0lBTWpELENBQUM7SUFIUSxvQkFBSyxHQUFaLFVBQWEsVUFBeUI7UUFDcEMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNyRixDQUFDO0lBSmEsbUJBQWMsR0FBRywrREFBK0QsQ0FBQztJQUtqRyxXQUFDO0FBQUQsQ0FBQyxBQU5ELENBQTBCLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxHQU1oRDtBQU5ZLFlBQUksT0FNaEIsQ0FBQTtBQWlCRDtJQUFpQyxzQ0FBMkI7SUFBNUQ7UUFBaUMsOEJBQTJCO0lBcUc1RCxDQUFDO0lBN0ZXLDhDQUFpQixHQUEzQixVQUE0QixPQUFnQjtRQUMxQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNsQixNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RELENBQUM7UUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVTLDJDQUFjLEdBQXhCO1FBQ0UsTUFBTSxDQUFDO1lBQ0wsY0FBYyxFQUFFLEtBQUs7WUFDckIsT0FBTyxFQUFFLEtBQUs7WUFDZCxLQUFLLEVBQUUsS0FBSztTQUNiLENBQUM7SUFDSixDQUFDO0lBS1MseUNBQVksR0FBdEIsVUFBdUIsY0FBdUI7UUFDNUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUNmLGdCQUFBLGNBQWM7WUFDZCxPQUFPLEVBQUUsS0FBSztZQUNkLEtBQUssRUFBRSxLQUFLO1NBQ2IsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQVFTLHlDQUFZLEdBQXRCLFVBQXVCLElBQWE7UUFDbEMsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBRWxDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDN0YsQ0FBQztJQUNILENBQUM7SUFLUyw2Q0FBZ0IsR0FBMUIsVUFBMkIsSUFBYSxFQUFFLGNBQXVCO1FBQy9ELElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFUyxnREFBbUIsR0FBN0IsVUFBOEIsSUFBdUI7UUFDbkQsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRS9CLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTlCLE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFckMsT0FBTyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDekIsQ0FBQztRQUdELEdBQUcsQ0FBQyxDQUFjLFVBQWMsRUFBZCxLQUFBLElBQUksQ0FBQyxTQUFTLEVBQWQsY0FBYyxFQUFkLElBQWMsQ0FBQztZQUE1QixJQUFNLEdBQUcsU0FBQTtZQUNaLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDbEM7SUFHSCxDQUFDO0lBRVMscURBQXdCLEdBQWxDLFVBQW1DLElBQTRCO1FBQzdELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUVuQixnQkFBSyxDQUFDLHdCQUF3QixZQUFDLElBQUksQ0FBQyxDQUFDO1FBRXJDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVTLGtEQUFxQixHQUEvQixVQUFnQyxJQUF5QjtRQUN2RCxJQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUtyRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRVMsNENBQWUsR0FBekIsVUFBMEIsSUFBbUI7UUFFM0MsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRW5CLGdCQUFLLENBQUMsZUFBZSxZQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFDSCx5QkFBQztBQUFELENBQUMsQUFyR0QsQ0FBaUMsNEJBQWtCLEdBcUdsRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuaW1wb3J0ICogYXMgTGludCBmcm9tICd0c2xpbnQvbGliL2xpbnQnO1xuXG5pbXBvcnQgKiBhcyBzeW50YXggZnJvbSAnLi4vdXRpbC9zeW50YXgnO1xuaW1wb3J0IENvbnRleHRBd2FyZVdhbGtlciBmcm9tICcuLi9jb250ZXh0QXdhcmVXYWxrZXInO1xuXG5leHBvcnQgY2xhc3MgUnVsZSBleHRlbmRzIExpbnQuUnVsZXMuQWJzdHJhY3RSdWxlIHtcbiAgcHVibGljIHN0YXRpYyBGQUlMVVJFX1NUUklORyA9ICdBIHByb21pc2UgY2hhaW4gc2hvdWxkIGVpdGhlciB1c2UgaXRzIHJlc3VsdCBvciBjYWxsIC5kb25lKCkuJztcblxuICBwdWJsaWMgYXBwbHkoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSk6IExpbnQuUnVsZUZhaWx1cmVbXSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwbHlXaXRoV2Fsa2VyKG5ldyBQcm9taXNlQ2hhaW5XYWxrZXIoc291cmNlRmlsZSwgdGhpcy5nZXRPcHRpb25zKCkpKTtcbiAgfVxufVxuXG5pbnRlcmZhY2UgQ29udGV4dCB7XG4gIC8qKlxuICAgKiBJcyB0aGlzIGV4cHJlc3Npb24gY29uc2lkZXJlZCAndXNlZCcgKGEgYmV0dGVyIHRlcm0gd291bGQgYmUgJ2NvbnN1bWVkJyk/XG4gICAqL1xuICBleHByZXNzaW9uVXNlZDogYm9vbGVhbjtcbiAgLyoqXG4gICAqIERpZCB3ZSBzZWUgYSBjYWxsIHRvIC5kb25lKCkgaW4gdGhpcyBwcm9taXNlIGNoYWluP1xuICAgKi9cbiAgc2F3RG9uZTogYm9vbGVhbjtcbiAgLyoqXG4gICAqIElmIHdlIHNhdyBhIGNhbGwgdG8gLnRoZW4oKSwgdGhpcyBydWxlIGlzIGNvbnNpZGVyZWQgYWN0aXZlIHdpdGhpbiB0aGUgY3VycmVudCBjb250ZXh0LlxuICAgKi9cbiAgY2hlY2s6IGJvb2xlYW47XG59XG5cbmNsYXNzIFByb21pc2VDaGFpbldhbGtlciBleHRlbmRzIENvbnRleHRBd2FyZVdhbGtlcjxDb250ZXh0PiB7XG4gIC8qKlxuICAgKiBTaG91bGQgd2UgcmVwb3J0IGFuIGVycm9yIGdpdmVuIHRoZSBwYXNzZWQtaW4gc3RhdGU/XG4gICAqXG4gICAqIERlZmluaXRpb246IFdlIHNob3VsZCByZXBvcnQgYW4gZXJyb3IgaWY6XG4gICAqIDEuIFRoZSBjb250ZXh0J3MgYGNoZWNrJyBmbGFnIGlzIHRydWUgKGkuZS4sIG91ciBoZXVyaXN0aWMgdHJpcHBlZCkuLCBhbmRcbiAgICogMi4gVGhlIHByb21pc2UgY2hhaW4gd2FzIG5laXRoZXIgY29uc3VtZWQsIG5vciB3YXMgLmRvbmUoKSBjYWxsZWQuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2hvdWxkUmVwb3J0RXJyb3IoY29udGV4dDogQ29udGV4dCk6IGJvb2xlYW4ge1xuICAgIGlmIChjb250ZXh0LmNoZWNrKSB7XG4gICAgICByZXR1cm4gIShjb250ZXh0LmV4cHJlc3Npb25Vc2VkIHx8IGNvbnRleHQuc2F3RG9uZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJvdGVjdGVkIGRlZmF1bHRDb250ZXh0KCk6IENvbnRleHQge1xuICAgIHJldHVybiB7XG4gICAgICBleHByZXNzaW9uVXNlZDogZmFsc2UsXG4gICAgICBzYXdEb25lOiBmYWxzZSxcbiAgICAgIGNoZWNrOiBmYWxzZSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEhlbHBzIGNvbnN0cnVjdCBhIGNvbnRleHQgaW4gd2hpY2ggdGhlIGV4cHJlc3Npb24gdG8gYmUgZXhhbWluZWQgaXMgYWxyZWFkeSBmbGFnZ2VkIGFzIHVzZWQuXG4gICAqL1xuICBwcm90ZWN0ZWQgZW50ZXJDb250ZXh0KGV4cHJlc3Npb25Vc2VkOiBib29sZWFuKSB7XG4gICAgdGhpcy5wdXNoQ29udGV4dCh7XG4gICAgICBleHByZXNzaW9uVXNlZCxcbiAgICAgIHNhd0RvbmU6IGZhbHNlLFxuICAgICAgY2hlY2s6IGZhbHNlLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEhlbHBlciBtZXRob2Q6IHBvcHMgYSBjb250ZXh0IG9mZiB0aGUgc3RhY2sgYW5kIGNoZWNrcyBmb3IgZXJyb3IgcmVwb3J0aW5nLlxuICAgKlxuICAgKiBLbm93biBkZWZpY2llbmNlczogYWJ5c21hbGx5IGltcHJlY2lzZSBlcnJvciByZXBvcnRpbmcgaW4gdGhlIGNhc2Ugb2YgYW4gRXhwcmVzc2lvblN0YXRlbWVudCBub2RlLCBzaW5jZSBpdCBmbGFnc1xuICAgKiB0aGUgZW50aXJlIHN0YXRlbWVudC5cbiAgICovXG4gIHByb3RlY3RlZCBsZWF2ZUNvbnRleHQobm9kZTogdHMuTm9kZSk6IHZvaWQge1xuICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLnBvcENvbnRleHQoKTtcblxuICAgIGlmICh0aGlzLnNob3VsZFJlcG9ydEVycm9yKGNvbnRleHQpKSB7XG4gICAgICB0aGlzLmFkZEZhaWx1cmUodGhpcy5jcmVhdGVGYWlsdXJlKG5vZGUuZ2V0U3RhcnQoKSwgbm9kZS5nZXRXaWR0aCgpLCBSdWxlLkZBSUxVUkVfU1RSSU5HKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhlbHBlciBtZXRob2Q6IHNhdmVzIGFuZCByZXN0b3JlcyB0aGUgY3VycmVudCBjb250ZXh0IGJlZm9yZSB2aXNpdGluZyBhIGdpdmVuIG5vZGUuXG4gICAqL1xuICBwcm90ZWN0ZWQgY2hlY2tXaXRoQ29udGV4dChub2RlOiB0cy5Ob2RlLCBleHByZXNzaW9uVXNlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuZW50ZXJDb250ZXh0KGV4cHJlc3Npb25Vc2VkKTtcbiAgICB0aGlzLnZpc2l0Tm9kZShub2RlKTtcbiAgICB0aGlzLmxlYXZlQ29udGV4dChub2RlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB2aXNpdENhbGxFeHByZXNzaW9uKG5vZGU6IHRzLkNhbGxFeHByZXNzaW9uKTogdm9pZCB7XG4gICAgY29uc3QgY29udGV4dCA9IHRoaXMuY29udGV4dCgpO1xuXG4gICAgaWYgKHN5bnRheC5pc0NhbGxUb1RoZW4obm9kZSkpIHtcbiAgICAgIC8vICguLi4pLnRoZW4oLi4uKSA9PiB0aGlzIHJ1bGUgaXMgbm93IGFjdGl2ZVxuICAgICAgY29udGV4dC5jaGVjayA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChzeW50YXguaXNDYWxsVG9Eb25lKG5vZGUpKSB7XG4gICAgICAvLyAoLi4uKS5kb25lKCkgPT4gY29vbCwgeW91J3JlIHNhZmUuXG4gICAgICBjb250ZXh0LnNhd0RvbmUgPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIEZ1bmN0aW9uIGFyZ3VtZW50cyBhcmUgY29uc2lkZXJlZCB1c2VkXG4gICAgZm9yIChjb25zdCBhcmcgb2Ygbm9kZS5hcmd1bWVudHMpIHtcbiAgICAgIHRoaXMuY2hlY2tXaXRoQ29udGV4dChhcmcsIHRydWUpO1xuICAgIH1cblxuICAgIC8vIE5vIG5lZWQgdG8gY2FsbCBzdXBlcigpIHNpbmNlIHdlIHdhbGtlZCB0aGUgYXJndW1lbnRzIGFib3ZlLlxuICB9XG5cbiAgcHJvdGVjdGVkIHZpc2l0RXhwcmVzc2lvblN0YXRlbWVudChub2RlOiB0cy5FeHByZXNzaW9uU3RhdGVtZW50KTogdm9pZCB7XG4gICAgdGhpcy5wdXNoQ29udGV4dCgpO1xuXG4gICAgc3VwZXIudmlzaXRFeHByZXNzaW9uU3RhdGVtZW50KG5vZGUpO1xuXG4gICAgdGhpcy5sZWF2ZUNvbnRleHQobm9kZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdmlzaXRCaW5hcnlFeHByZXNzaW9uKG5vZGU6IHRzLkJpbmFyeUV4cHJlc3Npb24pOiB2b2lkIHtcbiAgICBjb25zdCBpblVzZSA9IC89Ly50ZXN0KG5vZGUub3BlcmF0b3JUb2tlbi5nZXRUZXh0KCkpO1xuXG4gICAgLy8gUnVsZXM6XG4gICAgLy8gLSBMSFM6IE5ldmVyIGNvbnNpZGVyZWQgdXNlZFxuICAgIC8vIC0gUkhTOiBDb25zaWRlcmVkIHVzZWQgb25seSBpZiB0aGlzIGJpbmFyeSBvcGVyYXRpb24gaXMgYW4gYXNzaWdubWVudFxuICAgIHRoaXMuY2hlY2tXaXRoQ29udGV4dChub2RlLmxlZnQsIGZhbHNlKTtcbiAgICB0aGlzLmNoZWNrV2l0aENvbnRleHQobm9kZS5yaWdodCwgaW5Vc2UpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHZpc2l0U291cmNlRmlsZShub2RlOiB0cy5Tb3VyY2VGaWxlKTogdm9pZCB7XG4gICAgLy8gQ3JlYXRlIGFuIGVtcHR5IGNvbnRleHQgdG8gYXZvaWQgcG9wcGluZyBgdW5kZWZpbmVkJyB1bmV4cGVjdGVkbHkuXG4gICAgdGhpcy5wdXNoQ29udGV4dCgpO1xuXG4gICAgc3VwZXIudmlzaXRTb3VyY2VGaWxlKG5vZGUpO1xuICB9XG59XG4iXX0=