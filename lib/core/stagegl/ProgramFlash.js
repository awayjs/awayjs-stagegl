var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ContextStage3D = require("awayjs-stagegl/lib/core/stagegl/ContextStage3D");
var OpCodes = require("awayjs-stagegl/lib/core/stagegl/OpCodes");
var ResourceBaseFlash = require("awayjs-stagegl/lib/core/stagegl/ResourceBaseFlash");
var ProgramFlash = (function (_super) {
    __extends(ProgramFlash, _super);
    function ProgramFlash(context) {
        _super.call(this);
        this._context = context;
        this._context.addStream(String.fromCharCode(OpCodes.initProgram));
        this._pId = this._context.execute();
        this._context._iAddResource(this);
    }
    ProgramFlash.prototype.upload = function (vertexProgram, fragmentProgram) {
        this._context.addStream(String.fromCharCode(OpCodes.uploadAGALBytesProgram, this._pId + OpCodes.intMask) + vertexProgram.readBase64String(vertexProgram.length) + "%" + fragmentProgram.readBase64String(fragmentProgram.length) + "%");
        if (ContextStage3D.debug)
            this._context.execute();
    };
    ProgramFlash.prototype.dispose = function () {
        this._context.addStream(String.fromCharCode(OpCodes.disposeProgram, this._pId + OpCodes.intMask));
        this._context.execute();
        this._context._iRemoveResource(this);
        this._context = null;
    };
    return ProgramFlash;
})(ResourceBaseFlash);
module.exports = ProgramFlash;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1zdGFnZWdsL2xpYi9jb3JlL3N0YWdlZ2wvcHJvZ3JhbWZsYXNoLnRzIl0sIm5hbWVzIjpbIlByb2dyYW1GbGFzaCIsIlByb2dyYW1GbGFzaC5jb25zdHJ1Y3RvciIsIlByb2dyYW1GbGFzaC51cGxvYWQiLCJQcm9ncmFtRmxhc2guZGlzcG9zZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsSUFBTyxjQUFjLFdBQWMsZ0RBQWdELENBQUMsQ0FBQztBQUVyRixJQUFPLE9BQU8sV0FBZ0IseUNBQXlDLENBQUMsQ0FBQztBQUN6RSxJQUFPLGlCQUFpQixXQUFhLG1EQUFtRCxDQUFDLENBQUM7QUFFMUYsSUFBTSxZQUFZO0lBQVNBLFVBQXJCQSxZQUFZQSxVQUEwQkE7SUFJM0NBLFNBSktBLFlBQVlBLENBSUxBLE9BQXNCQTtRQUVqQ0MsaUJBQU9BLENBQUNBO1FBRVJBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLE9BQU9BLENBQUNBO1FBQ3hCQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxDQUFDQSxZQUFZQSxDQUFDQSxPQUFPQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNsRUEsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsT0FBT0EsRUFBRUEsQ0FBQ0E7UUFDcENBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLGFBQWFBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO0lBQ25DQSxDQUFDQTtJQUVNRCw2QkFBTUEsR0FBYkEsVUFBY0EsYUFBdUJBLEVBQUVBLGVBQXlCQTtRQUUvREUsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsT0FBT0EsQ0FBQ0Esc0JBQXNCQSxFQUFFQSxJQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQSxHQUFHQSxhQUFhQSxDQUFDQSxnQkFBZ0JBLENBQUNBLGFBQWFBLENBQUNBLE1BQU1BLENBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLGVBQWVBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFFeE9BLEVBQUVBLENBQUNBLENBQUNBLGNBQWNBLENBQUNBLEtBQUtBLENBQUNBO1lBQ3hCQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQTtJQUMxQkEsQ0FBQ0E7SUFFTUYsOEJBQU9BLEdBQWRBO1FBRUNHLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLENBQUNBLFlBQVlBLENBQUNBLE9BQU9BLENBQUNBLGNBQWNBLEVBQUVBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO1FBQ2xHQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQTtRQUN4QkEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUVyQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0E7SUFDdEJBLENBQUNBO0lBQ0ZILG1CQUFDQTtBQUFEQSxDQTlCQSxBQThCQ0EsRUE5QjBCLGlCQUFpQixFQThCM0M7QUFFRCxBQUFzQixpQkFBYixZQUFZLENBQUMiLCJmaWxlIjoiY29yZS9zdGFnZWdsL1Byb2dyYW1GbGFzaC5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQnl0ZUFycmF5XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi91dGlscy9CeXRlQXJyYXlcIik7XG5cbmltcG9ydCBDb250ZXh0U3RhZ2UzRFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2NvcmUvc3RhZ2VnbC9Db250ZXh0U3RhZ2UzRFwiKTtcbmltcG9ydCBJUHJvZ3JhbVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9jb3JlL3N0YWdlZ2wvSVByb2dyYW1cIik7XG5pbXBvcnQgT3BDb2Rlc1x0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9jb3JlL3N0YWdlZ2wvT3BDb2Rlc1wiKTtcbmltcG9ydCBSZXNvdXJjZUJhc2VGbGFzaFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9jb3JlL3N0YWdlZ2wvUmVzb3VyY2VCYXNlRmxhc2hcIik7XG5cbmNsYXNzIFByb2dyYW1GbGFzaCBleHRlbmRzIFJlc291cmNlQmFzZUZsYXNoIGltcGxlbWVudHMgSVByb2dyYW1cbntcblx0cHJpdmF0ZSBfY29udGV4dDpDb250ZXh0U3RhZ2UzRDtcblxuXHRjb25zdHJ1Y3Rvcihjb250ZXh0OkNvbnRleHRTdGFnZTNEKVxuXHR7XG5cdFx0c3VwZXIoKTtcblxuXHRcdHRoaXMuX2NvbnRleHQgPSBjb250ZXh0O1xuXHRcdHRoaXMuX2NvbnRleHQuYWRkU3RyZWFtKFN0cmluZy5mcm9tQ2hhckNvZGUoT3BDb2Rlcy5pbml0UHJvZ3JhbSkpO1xuXHRcdHRoaXMuX3BJZCA9IHRoaXMuX2NvbnRleHQuZXhlY3V0ZSgpO1xuXHRcdHRoaXMuX2NvbnRleHQuX2lBZGRSZXNvdXJjZSh0aGlzKTtcblx0fVxuXG5cdHB1YmxpYyB1cGxvYWQodmVydGV4UHJvZ3JhbTpCeXRlQXJyYXksIGZyYWdtZW50UHJvZ3JhbTpCeXRlQXJyYXkpXG5cdHtcblx0XHR0aGlzLl9jb250ZXh0LmFkZFN0cmVhbShTdHJpbmcuZnJvbUNoYXJDb2RlKE9wQ29kZXMudXBsb2FkQUdBTEJ5dGVzUHJvZ3JhbSwgdGhpcy5fcElkICsgT3BDb2Rlcy5pbnRNYXNrKSArIHZlcnRleFByb2dyYW0ucmVhZEJhc2U2NFN0cmluZyh2ZXJ0ZXhQcm9ncmFtLmxlbmd0aCkgKyBcIiVcIiArIGZyYWdtZW50UHJvZ3JhbS5yZWFkQmFzZTY0U3RyaW5nKGZyYWdtZW50UHJvZ3JhbS5sZW5ndGgpICsgXCIlXCIpO1xuXG5cdFx0aWYgKENvbnRleHRTdGFnZTNELmRlYnVnKVxuXHRcdFx0dGhpcy5fY29udGV4dC5leGVjdXRlKCk7XG5cdH1cblxuXHRwdWJsaWMgZGlzcG9zZSgpXG5cdHtcblx0XHR0aGlzLl9jb250ZXh0LmFkZFN0cmVhbShTdHJpbmcuZnJvbUNoYXJDb2RlKE9wQ29kZXMuZGlzcG9zZVByb2dyYW0sIHRoaXMuX3BJZCArIE9wQ29kZXMuaW50TWFzaykpO1xuXHRcdHRoaXMuX2NvbnRleHQuZXhlY3V0ZSgpO1xuXHRcdHRoaXMuX2NvbnRleHQuX2lSZW1vdmVSZXNvdXJjZSh0aGlzKTtcblxuXHRcdHRoaXMuX2NvbnRleHQgPSBudWxsO1xuXHR9XG59XG5cbmV4cG9ydCA9IFByb2dyYW1GbGFzaDsiXX0=