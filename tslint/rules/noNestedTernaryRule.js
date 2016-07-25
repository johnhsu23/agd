"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lint = require('tslint/lib/lint');
var contextAwareWalker_1 = require('../contextAwareWalker');
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoNestedTernaryWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = 'Do not nest ternary operators.';
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var NoNestedTernaryWalker = (function (_super) {
    __extends(NoNestedTernaryWalker, _super);
    function NoNestedTernaryWalker() {
        _super.apply(this, arguments);
    }
    NoNestedTernaryWalker.prototype.defaultContext = function () {
        return false;
    };
    NoNestedTernaryWalker.prototype.markInsideTernary = function () {
        this.replaceContext(true);
    };
    NoNestedTernaryWalker.prototype.insideTernary = function () {
        return this.context();
    };
    NoNestedTernaryWalker.prototype.markOutsideTernary = function () {
        this.replaceContext(false);
    };
    NoNestedTernaryWalker.prototype.visitConditionalExpression = function (node) {
        if (this.insideTernary()) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
            _super.prototype.visitConditionalExpression.call(this, node);
        }
        else {
            this.markInsideTernary();
            _super.prototype.visitConditionalExpression.call(this, node);
            this.markOutsideTernary();
        }
    };
    NoNestedTernaryWalker.prototype.visitBlock = function (node) {
        this.pushContext();
        _super.prototype.visitBlock.call(this, node);
        this.popContext();
    };
    return NoNestedTernaryWalker;
}(contextAwareWalker_1.default));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9OZXN0ZWRUZXJuYXJ5UnVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5vTmVzdGVkVGVybmFyeVJ1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBWSxJQUFJLFdBQU0saUJBQWlCLENBQUMsQ0FBQTtBQUV4QyxtQ0FBK0IsdUJBQXVCLENBQUMsQ0FBQTtBQUV2RDtJQUEwQix3QkFBdUI7SUFBakQ7UUFBMEIsOEJBQXVCO0lBTWpELENBQUM7SUFIUSxvQkFBSyxHQUFaLFVBQWEsVUFBeUI7UUFDcEMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxxQkFBcUIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN4RixDQUFDO0lBSmEsbUJBQWMsR0FBRyxnQ0FBZ0MsQ0FBQztJQUtsRSxXQUFDO0FBQUQsQ0FBQyxBQU5ELENBQTBCLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxHQU1oRDtBQU5ZLFlBQUksT0FNaEIsQ0FBQTtBQUVEO0lBQW9DLHlDQUEyQjtJQUEvRDtRQUFvQyw4QkFBMkI7SUE2Qy9ELENBQUM7SUE1Q1csOENBQWMsR0FBeEI7UUFDRSxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVTLGlEQUFpQixHQUEzQjtRQUNFLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVTLDZDQUFhLEdBQXZCO1FBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRVMsa0RBQWtCLEdBQTVCO1FBQ0UsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRU0sMERBQTBCLEdBQWpDLFVBQWtDLElBQThCO1FBQzlELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDekIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFFM0YsZ0JBQUssQ0FBQywwQkFBMEIsWUFBQyxJQUFJLENBQUMsQ0FBQztRQUN6QyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUN6QixnQkFBSyxDQUFDLDBCQUEwQixZQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzVCLENBQUM7SUFDSCxDQUFDO0lBV00sMENBQVUsR0FBakIsVUFBa0IsSUFBYztRQUM5QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFFbkIsZ0JBQUssQ0FBQyxVQUFVLFlBQUMsSUFBSSxDQUFDLENBQUM7UUFFdkIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFDSCw0QkFBQztBQUFELENBQUMsQUE3Q0QsQ0FBb0MsNEJBQWtCLEdBNkNyRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIExpbnQgZnJvbSAndHNsaW50L2xpYi9saW50JztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuaW1wb3J0IENvbnRleHRBd2FyZVdhbGtlciBmcm9tICcuLi9jb250ZXh0QXdhcmVXYWxrZXInO1xuXG5leHBvcnQgY2xhc3MgUnVsZSBleHRlbmRzIExpbnQuUnVsZXMuQWJzdHJhY3RSdWxlIHtcbiAgcHVibGljIHN0YXRpYyBGQUlMVVJFX1NUUklORyA9ICdEbyBub3QgbmVzdCB0ZXJuYXJ5IG9wZXJhdG9ycy4nO1xuXG4gIHB1YmxpYyBhcHBseShzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlKTogTGludC5SdWxlRmFpbHVyZVtdIHtcbiAgICByZXR1cm4gdGhpcy5hcHBseVdpdGhXYWxrZXIobmV3IE5vTmVzdGVkVGVybmFyeVdhbGtlcihzb3VyY2VGaWxlLCB0aGlzLmdldE9wdGlvbnMoKSkpO1xuICB9XG59XG5cbmNsYXNzIE5vTmVzdGVkVGVybmFyeVdhbGtlciBleHRlbmRzIENvbnRleHRBd2FyZVdhbGtlcjxib29sZWFuPiB7XG4gIHByb3RlY3RlZCBkZWZhdWx0Q29udGV4dCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcm90ZWN0ZWQgbWFya0luc2lkZVRlcm5hcnkoKSB7XG4gICAgdGhpcy5yZXBsYWNlQ29udGV4dCh0cnVlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBpbnNpZGVUZXJuYXJ5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBtYXJrT3V0c2lkZVRlcm5hcnkoKSB7XG4gICAgdGhpcy5yZXBsYWNlQ29udGV4dChmYWxzZSk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRDb25kaXRpb25hbEV4cHJlc3Npb24obm9kZTogdHMuQ29uZGl0aW9uYWxFeHByZXNzaW9uKSB7XG4gICAgaWYgKHRoaXMuaW5zaWRlVGVybmFyeSgpKSB7XG4gICAgICB0aGlzLmFkZEZhaWx1cmUodGhpcy5jcmVhdGVGYWlsdXJlKG5vZGUuZ2V0U3RhcnQoKSwgbm9kZS5nZXRXaWR0aCgpLCBSdWxlLkZBSUxVUkVfU1RSSU5HKSk7XG5cbiAgICAgIHN1cGVyLnZpc2l0Q29uZGl0aW9uYWxFeHByZXNzaW9uKG5vZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1hcmtJbnNpZGVUZXJuYXJ5KCk7XG4gICAgICBzdXBlci52aXNpdENvbmRpdGlvbmFsRXhwcmVzc2lvbihub2RlKTtcbiAgICAgIHRoaXMubWFya091dHNpZGVUZXJuYXJ5KCk7XG4gICAgfVxuICB9XG5cbiAgLypcbiAgICogV2UgY29uc2lkZXIgbmV3IGJsb2NrcyB0byBiZSBub24tbmVzdGVkLlxuICAgKiBUaGlzIGNhdXNlcyBhIHNpdHVhdGlvbiBsaWtlIHRoZSBmb2xsb3dpbmcgdG8gYmUgY29uc2lkZXJlZCB2YWxpZDpcbiAgICogICBmb28gPyBiYXIgOiBmdW5jdGlvbiAoKSB7IGZvbyA/IGJhciA6IGJheiB9O1xuICAgKlxuICAgKiBIb3dldmVyLCB0aGUgcnVsZSBpbiBwbGF5IGhlcmUgbWFuZGF0ZXMgdGhhdCB0ZXJuYXJ5IF9leHByZXNzaW9uc18gY2Fubm90IGJlIG5lc3RlZCwgYW5kIGNyZWF0aW5nXG4gICAqIGEgbmV3IGJsb2NrIGluc2lkZSBhIHRlcm5hcnksIHdoaWxlIG1vc3QgY2VydGFpbmx5IGEgdmlvbGF0aW9uIG9mIGNvbW1vbiBzZW5zZSwgaXNuJ3QgYSB2aW9sYXRpb25cbiAgICogb2YgdGhpcyBydWxlIHBlciBzZS5cbiAgICovXG4gIHB1YmxpYyB2aXNpdEJsb2NrKG5vZGU6IHRzLkJsb2NrKSB7XG4gICAgdGhpcy5wdXNoQ29udGV4dCgpO1xuXG4gICAgc3VwZXIudmlzaXRCbG9jayhub2RlKTtcblxuICAgIHRoaXMucG9wQ29udGV4dCgpO1xuICB9XG59XG4iXX0=