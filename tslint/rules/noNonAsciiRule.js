"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ts = require("typescript");
var Lint = require("tslint/lib/lint");
var hex_1 = require("../util/hex");
// TODO: This rule needs a better name.
/**
 * Creates a four-digit Unicode escape from a given hexadecimal char code.
 *
 * This needs updating to support astral plane characters (code point > 0xFFFF).
 */
function makeEscape(code) {
    var hex = hex_1.default(code);
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
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super.apply(this, arguments) || this;
    }
    // TODO: Differentiate between enforcing 8-bitness (no code points above 0x100) and enforcing ASCII-ness
    // (that is, no code points above 0x7f).
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoAsciiWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
Rule.FAILURE_STRING_FACTORY = function (char) { return "Character '" + char + "' should be written as '" + makeEscape(char.charCodeAt(0)) + "'"; };
var NoAsciiWalker = (function (_super) {
    __extends(NoAsciiWalker, _super);
    function NoAsciiWalker() {
        return _super.apply(this, arguments) || this;
    }
    NoAsciiWalker.prototype.visitStringLiteral = function (node) {
        this.checkLiteralNode(node);
        _super.prototype.visitStringLiteral.call(this, node);
    };
    NoAsciiWalker.prototype.visitTemplateExpression = function (node) {
        var _this = this;
        this.checkLiteralNode(node.head);
        ts.forEachChild(node, function (child) {
            if (child.literal) {
                _this.checkLiteralNode(child.literal);
            }
        });
        _super.prototype.visitTemplateExpression.call(this, node);
    };
    NoAsciiWalker.prototype.visitNode = function (node) {
        // tslint doesn't seem have a visitFoo() method for nodes like `foo`,
        // So we have to check here.
        if (node.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
            this.checkLiteralNode(node);
        }
        _super.prototype.visitNode.call(this, node);
    };
    /**
     * Check a string literal for offending Unicode characters.
     */
    NoAsciiWalker.prototype.checkLiteralNode = function (node) {
        var text = node.text;
        var match = text.match(NoAsciiWalker.NON_ASCII_REGEX);
        if (match) {
            var offender = text.charAt(match.index);
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_FACTORY(offender)));
        }
    };
    return NoAsciiWalker;
}(Lint.RuleWalker));
// Note: The character range [0x80 - 0xFF] is considered ASCII even though it's technically Latin-1.
// Oh well.
NoAsciiWalker.NON_ASCII_REGEX = /[\u0100-\uFFFF]/;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9Ob25Bc2NpaVJ1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJub05vbkFzY2lpUnVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwrQkFBaUM7QUFDakMsc0NBQXdDO0FBQ3hDLG1DQUFnQztBQUVoQyx1Q0FBdUM7QUFFdkM7Ozs7R0FJRztBQUNILG9CQUFvQixJQUFZO0lBQzlCLElBQU0sR0FBRyxHQUFHLGFBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUV4QixNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNuQixLQUFLLENBQUM7WUFDSixNQUFNLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztRQUV4QixLQUFLLENBQUM7WUFDSixNQUFNLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztRQUV2QixLQUFLLENBQUM7WUFDSixNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUV0QjtZQUNFLE1BQU0sQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0lBQ3ZCLENBQUM7QUFDSCxDQUFDO0FBRUQ7SUFBMEIsd0JBQXVCO0lBQWpEOztJQVVBLENBQUM7SUFOQyx3R0FBd0c7SUFDeEcsd0NBQXdDO0lBRWpDLG9CQUFLLEdBQVosVUFBYSxVQUF5QjtRQUNwQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNoRixDQUFDO0lBQ0gsV0FBQztBQUFELENBQUMsQUFWRCxDQUEwQixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVk7QUFBakQsb0JBVUM7QUFUZSwyQkFBc0IsR0FDbEMsVUFBQyxJQUFZLElBQUssT0FBQSxnQkFBYyxJQUFJLGdDQUEyQixVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFHLEVBQTlFLENBQThFLENBQUM7QUFVckc7SUFBNEIsaUNBQWU7SUFBM0M7O0lBNkNBLENBQUM7SUF4Q1csMENBQWtCLEdBQTVCLFVBQTZCLElBQXNCO1FBQ2pELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU1QixpQkFBTSxrQkFBa0IsWUFBQyxJQUFJLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRVMsK0NBQXVCLEdBQWpDLFVBQWtDLElBQTJCO1FBQTdELGlCQVVDO1FBVEMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVqQyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxVQUFDLEtBQXNCO1lBQzNDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixLQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZDLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILGlCQUFNLHVCQUF1QixZQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFUyxpQ0FBUyxHQUFuQixVQUFvQixJQUFhO1FBQy9CLHFFQUFxRTtRQUNyRSw0QkFBNEI7UUFDNUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQztZQUM5RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBMEIsQ0FBQyxDQUFDO1FBQ3BELENBQUM7UUFFRCxpQkFBTSxTQUFTLFlBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQUVEOztPQUVHO0lBQ08sd0NBQWdCLEdBQTFCLFVBQTJCLElBQXdCO1FBQ2pELElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdkIsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFeEQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNWLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0csQ0FBQztJQUNILENBQUM7SUFDSCxvQkFBQztBQUFELENBQUMsQUE3Q0QsQ0FBNEIsSUFBSSxDQUFDLFVBQVU7QUFDekMsb0dBQW9HO0FBQ3BHLFdBQVc7QUFDTSw2QkFBZSxHQUFHLGlCQUFpQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQgKiBhcyBMaW50IGZyb20gJ3RzbGludC9saWIvbGludCc7XG5pbXBvcnQgdG9IZXggZnJvbSAnLi4vdXRpbC9oZXgnO1xuXG4vLyBUT0RPOiBUaGlzIHJ1bGUgbmVlZHMgYSBiZXR0ZXIgbmFtZS5cblxuLyoqXG4gKiBDcmVhdGVzIGEgZm91ci1kaWdpdCBVbmljb2RlIGVzY2FwZSBmcm9tIGEgZ2l2ZW4gaGV4YWRlY2ltYWwgY2hhciBjb2RlLlxuICpcbiAqIFRoaXMgbmVlZHMgdXBkYXRpbmcgdG8gc3VwcG9ydCBhc3RyYWwgcGxhbmUgY2hhcmFjdGVycyAoY29kZSBwb2ludCA+IDB4RkZGRikuXG4gKi9cbmZ1bmN0aW9uIG1ha2VFc2NhcGUoY29kZTogbnVtYmVyKTogc3RyaW5nIHtcbiAgY29uc3QgaGV4ID0gdG9IZXgoY29kZSk7XG5cbiAgc3dpdGNoIChoZXgubGVuZ3RoKSB7XG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuICdcXFxcdTAwMCcgKyBoZXg7XG5cbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4gJ1xcXFx1MDAnICsgaGV4O1xuXG4gICAgY2FzZSAzOlxuICAgICAgcmV0dXJuICdcXFxcdTAnICsgaGV4O1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAnXFxcXHUnICsgaGV4O1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSdWxlIGV4dGVuZHMgTGludC5SdWxlcy5BYnN0cmFjdFJ1bGUge1xuICBwdWJsaWMgc3RhdGljIEZBSUxVUkVfU1RSSU5HX0ZBQ1RPUlkgPVxuICAgIChjaGFyOiBzdHJpbmcpID0+IGBDaGFyYWN0ZXIgJyR7Y2hhcn0nIHNob3VsZCBiZSB3cml0dGVuIGFzICcke21ha2VFc2NhcGUoY2hhci5jaGFyQ29kZUF0KDApKX0nYDtcblxuICAvLyBUT0RPOiBEaWZmZXJlbnRpYXRlIGJldHdlZW4gZW5mb3JjaW5nIDgtYml0bmVzcyAobm8gY29kZSBwb2ludHMgYWJvdmUgMHgxMDApIGFuZCBlbmZvcmNpbmcgQVNDSUktbmVzc1xuICAvLyAodGhhdCBpcywgbm8gY29kZSBwb2ludHMgYWJvdmUgMHg3ZikuXG5cbiAgcHVibGljIGFwcGx5KHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiBMaW50LlJ1bGVGYWlsdXJlW10ge1xuICAgIHJldHVybiB0aGlzLmFwcGx5V2l0aFdhbGtlcihuZXcgTm9Bc2NpaVdhbGtlcihzb3VyY2VGaWxlLCB0aGlzLmdldE9wdGlvbnMoKSkpO1xuICB9XG59XG5cbmNsYXNzIE5vQXNjaWlXYWxrZXIgZXh0ZW5kcyBMaW50LlJ1bGVXYWxrZXIge1xuICAvLyBOb3RlOiBUaGUgY2hhcmFjdGVyIHJhbmdlIFsweDgwIC0gMHhGRl0gaXMgY29uc2lkZXJlZCBBU0NJSSBldmVuIHRob3VnaCBpdCdzIHRlY2huaWNhbGx5IExhdGluLTEuXG4gIC8vIE9oIHdlbGwuXG4gIHByb3RlY3RlZCBzdGF0aWMgTk9OX0FTQ0lJX1JFR0VYID0gL1tcXHUwMTAwLVxcdUZGRkZdLztcblxuICBwcm90ZWN0ZWQgdmlzaXRTdHJpbmdMaXRlcmFsKG5vZGU6IHRzLlN0cmluZ0xpdGVyYWwpOiB2b2lkIHtcbiAgICB0aGlzLmNoZWNrTGl0ZXJhbE5vZGUobm9kZSk7XG5cbiAgICBzdXBlci52aXNpdFN0cmluZ0xpdGVyYWwobm9kZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdmlzaXRUZW1wbGF0ZUV4cHJlc3Npb24obm9kZTogdHMuVGVtcGxhdGVFeHByZXNzaW9uKTogdm9pZCB7XG4gICAgdGhpcy5jaGVja0xpdGVyYWxOb2RlKG5vZGUuaGVhZCk7XG5cbiAgICB0cy5mb3JFYWNoQ2hpbGQobm9kZSwgKGNoaWxkOiB0cy5UZW1wbGF0ZVNwYW4pID0+IHtcbiAgICAgIGlmIChjaGlsZC5saXRlcmFsKSB7XG4gICAgICAgIHRoaXMuY2hlY2tMaXRlcmFsTm9kZShjaGlsZC5saXRlcmFsKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHN1cGVyLnZpc2l0VGVtcGxhdGVFeHByZXNzaW9uKG5vZGUpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHZpc2l0Tm9kZShub2RlOiB0cy5Ob2RlKTogdm9pZCB7XG4gICAgLy8gdHNsaW50IGRvZXNuJ3Qgc2VlbSBoYXZlIGEgdmlzaXRGb28oKSBtZXRob2QgZm9yIG5vZGVzIGxpa2UgYGZvb2AsXG4gICAgLy8gU28gd2UgaGF2ZSB0byBjaGVjayBoZXJlLlxuICAgIGlmIChub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuTm9TdWJzdGl0dXRpb25UZW1wbGF0ZUxpdGVyYWwpIHtcbiAgICAgIHRoaXMuY2hlY2tMaXRlcmFsTm9kZShub2RlIGFzIHRzLkxpdGVyYWxMaWtlTm9kZSk7XG4gICAgfVxuXG4gICAgc3VwZXIudmlzaXROb2RlKG5vZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGEgc3RyaW5nIGxpdGVyYWwgZm9yIG9mZmVuZGluZyBVbmljb2RlIGNoYXJhY3RlcnMuXG4gICAqL1xuICBwcm90ZWN0ZWQgY2hlY2tMaXRlcmFsTm9kZShub2RlOiB0cy5MaXRlcmFsTGlrZU5vZGUpOiB2b2lkIHtcbiAgICBjb25zdCB0ZXh0ID0gbm9kZS50ZXh0O1xuICAgIGNvbnN0IG1hdGNoID0gdGV4dC5tYXRjaChOb0FzY2lpV2Fsa2VyLk5PTl9BU0NJSV9SRUdFWCk7XG5cbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIGNvbnN0IG9mZmVuZGVyID0gdGV4dC5jaGFyQXQobWF0Y2guaW5kZXgpO1xuICAgICAgdGhpcy5hZGRGYWlsdXJlKHRoaXMuY3JlYXRlRmFpbHVyZShub2RlLmdldFN0YXJ0KCksIG5vZGUuZ2V0V2lkdGgoKSwgUnVsZS5GQUlMVVJFX1NUUklOR19GQUNUT1JZKG9mZmVuZGVyKSkpO1xuICAgIH1cbiAgfVxufVxuIl19