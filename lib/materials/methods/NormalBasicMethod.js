var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ContextGLMipFilter = require("awayjs-stagegl/lib/core/stagegl/ContextGLMipFilter");
var ContextGLTextureFilter = require("awayjs-stagegl/lib/core/stagegl/ContextGLTextureFilter");
var ContextGLWrapMode = require("awayjs-stagegl/lib/core/stagegl/ContextGLWrapMode");
var ShadingMethodBase = require("awayjs-stagegl/lib/materials/methods/ShadingMethodBase");
var ShaderCompilerHelper = require("awayjs-stagegl/lib/materials/utils/ShaderCompilerHelper");
/**
 * NormalBasicMethod is the default method for standard tangent-space normal mapping.
 */
var NormalBasicMethod = (function (_super) {
    __extends(NormalBasicMethod, _super);
    /**
     * Creates a new NormalBasicMethod object.
     */
    function NormalBasicMethod() {
        _super.call(this);
    }
    NormalBasicMethod.prototype.iIsUsed = function (shaderObject) {
        if (!this._useTexture || !shaderObject.normalDependencies)
            return false;
        return true;
    };
    /**
     * @inheritDoc
     */
    NormalBasicMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        methodVO.needsUV = this._useTexture;
    };
    /**
     * Indicates whether or not this method outputs normals in tangent space. Override for object-space normals.
     */
    NormalBasicMethod.prototype.iOutputsTangentNormals = function () {
        return true;
    };
    /**
     * @inheritDoc
     */
    NormalBasicMethod.prototype.copyFrom = function (method) {
        var s = method;
        var bnm = method;
        if (bnm.normalMap != null)
            this.normalMap = bnm.normalMap;
    };
    Object.defineProperty(NormalBasicMethod.prototype, "normalMap", {
        /**
         * The texture containing the normals per pixel.
         */
        get: function () {
            return this._texture;
        },
        set: function (value) {
            var b = (value != null);
            if (b != this._useTexture || (value && this._texture && (value.hasMipmaps != this._texture.hasMipmaps || value.format != this._texture.format)))
                this.iInvalidateShaderProgram();
            this._useTexture = b;
            this._texture = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    NormalBasicMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
        this._pNormalTextureRegister = null;
    };
    /**
     * @inheritDoc
     */
    NormalBasicMethod.prototype.dispose = function () {
        if (this._texture)
            this._texture = null;
    };
    /**
     * @inheritDoc
     */
    NormalBasicMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        if (methodVO.texturesIndex >= 0) {
            stage.context.setSamplerStateAt(methodVO.texturesIndex, shaderObject.repeatTextures ? ContextGLWrapMode.REPEAT : ContextGLWrapMode.CLAMP, shaderObject.useSmoothTextures ? ContextGLTextureFilter.LINEAR : ContextGLTextureFilter.NEAREST, shaderObject.useMipmapping ? ContextGLMipFilter.MIPLINEAR : ContextGLMipFilter.MIPNONE);
            stage.context.activateTexture(methodVO.texturesIndex, this._texture);
        }
    };
    /**
     * @inheritDoc
     */
    NormalBasicMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        this._pNormalTextureRegister = registerCache.getFreeTextureReg();
        methodVO.texturesIndex = this._pNormalTextureRegister.index;
        return ShaderCompilerHelper.getTex2DSampleCode(targetReg, sharedRegisters, this._pNormalTextureRegister, this._texture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping) + "sub " + targetReg + ".xyz, " + targetReg + ".xyz, " + sharedRegisters.commons + ".xxx\n" + "nrm " + targetReg + ".xyz, " + targetReg + "\n";
    };
    return NormalBasicMethod;
})(ShadingMethodBase);
module.exports = NormalBasicMethod;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9ub3JtYWxiYXNpY21ldGhvZC50cyJdLCJuYW1lcyI6WyJOb3JtYWxCYXNpY01ldGhvZCIsIk5vcm1hbEJhc2ljTWV0aG9kLmNvbnN0cnVjdG9yIiwiTm9ybWFsQmFzaWNNZXRob2QuaUlzVXNlZCIsIk5vcm1hbEJhc2ljTWV0aG9kLmlJbml0Vk8iLCJOb3JtYWxCYXNpY01ldGhvZC5pT3V0cHV0c1RhbmdlbnROb3JtYWxzIiwiTm9ybWFsQmFzaWNNZXRob2QuY29weUZyb20iLCJOb3JtYWxCYXNpY01ldGhvZC5ub3JtYWxNYXAiLCJOb3JtYWxCYXNpY01ldGhvZC5pQ2xlYW5Db21waWxhdGlvbkRhdGEiLCJOb3JtYWxCYXNpY01ldGhvZC5kaXNwb3NlIiwiTm9ybWFsQmFzaWNNZXRob2QuaUFjdGl2YXRlIiwiTm9ybWFsQmFzaWNNZXRob2QuaUdldEZyYWdtZW50Q29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBR0EsSUFBTyxrQkFBa0IsV0FBYSxvREFBb0QsQ0FBQyxDQUFDO0FBQzVGLElBQU8sc0JBQXNCLFdBQVksd0RBQXdELENBQUMsQ0FBQztBQUNuRyxJQUFPLGlCQUFpQixXQUFhLG1EQUFtRCxDQUFDLENBQUM7QUFPMUYsSUFBTyxpQkFBaUIsV0FBYSx3REFBd0QsQ0FBQyxDQUFDO0FBQy9GLElBQU8sb0JBQW9CLFdBQWEseURBQXlELENBQUMsQ0FBQztBQUVuRyxBQUdBOztHQURHO0lBQ0csaUJBQWlCO0lBQVNBLFVBQTFCQSxpQkFBaUJBLFVBQTBCQTtJQU1oREE7O09BRUdBO0lBQ0hBLFNBVEtBLGlCQUFpQkE7UUFXckJDLGlCQUFPQSxDQUFDQTtJQUNUQSxDQUFDQTtJQUVNRCxtQ0FBT0EsR0FBZEEsVUFBZUEsWUFBNkJBO1FBRTNDRSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxrQkFBa0JBLENBQUNB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Q0FBQ0E7WUFDL1RBLEtBQUtBLENBQUNBLE9BQVFBLENBQUNBLGVBQWVBLENBQUNBLFFBQVFBLENBQUNBLGFBQWFBLEVBQUVBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO1FBQzFGQSxDQUFDQTtJQUNGQSxDQUFDQTtJQUVEVDs7T0FFR0E7SUFDSUEsNENBQWdCQSxHQUF2QkEsVUFBd0JBLFlBQTZCQSxFQUFFQSxRQUFpQkEsRUFBRUEsU0FBK0JBLEVBQUVBLGFBQWlDQSxFQUFFQSxlQUFrQ0E7UUFFL0tVLElBQUlBLENBQUNBLHVCQUF1QkEsR0FBR0EsYUFBYUEsQ0FBQ0EsaUJBQWlCQSxFQUFFQSxDQUFDQTtRQUVqRUEsUUFBUUEsQ0FBQ0EsYUFBYUEsR0FBR0EsSUFBSUEsQ0FBQ0EsdUJBQXVCQSxDQUFDQSxLQUFLQSxDQUFDQTtRQUU1REEsTUFBTUEsQ0FBQ0Esb0JBQW9CQSxDQUFDQSxrQkFBa0JBLENBQUNBLFNBQVNBLEVBQUVBLGVBQWVBLEVBQUVBLElBQUlBLENBQUNBLHVCQUF1QkEsRUFBRUEsSUFBSUEsQ0FBQ0EsUUFBUUEsRUFBRUEsWUFBWUEsQ0FBQ0EsaUJBQWlCQSxFQUFFQSxZQUFZQSxDQUFDQSxjQUFjQSxFQUFFQSxZQUFZQSxDQUFDQSxhQUFhQSxDQUFDQSxHQUMvTUEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsUUFBUUEsR0FBR0EsU0FBU0EsR0FBR0EsUUFBUUEsR0FBR0EsZUFBZUEsQ0FBQ0EsT0FBT0EsR0FBR0EsUUFBUUEsR0FDekZBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLFFBQVFBLEdBQUdBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBO0lBQ25EQSxDQUFDQTtJQUNGVix3QkFBQ0E7QUFBREEsQ0FoSEEsQUFnSENBLEVBaEgrQixpQkFBaUIsRUFnSGhEO0FBRUQsQUFBMkIsaUJBQWxCLGlCQUFpQixDQUFDIiwiZmlsZSI6Im1hdGVyaWFscy9tZXRob2RzL05vcm1hbEJhc2ljTWV0aG9kLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZXh0dXJlMkRCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdGV4dHVyZXMvVGV4dHVyZTJEQmFzZVwiKTtcblxuaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2NvcmUvYmFzZS9TdGFnZVwiKTtcbmltcG9ydCBDb250ZXh0R0xNaXBGaWx0ZXJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvY29yZS9zdGFnZWdsL0NvbnRleHRHTE1pcEZpbHRlclwiKTtcbmltcG9ydCBDb250ZXh0R0xUZXh0dXJlRmlsdGVyXHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9jb3JlL3N0YWdlZ2wvQ29udGV4dEdMVGV4dHVyZUZpbHRlclwiKTtcbmltcG9ydCBDb250ZXh0R0xXcmFwTW9kZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9jb3JlL3N0YWdlZ2wvQ29udGV4dEdMV3JhcE1vZGVcIik7XG5pbXBvcnQgSUNvbnRleHRTdGFnZUdMXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvY29yZS9zdGFnZWdsL0lDb250ZXh0U3RhZ2VHTFwiKTtcbmltcG9ydCBNZXRob2RWT1x0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vTWV0aG9kVk9cIik7XG5pbXBvcnQgU2hhZGVyT2JqZWN0QmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyQ2FjaGVcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyQ2FjaGVcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJEYXRhXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckRhdGFcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJFbGVtZW50XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJFbGVtZW50XCIpO1xuaW1wb3J0IFNoYWRpbmdNZXRob2RCYXNlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL1NoYWRpbmdNZXRob2RCYXNlXCIpO1xuaW1wb3J0IFNoYWRlckNvbXBpbGVySGVscGVyXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy91dGlscy9TaGFkZXJDb21waWxlckhlbHBlclwiKTtcblxuLyoqXG4gKiBOb3JtYWxCYXNpY01ldGhvZCBpcyB0aGUgZGVmYXVsdCBtZXRob2QgZm9yIHN0YW5kYXJkIHRhbmdlbnQtc3BhY2Ugbm9ybWFsIG1hcHBpbmcuXG4gKi9cbmNsYXNzIE5vcm1hbEJhc2ljTWV0aG9kIGV4dGVuZHMgU2hhZGluZ01ldGhvZEJhc2Vcbntcblx0cHJpdmF0ZSBfdGV4dHVyZTpUZXh0dXJlMkRCYXNlO1xuXHRwcml2YXRlIF91c2VUZXh0dXJlOmJvb2xlYW47XG5cdHB1YmxpYyBfcE5vcm1hbFRleHR1cmVSZWdpc3RlcjpTaGFkZXJSZWdpc3RlckVsZW1lbnQ7XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgTm9ybWFsQmFzaWNNZXRob2Qgb2JqZWN0LlxuXHQgKi9cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0c3VwZXIoKTtcblx0fVxuXG5cdHB1YmxpYyBpSXNVc2VkKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKTpib29sZWFuXG5cdHtcblx0XHRpZiAoIXRoaXMuX3VzZVRleHR1cmUgfHwgIXNoYWRlck9iamVjdC5ub3JtYWxEZXBlbmRlbmNpZXMpXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlJbml0Vk8oc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPKVxuXHR7XG5cdFx0bWV0aG9kVk8ubmVlZHNVViA9IHRoaXMuX3VzZVRleHR1cmU7XG5cdH1cblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IHRoaXMgbWV0aG9kIG91dHB1dHMgbm9ybWFscyBpbiB0YW5nZW50IHNwYWNlLiBPdmVycmlkZSBmb3Igb2JqZWN0LXNwYWNlIG5vcm1hbHMuXG5cdCAqL1xuXHRwdWJsaWMgaU91dHB1dHNUYW5nZW50Tm9ybWFscygpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgY29weUZyb20obWV0aG9kOlNoYWRpbmdNZXRob2RCYXNlKVxuXHR7XG5cdFx0dmFyIHM6YW55ID0gbWV0aG9kO1xuXHRcdHZhciBibm06Tm9ybWFsQmFzaWNNZXRob2QgPSA8Tm9ybWFsQmFzaWNNZXRob2Q+IG1ldGhvZDtcblxuXHRcdGlmIChibm0ubm9ybWFsTWFwICE9IG51bGwpXG5cdFx0XHR0aGlzLm5vcm1hbE1hcCA9IGJubS5ub3JtYWxNYXA7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIHRleHR1cmUgY29udGFpbmluZyB0aGUgbm9ybWFscyBwZXIgcGl4ZWwuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IG5vcm1hbE1hcCgpOlRleHR1cmUyREJhc2Vcblx0e1xuXHRcdHJldHVybiB0aGlzLl90ZXh0dXJlO1xuXHR9XG5cblx0cHVibGljIHNldCBub3JtYWxNYXAodmFsdWU6VGV4dHVyZTJEQmFzZSlcblx0e1xuXHRcdHZhciBiOmJvb2xlYW4gPSAodmFsdWUgIT0gbnVsbCk7XG5cblx0XHRpZiAoYiAhPSB0aGlzLl91c2VUZXh0dXJlIHx8ICh2YWx1ZSAmJiB0aGlzLl90ZXh0dXJlICYmICh2YWx1ZS5oYXNNaXBtYXBzICE9IHRoaXMuX3RleHR1cmUuaGFzTWlwbWFwcyB8fCB2YWx1ZS5mb3JtYXQgIT0gdGhpcy5fdGV4dHVyZS5mb3JtYXQpKSlcblx0XHRcdHRoaXMuaUludmFsaWRhdGVTaGFkZXJQcm9ncmFtKCk7XG5cblx0XHR0aGlzLl91c2VUZXh0dXJlID0gYjtcblx0XHR0aGlzLl90ZXh0dXJlID0gdmFsdWU7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlDbGVhbkNvbXBpbGF0aW9uRGF0YSgpXG5cdHtcblx0XHRzdXBlci5pQ2xlYW5Db21waWxhdGlvbkRhdGEoKTtcblx0XHR0aGlzLl9wTm9ybWFsVGV4dHVyZVJlZ2lzdGVyID0gbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGRpc3Bvc2UoKVxuXHR7XG5cdFx0aWYgKHRoaXMuX3RleHR1cmUpXG5cdFx0XHR0aGlzLl90ZXh0dXJlID0gbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlBY3RpdmF0ZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8sIHN0YWdlOlN0YWdlKVxuXHR7XG5cdFx0aWYgKG1ldGhvZFZPLnRleHR1cmVzSW5kZXggPj0gMCkge1xuXHRcdFx0KDxJQ29udGV4dFN0YWdlR0w+IHN0YWdlLmNvbnRleHQpLnNldFNhbXBsZXJTdGF0ZUF0KG1ldGhvZFZPLnRleHR1cmVzSW5kZXgsIHNoYWRlck9iamVjdC5yZXBlYXRUZXh0dXJlcz8gQ29udGV4dEdMV3JhcE1vZGUuUkVQRUFUOkNvbnRleHRHTFdyYXBNb2RlLkNMQU1QLCBzaGFkZXJPYmplY3QudXNlU21vb3RoVGV4dHVyZXM/IENvbnRleHRHTFRleHR1cmVGaWx0ZXIuTElORUFSIDogQ29udGV4dEdMVGV4dHVyZUZpbHRlci5ORUFSRVNULCBzaGFkZXJPYmplY3QudXNlTWlwbWFwcGluZz8gQ29udGV4dEdMTWlwRmlsdGVyLk1JUExJTkVBUiA6IENvbnRleHRHTE1pcEZpbHRlci5NSVBOT05FKTtcblx0XHRcdCg8SUNvbnRleHRTdGFnZUdMPiBzdGFnZS5jb250ZXh0KS5hY3RpdmF0ZVRleHR1cmUobWV0aG9kVk8udGV4dHVyZXNJbmRleCwgdGhpcy5fdGV4dHVyZSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUdldEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8sIHRhcmdldFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHR0aGlzLl9wTm9ybWFsVGV4dHVyZVJlZ2lzdGVyID0gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlVGV4dHVyZVJlZygpO1xuXG5cdFx0bWV0aG9kVk8udGV4dHVyZXNJbmRleCA9IHRoaXMuX3BOb3JtYWxUZXh0dXJlUmVnaXN0ZXIuaW5kZXg7XG5cblx0XHRyZXR1cm4gU2hhZGVyQ29tcGlsZXJIZWxwZXIuZ2V0VGV4MkRTYW1wbGVDb2RlKHRhcmdldFJlZywgc2hhcmVkUmVnaXN0ZXJzLCB0aGlzLl9wTm9ybWFsVGV4dHVyZVJlZ2lzdGVyLCB0aGlzLl90ZXh0dXJlLCBzaGFkZXJPYmplY3QudXNlU21vb3RoVGV4dHVyZXMsIHNoYWRlck9iamVjdC5yZXBlYXRUZXh0dXJlcywgc2hhZGVyT2JqZWN0LnVzZU1pcG1hcHBpbmcpICtcblx0XHRcdFwic3ViIFwiICsgdGFyZ2V0UmVnICsgXCIueHl6LCBcIiArIHRhcmdldFJlZyArIFwiLnh5eiwgXCIgKyBzaGFyZWRSZWdpc3RlcnMuY29tbW9ucyArIFwiLnh4eFxcblwiICtcblx0XHRcdFwibnJtIFwiICsgdGFyZ2V0UmVnICsgXCIueHl6LCBcIiArIHRhcmdldFJlZyArIFwiXFxuXCI7XG5cdH1cbn1cblxuZXhwb3J0ID0gTm9ybWFsQmFzaWNNZXRob2Q7Il19