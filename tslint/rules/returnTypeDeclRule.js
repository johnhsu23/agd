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
        _super.apply(this, arguments);
    }
    ReturnTypeDeclWalker.prototype.defaultContext = function () {
        return false;
    };
    ReturnTypeDeclWalker.prototype.createDeclarationFailure = function (type, node) {
        var name = node.name, parameters = node.parameters;
        var start = name.getStart(), end = parameters.end, width = (end - start) + 1;
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
        if (!node.type) {
            this.addFailure(this.createDeclarationFailure('Function', node));
        }
        _super.prototype.visitFunctionDeclaration.call(this, node);
    };
    ReturnTypeDeclWalker.prototype.visitMethodDeclaration = function (node) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV0dXJuVHlwZURlY2xSdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmV0dXJuVHlwZURlY2xSdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQVksSUFBSSxXQUFNLGlCQUFpQixDQUFDLENBQUE7QUFFeEMsbUNBQStCLHVCQUF1QixDQUFDLENBQUE7QUFFdkQ7SUFBMEIsd0JBQXVCO0lBQWpEO1FBQTBCLDhCQUF1QjtJQVFqRCxDQUFDO0lBUGUsb0JBQWUsR0FBN0IsVUFBOEIsSUFBMkIsRUFBRSxJQUFZO1FBQ3JFLE1BQU0sQ0FBSSxJQUFJLFVBQUssSUFBSSxzQ0FBbUMsQ0FBQztJQUM3RCxDQUFDO0lBRU0sb0JBQUssR0FBWixVQUFhLFVBQXlCO1FBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksb0JBQW9CLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDdkYsQ0FBQztJQUNILFdBQUM7QUFBRCxDQUFDLEFBUkQsQ0FBMEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEdBUWhEO0FBUlksWUFBSSxPQVFoQixDQUFBO0FBRUQ7SUFBbUMsd0NBQTJCO0lBQTlEO1FBQW1DLDhCQUEyQjtJQTBEOUQsQ0FBQztJQXpEVyw2Q0FBYyxHQUF4QjtRQUNFLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRVMsdURBQXdCLEdBQWxDLFVBQW1DLElBQTJCLEVBQUUsSUFBZ0M7UUFDdkYsb0JBQUksRUFBRSw0QkFBVSxDQUFTO1FBRWhDLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFDdkIsR0FBRyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBRXBCLEtBQUssR0FBRyxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFaEMsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFFM0QsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRVMsMkRBQTRCLEdBQXRDLFVBQXVDLElBQWdDO1FBQ3JFLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEIsZ0JBQUssQ0FBQyw0QkFBNEIsWUFBQyxJQUFJLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVTLG9EQUFxQixHQUEvQixVQUFnQyxJQUF5QjtRQUN2RCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZCLGdCQUFLLENBQUMscUJBQXFCLFlBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFUyxtREFBb0IsR0FBOUIsVUFBK0IsSUFBd0I7UUFDckQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QixnQkFBSyxDQUFDLG9CQUFvQixZQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRVMsdURBQXdCLEdBQWxDLFVBQW1DLElBQTRCO1FBRTdELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDZixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNuRSxDQUFDO1FBRUQsZ0JBQUssQ0FBQyx3QkFBd0IsWUFBQyxJQUFJLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRVMscURBQXNCLEdBQWhDLFVBQWlDLElBQTBCO1FBRXpELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLENBQUM7UUFFRCxnQkFBSyxDQUFDLHNCQUFzQixZQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFUyw4Q0FBZSxHQUF6QixVQUEwQixJQUFtQjtRQUMzQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbkIsZ0JBQUssQ0FBQyxlQUFlLFlBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUNILDJCQUFDO0FBQUQsQ0FBQyxBQTFERCxDQUFtQyw0QkFBa0IsR0EwRHBEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgTGludCBmcm9tICd0c2xpbnQvbGliL2xpbnQnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQgQ29udGV4dEF3YXJlV2Fsa2VyIGZyb20gJy4uL2NvbnRleHRBd2FyZVdhbGtlcic7XG5cbmV4cG9ydCBjbGFzcyBSdWxlIGV4dGVuZHMgTGludC5SdWxlcy5BYnN0cmFjdFJ1bGUge1xuICBwdWJsaWMgc3RhdGljIG1ha2VFcnJvclN0cmluZyh0eXBlOiAnRnVuY3Rpb24nIHwgJ01ldGhvZCcsIG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGAke3R5cGV9ICcke25hbWV9JyBkb2VzIG5vdCBkZWNsYXJlIGEgcmV0dXJuIHR5cGUuYDtcbiAgfVxuXG4gIHB1YmxpYyBhcHBseShzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlKTogTGludC5SdWxlRmFpbHVyZVtdIHtcbiAgICByZXR1cm4gdGhpcy5hcHBseVdpdGhXYWxrZXIobmV3IFJldHVyblR5cGVEZWNsV2Fsa2VyKHNvdXJjZUZpbGUsIHRoaXMuZ2V0T3B0aW9ucygpKSk7XG4gIH1cbn1cblxuY2xhc3MgUmV0dXJuVHlwZURlY2xXYWxrZXIgZXh0ZW5kcyBDb250ZXh0QXdhcmVXYWxrZXI8Ym9vbGVhbj4ge1xuICBwcm90ZWN0ZWQgZGVmYXVsdENvbnRleHQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNyZWF0ZURlY2xhcmF0aW9uRmFpbHVyZSh0eXBlOiAnRnVuY3Rpb24nIHwgJ01ldGhvZCcsIG5vZGU6IHRzLkZ1bmN0aW9uTGlrZURlY2xhcmF0aW9uKTogTGludC5SdWxlRmFpbHVyZSB7XG4gICAgY29uc3Qge25hbWUsIHBhcmFtZXRlcnN9ID0gbm9kZTtcblxuICAgIGNvbnN0IHN0YXJ0ID0gbmFtZS5nZXRTdGFydCgpLFxuICAgICAgICAgIGVuZCA9IHBhcmFtZXRlcnMuZW5kLFxuICAgICAgICAgIC8vIEFkZCAxIHRvIGFjY291bnQgZm9yIHRoZSB0cmFpbGluZyAnKSdcbiAgICAgICAgICB3aWR0aCA9IChlbmQgLSBzdGFydCkgKyAxO1xuXG4gICAgY29uc3QgbWVzc2FnZSA9IFJ1bGUubWFrZUVycm9yU3RyaW5nKHR5cGUsIG5hbWUuZ2V0VGV4dCgpKTtcblxuICAgIHJldHVybiB0aGlzLmNyZWF0ZUZhaWx1cmUoc3RhcnQsIHdpZHRoLCBtZXNzYWdlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB2aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uKG5vZGU6IHRzLk9iamVjdExpdGVyYWxFeHByZXNzaW9uKTogdm9pZCB7XG4gICAgdGhpcy5wdXNoQ29udGV4dChmYWxzZSk7XG4gICAgc3VwZXIudmlzaXRPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihub2RlKTtcbiAgICB0aGlzLnBvcENvbnRleHQoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB2aXNpdENsYXNzRGVjbGFyYXRpb24obm9kZTogdHMuQ2xhc3NEZWNsYXJhdGlvbik6IHZvaWQge1xuICAgIHRoaXMucHVzaENvbnRleHQodHJ1ZSk7XG4gICAgc3VwZXIudmlzaXRDbGFzc0RlY2xhcmF0aW9uKG5vZGUpO1xuICAgIHRoaXMucG9wQ29udGV4dCgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHZpc2l0Q2xhc3NFeHByZXNzaW9uKG5vZGU6IHRzLkNsYXNzRXhwcmVzc2lvbik6IHZvaWQge1xuICAgIHRoaXMucHVzaENvbnRleHQodHJ1ZSk7XG4gICAgc3VwZXIudmlzaXRDbGFzc0V4cHJlc3Npb24obm9kZSk7XG4gICAgdGhpcy5wb3BDb250ZXh0KCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdmlzaXRGdW5jdGlvbkRlY2xhcmF0aW9uKG5vZGU6IHRzLkZ1bmN0aW9uRGVjbGFyYXRpb24pOiB2b2lkIHtcbiAgICAvLyBVbmNvbmRpdGlvbmFsbHkgY2hlY2sgYWxsIGZ1bmN0aW9uIGRlY2xhcmF0aW9uc1xuICAgIGlmICghbm9kZS50eXBlKSB7XG4gICAgICB0aGlzLmFkZEZhaWx1cmUodGhpcy5jcmVhdGVEZWNsYXJhdGlvbkZhaWx1cmUoJ0Z1bmN0aW9uJywgbm9kZSkpO1xuICAgIH1cblxuICAgIHN1cGVyLnZpc2l0RnVuY3Rpb25EZWNsYXJhdGlvbihub2RlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB2aXNpdE1ldGhvZERlY2xhcmF0aW9uKG5vZGU6IHRzLk1ldGhvZERlY2xhcmF0aW9uKTogdm9pZCB7XG4gICAgLy8gT25seSBjaGVjayBtZXRob2QgZGVjbGFyYXRpb25zIHdoZW4gd2UndmUgYmVlbiB0b2xkIHRvXG4gICAgaWYgKHRoaXMuY29udGV4dCgpICYmICFub2RlLnR5cGUpIHtcbiAgICAgIHRoaXMuYWRkRmFpbHVyZSh0aGlzLmNyZWF0ZURlY2xhcmF0aW9uRmFpbHVyZSgnTWV0aG9kJywgbm9kZSkpO1xuICAgIH1cblxuICAgIHN1cGVyLnZpc2l0TWV0aG9kRGVjbGFyYXRpb24obm9kZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdmlzaXRTb3VyY2VGaWxlKG5vZGU6IHRzLlNvdXJjZUZpbGUpOiB2b2lkIHtcbiAgICB0aGlzLnB1c2hDb250ZXh0KCk7XG4gICAgc3VwZXIudmlzaXRTb3VyY2VGaWxlKG5vZGUpO1xuICB9XG59XG4iXX0=