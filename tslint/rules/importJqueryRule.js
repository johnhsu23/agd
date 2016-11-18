"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lint = require("tslint/lib/lint");
var ts = require("typescript");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new ImportJqueryWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
Rule.FAILURE_STRING = 'Do not use global jQuery.';
var ImportJqueryWalker = (function (_super) {
    __extends(ImportJqueryWalker, _super);
    function ImportJqueryWalker() {
        var _this = _super.apply(this, arguments) || this;
        /**
         * Indicates the source file imported jQuery as $.
         */
        _this.sawDollarSign = false;
        /**
         * Indicates the source file imported jQuery.
         */
        _this.sawJquery = false;
        return _this;
    }
    ImportJqueryWalker.prototype.visitImportDeclaration = function (node) {
        // Ensure this is an import of the module named 'jquery'.
        var specifier = node.moduleSpecifier;
        if (specifier.kind !== ts.SyntaxKind.StringLiteral || specifier.text !== 'jquery') {
            return;
        }
        // Ensure there is an import clause, and that it has named bindings (i.e., isn't a default import)
        var clause = node.importClause;
        if (!(clause && clause.namedBindings)) {
            return;
        }
        // Ensure this is a namespace (import * as foo) import.
        var bindings = clause.namedBindings;
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
    };
    ImportJqueryWalker.prototype.visitIdentifier = function (node) {
        var ident = node.getText(), isFailure = (ident === '$' && !this.sawDollarSign)
            || (ident === 'jQuery' && !this.sawJquery);
        if (isFailure) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
    };
    return ImportJqueryWalker;
}(Lint.RuleWalker));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0SnF1ZXJ5UnVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImltcG9ydEpxdWVyeVJ1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsc0NBQXdDO0FBQ3hDLCtCQUFpQztBQUVqQztJQUEwQix3QkFBdUI7SUFBakQ7O0lBTUEsQ0FBQztJQUhRLG9CQUFLLEdBQVosVUFBYSxVQUF5QjtRQUNwQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLGtCQUFrQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3JGLENBQUM7SUFDSCxXQUFDO0FBQUQsQ0FBQyxBQU5ELENBQTBCLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWTtBQUFqRCxvQkFNQztBQUxlLG1CQUFjLEdBQUcsMkJBQTJCLENBQUM7QUFPN0Q7SUFBaUMsc0NBQWU7SUFBaEQ7UUFBQSxrREFrREM7UUFqREM7O1dBRUc7UUFDTyxtQkFBYSxHQUFHLEtBQUssQ0FBQztRQUVoQzs7V0FFRztRQUNPLGVBQVMsR0FBRyxLQUFLLENBQUM7O0lBeUM5QixDQUFDO0lBdkNXLG1EQUFzQixHQUFoQyxVQUFpQyxJQUEwQjtRQUN6RCx5REFBeUQ7UUFDekQsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztRQUN2QyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsYUFBYSxJQUFLLFNBQThCLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDeEcsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUVELGtHQUFrRztRQUNsRyxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQ2pDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QyxNQUFNLENBQUM7UUFDVCxDQUFDO1FBRUQsdURBQXVEO1FBQ3ZELElBQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUM7UUFDdEMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDcEQsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUVELE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLEtBQUssR0FBRztnQkFDTixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztnQkFDMUIsS0FBSyxDQUFDO1lBRVIsS0FBSyxRQUFRO2dCQUNYLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO2dCQUN0QixLQUFLLENBQUM7UUFDVixDQUFDO0lBQ0gsQ0FBQztJQUVTLDRDQUFlLEdBQXpCLFVBQTBCLElBQW1CO1FBQzNDLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFDdEIsU0FBUyxHQUFHLENBQUMsS0FBSyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7ZUFDdEMsQ0FBQyxLQUFLLEtBQUssUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTFELEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDZCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUM3RixDQUFDO0lBQ0gsQ0FBQztJQUNILHlCQUFDO0FBQUQsQ0FBQyxBQWxERCxDQUFpQyxJQUFJLENBQUMsVUFBVSxHQWtEL0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBMaW50IGZyb20gJ3RzbGludC9saWIvbGludCc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuZXhwb3J0IGNsYXNzIFJ1bGUgZXh0ZW5kcyBMaW50LlJ1bGVzLkFic3RyYWN0UnVsZSB7XG4gIHB1YmxpYyBzdGF0aWMgRkFJTFVSRV9TVFJJTkcgPSAnRG8gbm90IHVzZSBnbG9iYWwgalF1ZXJ5Lic7XG5cbiAgcHVibGljIGFwcGx5KHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiBMaW50LlJ1bGVGYWlsdXJlW10ge1xuICAgIHJldHVybiB0aGlzLmFwcGx5V2l0aFdhbGtlcihuZXcgSW1wb3J0SnF1ZXJ5V2Fsa2VyKHNvdXJjZUZpbGUsIHRoaXMuZ2V0T3B0aW9ucygpKSk7XG4gIH1cbn1cblxuY2xhc3MgSW1wb3J0SnF1ZXJ5V2Fsa2VyIGV4dGVuZHMgTGludC5SdWxlV2Fsa2VyIHtcbiAgLyoqXG4gICAqIEluZGljYXRlcyB0aGUgc291cmNlIGZpbGUgaW1wb3J0ZWQgalF1ZXJ5IGFzICQuXG4gICAqL1xuICBwcm90ZWN0ZWQgc2F3RG9sbGFyU2lnbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgdGhlIHNvdXJjZSBmaWxlIGltcG9ydGVkIGpRdWVyeS5cbiAgICovXG4gIHByb3RlY3RlZCBzYXdKcXVlcnkgPSBmYWxzZTtcblxuICBwcm90ZWN0ZWQgdmlzaXRJbXBvcnREZWNsYXJhdGlvbihub2RlOiB0cy5JbXBvcnREZWNsYXJhdGlvbik6IHZvaWQge1xuICAgIC8vIEVuc3VyZSB0aGlzIGlzIGFuIGltcG9ydCBvZiB0aGUgbW9kdWxlIG5hbWVkICdqcXVlcnknLlxuICAgIGNvbnN0IHNwZWNpZmllciA9IG5vZGUubW9kdWxlU3BlY2lmaWVyO1xuICAgIGlmIChzcGVjaWZpZXIua2luZCAhPT0gdHMuU3ludGF4S2luZC5TdHJpbmdMaXRlcmFsIHx8IChzcGVjaWZpZXIgYXMgdHMuU3RyaW5nTGl0ZXJhbCkudGV4dCAhPT0gJ2pxdWVyeScpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBFbnN1cmUgdGhlcmUgaXMgYW4gaW1wb3J0IGNsYXVzZSwgYW5kIHRoYXQgaXQgaGFzIG5hbWVkIGJpbmRpbmdzIChpLmUuLCBpc24ndCBhIGRlZmF1bHQgaW1wb3J0KVxuICAgIGNvbnN0IGNsYXVzZSA9IG5vZGUuaW1wb3J0Q2xhdXNlO1xuICAgIGlmICghKGNsYXVzZSAmJiBjbGF1c2UubmFtZWRCaW5kaW5ncykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBFbnN1cmUgdGhpcyBpcyBhIG5hbWVzcGFjZSAoaW1wb3J0ICogYXMgZm9vKSBpbXBvcnQuXG4gICAgY29uc3QgYmluZGluZ3MgPSBjbGF1c2UubmFtZWRCaW5kaW5ncztcbiAgICBpZiAoYmluZGluZ3Mua2luZCAhPT0gdHMuU3ludGF4S2luZC5OYW1lc3BhY2VJbXBvcnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGJpbmRpbmdzLm5hbWUuZ2V0VGV4dCgpKSB7XG4gICAgICBjYXNlICckJzpcbiAgICAgICAgdGhpcy5zYXdEb2xsYXJTaWduID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2pRdWVyeSc6XG4gICAgICAgIHRoaXMuc2F3SnF1ZXJ5ID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHZpc2l0SWRlbnRpZmllcihub2RlOiB0cy5JZGVudGlmaWVyKTogdm9pZCB7XG4gICAgY29uc3QgaWRlbnQgPSBub2RlLmdldFRleHQoKSxcbiAgICAgICAgICBpc0ZhaWx1cmUgPSAoaWRlbnQgPT09ICckJyAmJiAhdGhpcy5zYXdEb2xsYXJTaWduKVxuICAgICAgICAgICAgICAgICAgIHx8IChpZGVudCA9PT0gJ2pRdWVyeScgJiYgIXRoaXMuc2F3SnF1ZXJ5KTtcblxuICAgIGlmIChpc0ZhaWx1cmUpIHtcbiAgICAgIHRoaXMuYWRkRmFpbHVyZSh0aGlzLmNyZWF0ZUZhaWx1cmUobm9kZS5nZXRTdGFydCgpLCBub2RlLmdldFdpZHRoKCksIFJ1bGUuRkFJTFVSRV9TVFJJTkcpKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==