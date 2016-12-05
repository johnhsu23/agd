"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lint = require("tslint/lib/lint");
var contextAwareWalker_1 = require("../contextAwareWalker");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super.apply(this, arguments) || this;
    }
    Rule.makeErrorString = function (type, name) {
        return type + " '" + name + "' does not declare a return type.";
    };
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new ReturnTypeDeclWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var ReturnTypeDeclWalker = (function (_super) {
    __extends(ReturnTypeDeclWalker, _super);
    function ReturnTypeDeclWalker() {
        return _super.apply(this, arguments) || this;
    }
    ReturnTypeDeclWalker.prototype.defaultContext = function () {
        return false;
    };
    ReturnTypeDeclWalker.prototype.createDeclarationFailure = function (type, node) {
        var name = node.name, parameters = node.parameters;
        var start = name.getStart(), end = parameters.end, 
        // Add 1 to account for the trailing ')'
        width = (end - start) + 1;
        var message = Rule.makeErrorString(type, name.getText());
        return this.createFailure(start, width, message);
    };
    ReturnTypeDeclWalker.prototype.visitObjectLiteralExpression = function (node) {
        this.pushContext(false);
        _super.prototype.visitObjectLiteralExpression.call(this, node);
        this.popContext();
    };
    ReturnTypeDeclWalker.prototype.visitClassDeclaration = function (node) {
        this.pushContext(true);
        _super.prototype.visitClassDeclaration.call(this, node);
        this.popContext();
    };
    ReturnTypeDeclWalker.prototype.visitClassExpression = function (node) {
        this.pushContext(true);
        _super.prototype.visitClassExpression.call(this, node);
        this.popContext();
    };
    ReturnTypeDeclWalker.prototype.visitFunctionDeclaration = function (node) {
        // Unconditionally check all function declarations
        if (!node.type) {
            this.addFailure(this.createDeclarationFailure('Function', node));
        }
        _super.prototype.visitFunctionDeclaration.call(this, node);
    };
    ReturnTypeDeclWalker.prototype.visitMethodDeclaration = function (node) {
        // Only check method declarations when we've been told to
        if (this.context() && !node.type) {
            this.addFailure(this.createDeclarationFailure('Method', node));
        }
        _super.prototype.visitMethodDeclaration.call(this, node);
    };
    ReturnTypeDeclWalker.prototype.visitSourceFile = function (node) {
        this.pushContext();
        _super.prototype.visitSourceFile.call(this, node);
    };
    return ReturnTypeDeclWalker;
}(contextAwareWalker_1.default));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV0dXJuVHlwZURlY2xSdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmV0dXJuVHlwZURlY2xSdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHNDQUF3QztBQUV4Qyw0REFBdUQ7QUFFdkQ7SUFBMEIsd0JBQXVCO0lBQWpEOztJQVFBLENBQUM7SUFQZSxvQkFBZSxHQUE3QixVQUE4QixJQUEyQixFQUFFLElBQVk7UUFDckUsTUFBTSxDQUFJLElBQUksVUFBSyxJQUFJLHNDQUFtQyxDQUFDO0lBQzdELENBQUM7SUFFTSxvQkFBSyxHQUFaLFVBQWEsVUFBeUI7UUFDcEMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxvQkFBb0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN2RixDQUFDO0lBQ0gsV0FBQztBQUFELENBQUMsQUFSRCxDQUEwQixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksR0FRaEQ7QUFSRCxvQkFRQztBQUVEO0lBQW1DLHdDQUEyQjtJQUE5RDs7SUEwREEsQ0FBQztJQXpEVyw2Q0FBYyxHQUF4QjtRQUNFLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRVMsdURBQXdCLEdBQWxDLFVBQW1DLElBQTJCLEVBQUUsSUFBZ0M7UUFDdkYsSUFBQSxnQkFBSSxFQUFFLDRCQUFVLENBQVM7UUFFaEMsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUN2QixHQUFHLEdBQUcsVUFBVSxDQUFDLEdBQUc7UUFDcEIsd0NBQXdDO1FBQ3hDLEtBQUssR0FBRyxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFaEMsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFFM0QsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRVMsMkRBQTRCLEdBQXRDLFVBQXVDLElBQWdDO1FBQ3JFLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEIsaUJBQU0sNEJBQTRCLFlBQUMsSUFBSSxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFUyxvREFBcUIsR0FBL0IsVUFBZ0MsSUFBeUI7UUFDdkQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QixpQkFBTSxxQkFBcUIsWUFBQyxJQUFJLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVTLG1EQUFvQixHQUE5QixVQUErQixJQUF3QjtRQUNyRCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZCLGlCQUFNLG9CQUFvQixZQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRVMsdURBQXdCLEdBQWxDLFVBQW1DLElBQTRCO1FBQzdELGtEQUFrRDtRQUNsRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbkUsQ0FBQztRQUVELGlCQUFNLHdCQUF3QixZQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFUyxxREFBc0IsR0FBaEMsVUFBaUMsSUFBMEI7UUFDekQseURBQXlEO1FBQ3pELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLENBQUM7UUFFRCxpQkFBTSxzQkFBc0IsWUFBQyxJQUFJLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRVMsOENBQWUsR0FBekIsVUFBMEIsSUFBbUI7UUFDM0MsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ25CLGlCQUFNLGVBQWUsWUFBQyxJQUFJLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBQ0gsMkJBQUM7QUFBRCxDQUFDLEFBMURELENBQW1DLDRCQUFrQixHQTBEcEQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBMaW50IGZyb20gJ3RzbGludC9saWIvbGludCc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCBDb250ZXh0QXdhcmVXYWxrZXIgZnJvbSAnLi4vY29udGV4dEF3YXJlV2Fsa2VyJztcblxuZXhwb3J0IGNsYXNzIFJ1bGUgZXh0ZW5kcyBMaW50LlJ1bGVzLkFic3RyYWN0UnVsZSB7XG4gIHB1YmxpYyBzdGF0aWMgbWFrZUVycm9yU3RyaW5nKHR5cGU6ICdGdW5jdGlvbicgfCAnTWV0aG9kJywgbmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYCR7dHlwZX0gJyR7bmFtZX0nIGRvZXMgbm90IGRlY2xhcmUgYSByZXR1cm4gdHlwZS5gO1xuICB9XG5cbiAgcHVibGljIGFwcGx5KHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiBMaW50LlJ1bGVGYWlsdXJlW10ge1xuICAgIHJldHVybiB0aGlzLmFwcGx5V2l0aFdhbGtlcihuZXcgUmV0dXJuVHlwZURlY2xXYWxrZXIoc291cmNlRmlsZSwgdGhpcy5nZXRPcHRpb25zKCkpKTtcbiAgfVxufVxuXG5jbGFzcyBSZXR1cm5UeXBlRGVjbFdhbGtlciBleHRlbmRzIENvbnRleHRBd2FyZVdhbGtlcjxib29sZWFuPiB7XG4gIHByb3RlY3RlZCBkZWZhdWx0Q29udGV4dCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcm90ZWN0ZWQgY3JlYXRlRGVjbGFyYXRpb25GYWlsdXJlKHR5cGU6ICdGdW5jdGlvbicgfCAnTWV0aG9kJywgbm9kZTogdHMuRnVuY3Rpb25MaWtlRGVjbGFyYXRpb24pOiBMaW50LlJ1bGVGYWlsdXJlIHtcbiAgICBjb25zdCB7bmFtZSwgcGFyYW1ldGVyc30gPSBub2RlO1xuXG4gICAgY29uc3Qgc3RhcnQgPSBuYW1lLmdldFN0YXJ0KCksXG4gICAgICAgICAgZW5kID0gcGFyYW1ldGVycy5lbmQsXG4gICAgICAgICAgLy8gQWRkIDEgdG8gYWNjb3VudCBmb3IgdGhlIHRyYWlsaW5nICcpJ1xuICAgICAgICAgIHdpZHRoID0gKGVuZCAtIHN0YXJ0KSArIDE7XG5cbiAgICBjb25zdCBtZXNzYWdlID0gUnVsZS5tYWtlRXJyb3JTdHJpbmcodHlwZSwgbmFtZS5nZXRUZXh0KCkpO1xuXG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlRmFpbHVyZShzdGFydCwgd2lkdGgsIG1lc3NhZ2UpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHZpc2l0T2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24obm9kZTogdHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24pOiB2b2lkIHtcbiAgICB0aGlzLnB1c2hDb250ZXh0KGZhbHNlKTtcbiAgICBzdXBlci52aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uKG5vZGUpO1xuICAgIHRoaXMucG9wQ29udGV4dCgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHZpc2l0Q2xhc3NEZWNsYXJhdGlvbihub2RlOiB0cy5DbGFzc0RlY2xhcmF0aW9uKTogdm9pZCB7XG4gICAgdGhpcy5wdXNoQ29udGV4dCh0cnVlKTtcbiAgICBzdXBlci52aXNpdENsYXNzRGVjbGFyYXRpb24obm9kZSk7XG4gICAgdGhpcy5wb3BDb250ZXh0KCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdmlzaXRDbGFzc0V4cHJlc3Npb24obm9kZTogdHMuQ2xhc3NFeHByZXNzaW9uKTogdm9pZCB7XG4gICAgdGhpcy5wdXNoQ29udGV4dCh0cnVlKTtcbiAgICBzdXBlci52aXNpdENsYXNzRXhwcmVzc2lvbihub2RlKTtcbiAgICB0aGlzLnBvcENvbnRleHQoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB2aXNpdEZ1bmN0aW9uRGVjbGFyYXRpb24obm9kZTogdHMuRnVuY3Rpb25EZWNsYXJhdGlvbik6IHZvaWQge1xuICAgIC8vIFVuY29uZGl0aW9uYWxseSBjaGVjayBhbGwgZnVuY3Rpb24gZGVjbGFyYXRpb25zXG4gICAgaWYgKCFub2RlLnR5cGUpIHtcbiAgICAgIHRoaXMuYWRkRmFpbHVyZSh0aGlzLmNyZWF0ZURlY2xhcmF0aW9uRmFpbHVyZSgnRnVuY3Rpb24nLCBub2RlKSk7XG4gICAgfVxuXG4gICAgc3VwZXIudmlzaXRGdW5jdGlvbkRlY2xhcmF0aW9uKG5vZGUpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHZpc2l0TWV0aG9kRGVjbGFyYXRpb24obm9kZTogdHMuTWV0aG9kRGVjbGFyYXRpb24pOiB2b2lkIHtcbiAgICAvLyBPbmx5IGNoZWNrIG1ldGhvZCBkZWNsYXJhdGlvbnMgd2hlbiB3ZSd2ZSBiZWVuIHRvbGQgdG9cbiAgICBpZiAodGhpcy5jb250ZXh0KCkgJiYgIW5vZGUudHlwZSkge1xuICAgICAgdGhpcy5hZGRGYWlsdXJlKHRoaXMuY3JlYXRlRGVjbGFyYXRpb25GYWlsdXJlKCdNZXRob2QnLCBub2RlKSk7XG4gICAgfVxuXG4gICAgc3VwZXIudmlzaXRNZXRob2REZWNsYXJhdGlvbihub2RlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB2aXNpdFNvdXJjZUZpbGUobm9kZTogdHMuU291cmNlRmlsZSk6IHZvaWQge1xuICAgIHRoaXMucHVzaENvbnRleHQoKTtcbiAgICBzdXBlci52aXNpdFNvdXJjZUZpbGUobm9kZSk7XG4gIH1cbn1cbiJdfQ==