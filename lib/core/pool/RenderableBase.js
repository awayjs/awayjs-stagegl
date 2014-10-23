var AbstractMethodError = require("awayjs-core/lib/errors/AbstractMethodError");
var SubGeometryBase = require("awayjs-display/lib/base/SubGeometryBase");
var TriangleSubGeometry = require("awayjs-display/lib/base/TriangleSubGeometry");
var SubGeometryEvent = require("awayjs-display/lib/events/SubGeometryEvent");
var IndexDataPool = require("awayjs-stagegl/lib/core/pool/IndexDataPool");
var VertexDataPool = require("awayjs-stagegl/lib/core/pool/VertexDataPool");
/**
 * @class RenderableListItem
 */
var RenderableBase = (function () {
    /**
     *
     * @param sourceEntity
     * @param materialOwner
     * @param subGeometry
     * @param animationSubGeometry
     */
    function RenderableBase(pool, sourceEntity, materialOwner, level, indexOffset) {
        var _this = this;
        if (level === void 0) { level = 0; }
        if (indexOffset === void 0) { indexOffset = 0; }
        this._geometryDirty = true;
        this._indexDataDirty = true;
        this._vertexData = new Object();
        this._pVertexDataDirty = new Object();
        this._vertexOffset = new Object();
        this._onIndicesUpdatedDelegate = function (event) { return _this._onIndicesUpdated(event); };
        this._onVerticesUpdatedDelegate = function (event) { return _this._onVerticesUpdated(event); };
        //store a reference to the pool for later disposal
        this._pool = pool;
        //reference to level of overflow
        this._level = level;
        //reference to the offset on indices (if this is an overflow renderable)
        this._indexOffset = indexOffset;
        this.sourceEntity = sourceEntity;
        this.materialOwner = materialOwner;
    }
    Object.defineProperty(RenderableBase.prototype, "overflow", {
        /**
         *
         */
        get: function () {
            if (this._indexDataDirty)
                this._updateIndexData();
            return this._overflow;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenderableBase.prototype, "numTriangles", {
        /**
         *
         */
        get: function () {
            return this._numTriangles;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    RenderableBase.prototype.getIndexData = function () {
        if (this._indexDataDirty)
            this._updateIndexData();
        return this._indexData;
    };
    /**
     *
     */
    RenderableBase.prototype.getVertexData = function (dataType) {
        if (this._indexDataDirty)
            this._updateIndexData();
        if (this._pVertexDataDirty[dataType])
            this._updateVertexData(dataType);
        return this._vertexData[this._concatenateArrays ? TriangleSubGeometry.VERTEX_DATA : dataType];
    };
    /**
     *
     */
    RenderableBase.prototype.getVertexOffset = function (dataType) {
        if (this._indexDataDirty)
            this._updateIndexData();
        if (this._pVertexDataDirty[dataType])
            this._updateVertexData(dataType);
        return this._vertexOffset[dataType];
    };
    RenderableBase.prototype.dispose = function () {
        this._pool.disposeItem(this.materialOwner);
        this._indexData.dispose();
        this._indexData = null;
        for (var dataType in this._vertexData) {
            this._vertexData[dataType].dispose();
            this._vertexData[dataType] = null;
        }
        if (this._overflow) {
            this._overflow.dispose();
            this._overflow = null;
        }
    };
    RenderableBase.prototype.invalidateGeometry = function () {
        this._geometryDirty = true;
        //invalidate indices
        if (this._level == 0)
            this._indexDataDirty = true;
        if (this._overflow)
            this._overflow.invalidateGeometry();
    };
    /**
     *
     */
    RenderableBase.prototype.invalidateIndexData = function () {
        this._indexDataDirty = true;
    };
    /**
     * //TODO
     *
     * @param dataType
     */
    RenderableBase.prototype.invalidateVertexData = function (dataType) {
        this._pVertexDataDirty[dataType] = true;
    };
    RenderableBase.prototype._pGetSubGeometry = function () {
        throw new AbstractMethodError();
    };
    /**
     * //TODO
     *
     * @param subGeometry
     * @param offset
     * @internal
     */
    RenderableBase.prototype._iFillIndexData = function (indexOffset) {
        if (this._geometryDirty)
            this._updateGeometry();
        this._indexData = IndexDataPool.getItem(this._subGeometry, this._level, indexOffset);
        this._numTriangles = this._indexData.data.length / 3;
        indexOffset = this._indexData.offset;
        //check if there is more to split
        if (indexOffset < this._subGeometry.indices.length) {
            if (!this._overflow)
                this._overflow = this._pGetOverflowRenderable(this._pool, this.materialOwner, indexOffset, this._level + 1);
            this._overflow._iFillIndexData(indexOffset);
        }
        else if (this._overflow) {
            this._overflow.dispose();
            this._overflow = null;
        }
    };
    RenderableBase.prototype._pGetOverflowRenderable = function (pool, materialOwner, level, indexOffset) {
        throw new AbstractMethodError();
    };
    /**
     * //TODO
     *
     * @private
     */
    RenderableBase.prototype._updateGeometry = function () {
        if (this._subGeometry) {
            if (this._level == 0)
                this._subGeometry.removeEventListener(SubGeometryEvent.INDICES_UPDATED, this._onIndicesUpdatedDelegate);
            this._subGeometry.removeEventListener(SubGeometryEvent.VERTICES_UPDATED, this._onVerticesUpdatedDelegate);
        }
        this._subGeometry = this._pGetSubGeometry();
        this._concatenateArrays = this._subGeometry.concatenateArrays;
        if (this._subGeometry) {
            if (this._level == 0)
                this._subGeometry.addEventListener(SubGeometryEvent.INDICES_UPDATED, this._onIndicesUpdatedDelegate);
            this._subGeometry.addEventListener(SubGeometryEvent.VERTICES_UPDATED, this._onVerticesUpdatedDelegate);
        }
        //dispose
        //			if (this._indexData) {
        //				this._indexData.dispose(); //TODO where is a good place to dispose?
        //				this._indexData = null;
        //			}
        //			for (var dataType in this._vertexData) {
        //				(<VertexData> this._vertexData[dataType]).dispose(); //TODO where is a good place to dispose?
        //				this._vertexData[dataType] = null;
        //			}
        this._geometryDirty = false;
        //specific vertex data types have to be invalidated in the specific renderable
    };
    /**
     * //TODO
     *
     * @private
     */
    RenderableBase.prototype._updateIndexData = function () {
        this._iFillIndexData(this._indexOffset);
        this._indexDataDirty = false;
    };
    /**
     * //TODO
     *
     * @param dataType
     * @private
     */
    RenderableBase.prototype._updateVertexData = function (dataType) {
        this._vertexOffset[dataType] = this._subGeometry.getOffset(dataType);
        if (this._subGeometry.concatenateArrays)
            dataType = SubGeometryBase.VERTEX_DATA;
        this._vertexData[dataType] = VertexDataPool.getItem(this._subGeometry, this.getIndexData(), dataType);
        this._pVertexDataDirty[dataType] = false;
    };
    /**
     * //TODO
     *
     * @param event
     * @private
     */
    RenderableBase.prototype._onIndicesUpdated = function (event) {
        this.invalidateIndexData();
    };
    /**
     * //TODO
     *
     * @param event
     * @private
     */
    RenderableBase.prototype._onVerticesUpdated = function (event) {
        this._concatenateArrays = event.target.concatenateArrays;
        this.invalidateVertexData(event.dataType);
    };
    return RenderableBase;
})();
module.exports = RenderableBase;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1zdGFnZWdsL2xpYi9jb3JlL3Bvb2wvcmVuZGVyYWJsZWJhc2UudHMiXSwibmFtZXMiOlsiUmVuZGVyYWJsZUJhc2UiLCJSZW5kZXJhYmxlQmFzZS5jb25zdHJ1Y3RvciIsIlJlbmRlcmFibGVCYXNlLm92ZXJmbG93IiwiUmVuZGVyYWJsZUJhc2UubnVtVHJpYW5nbGVzIiwiUmVuZGVyYWJsZUJhc2UuZ2V0SW5kZXhEYXRhIiwiUmVuZGVyYWJsZUJhc2UuZ2V0VmVydGV4RGF0YSIsIlJlbmRlcmFibGVCYXNlLmdldFZlcnRleE9mZnNldCIsIlJlbmRlcmFibGVCYXNlLmRpc3Bvc2UiLCJSZW5kZXJhYmxlQmFzZS5pbnZhbGlkYXRlR2VvbWV0cnkiLCJSZW5kZXJhYmxlQmFzZS5pbnZhbGlkYXRlSW5kZXhEYXRhIiwiUmVuZGVyYWJsZUJhc2UuaW52YWxpZGF0ZVZlcnRleERhdGEiLCJSZW5kZXJhYmxlQmFzZS5fcEdldFN1Ykdlb21ldHJ5IiwiUmVuZGVyYWJsZUJhc2UuX2lGaWxsSW5kZXhEYXRhIiwiUmVuZGVyYWJsZUJhc2UuX3BHZXRPdmVyZmxvd1JlbmRlcmFibGUiLCJSZW5kZXJhYmxlQmFzZS5fdXBkYXRlR2VvbWV0cnkiLCJSZW5kZXJhYmxlQmFzZS5fdXBkYXRlSW5kZXhEYXRhIiwiUmVuZGVyYWJsZUJhc2UuX3VwZGF0ZVZlcnRleERhdGEiLCJSZW5kZXJhYmxlQmFzZS5fb25JbmRpY2VzVXBkYXRlZCIsIlJlbmRlcmFibGVCYXNlLl9vblZlcnRpY2VzVXBkYXRlZCJdLCJtYXBwaW5ncyI6IkFBQ0EsSUFBTyxtQkFBbUIsV0FBYSw0Q0FBNEMsQ0FBQyxDQUFDO0FBR3JGLElBQU8sZUFBZSxXQUFjLHlDQUF5QyxDQUFDLENBQUM7QUFDL0UsSUFBTyxtQkFBbUIsV0FBYSw2Q0FBNkMsQ0FBQyxDQUFDO0FBSXRGLElBQU8sZ0JBQWdCLFdBQWMsNENBQTRDLENBQUMsQ0FBQztBQUluRixJQUFPLGFBQWEsV0FBYyw0Q0FBNEMsQ0FBQyxD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RGtCLElBQUlBLENBQUNBLGtCQUFrQkEsR0FBc0JBLEtBQUtBLENBQUNBLE1BQU9BLENBQUNBLGlCQUFpQkEsQ0FBQ0E7UUFFN0VBLElBQUlBLENBQUNBLG9CQUFvQkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7SUFDM0NBLENBQUNBO0lBQ0ZsQixxQkFBQ0E7QUFBREEsQ0FoVkEsQUFnVkNBLElBQUE7QUFFRCxBQUF3QixpQkFBZixjQUFjLENBQUMiLCJmaWxlIjoiY29yZS9wb29sL1JlbmRlcmFibGVCYXNlLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBNYXRyaXgzRFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL01hdHJpeDNEXCIpO1xuaW1wb3J0IEFic3RyYWN0TWV0aG9kRXJyb3JcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZXJyb3JzL0Fic3RyYWN0TWV0aG9kRXJyb3JcIik7XG5cbmltcG9ydCBJTWF0ZXJpYWxPd25lclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Jhc2UvSU1hdGVyaWFsT3duZXJcIik7XG5pbXBvcnQgU3ViR2VvbWV0cnlCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9TdWJHZW9tZXRyeUJhc2VcIik7XG5pbXBvcnQgVHJpYW5nbGVTdWJHZW9tZXRyeVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL1RyaWFuZ2xlU3ViR2VvbWV0cnlcIik7XG5pbXBvcnQgSVJlbmRlcmFibGVcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3Bvb2wvSVJlbmRlcmFibGVcIik7XG5pbXBvcnQgUmVuZGVyYWJsZVBvb2xcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9wb29sL1JlbmRlcmFibGVQb29sXCIpO1xuaW1wb3J0IElFbnRpdHlcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvSUVudGl0eVwiKTtcbmltcG9ydCBTdWJHZW9tZXRyeUV2ZW50XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZXZlbnRzL1N1Ykdlb21ldHJ5RXZlbnRcIik7XG5pbXBvcnQgTWF0ZXJpYWxCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9tYXRlcmlhbHMvTWF0ZXJpYWxCYXNlXCIpO1xuXG5pbXBvcnQgSW5kZXhEYXRhXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9jb3JlL3Bvb2wvSW5kZXhEYXRhXCIpO1xuaW1wb3J0IEluZGV4RGF0YVBvb2xcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9jb3JlL3Bvb2wvSW5kZXhEYXRhUG9vbFwiKTtcbmltcG9ydCBWZXJ0ZXhEYXRhXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9jb3JlL3Bvb2wvVmVydGV4RGF0YVwiKTtcbmltcG9ydCBWZXJ0ZXhEYXRhUG9vbFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2NvcmUvcG9vbC9WZXJ0ZXhEYXRhUG9vbFwiKTtcblxuLyoqXG4gKiBAY2xhc3MgUmVuZGVyYWJsZUxpc3RJdGVtXG4gKi9cbmNsYXNzIFJlbmRlcmFibGVCYXNlIGltcGxlbWVudHMgSVJlbmRlcmFibGVcbntcblx0cHJpdmF0ZSBfb25JbmRpY2VzVXBkYXRlZERlbGVnYXRlOihldmVudDpTdWJHZW9tZXRyeUV2ZW50KSA9PiB2b2lkO1xuXHRwcml2YXRlIF9vblZlcnRpY2VzVXBkYXRlZERlbGVnYXRlOihldmVudDpTdWJHZW9tZXRyeUV2ZW50KSA9PiB2b2lkO1xuXG5cdHByaXZhdGUgX3N1Ykdlb21ldHJ5OlN1Ykdlb21ldHJ5QmFzZTtcblx0cHJpdmF0ZSBfZ2VvbWV0cnlEaXJ0eTpib29sZWFuID0gdHJ1ZTtcblx0cHJpdmF0ZSBfaW5kZXhEYXRhOkluZGV4RGF0YTtcblx0cHJpdmF0ZSBfaW5kZXhEYXRhRGlydHk6Ym9vbGVhbiA9IHRydWU7XG5cdHByaXZhdGUgX3ZlcnRleERhdGE6T2JqZWN0ID0gbmV3IE9iamVjdCgpO1xuXHRwdWJsaWMgX3BWZXJ0ZXhEYXRhRGlydHk6T2JqZWN0ID0gbmV3IE9iamVjdCgpO1xuXHRwcml2YXRlIF92ZXJ0ZXhPZmZzZXQ6T2JqZWN0ID0gbmV3IE9iamVjdCgpO1xuXG5cdHByaXZhdGUgX2xldmVsOm51bWJlcjtcblx0cHJpdmF0ZSBfaW5kZXhPZmZzZXQ6bnVtYmVyO1xuXHRwcml2YXRlIF9vdmVyZmxvdzpSZW5kZXJhYmxlQmFzZTtcblx0cHJpdmF0ZSBfbnVtVHJpYW5nbGVzOm51bWJlcjtcblx0cHJpdmF0ZSBfY29uY2F0ZW5hdGVBcnJheXM6Ym9vbGVhbjtcblxuXG5cdHB1YmxpYyBKT0lOVF9JTkRFWF9GT1JNQVQ6c3RyaW5nO1xuXHRwdWJsaWMgSk9JTlRfV0VJR0hUX0ZPUk1BVDpzdHJpbmc7XG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRwdWJsaWMgX3Bvb2w6UmVuZGVyYWJsZVBvb2w7XG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IG92ZXJmbG93KCk6UmVuZGVyYWJsZUJhc2Vcblx0e1xuXHRcdGlmICh0aGlzLl9pbmRleERhdGFEaXJ0eSlcblx0XHRcdHRoaXMuX3VwZGF0ZUluZGV4RGF0YSgpO1xuXG5cdFx0cmV0dXJuIHRoaXMuX292ZXJmbG93O1xuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IG51bVRyaWFuZ2xlcygpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX251bVRyaWFuZ2xlcztcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0cHVibGljIG5leHQ6UmVuZGVyYWJsZUJhc2U7XG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRwdWJsaWMgbWF0ZXJpYWxJZDpudW1iZXI7XG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRwdWJsaWMgcmVuZGVyT3JkZXJJZDpudW1iZXI7XG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRwdWJsaWMgekluZGV4Om51bWJlcjtcblxuXHQvKipcblx0ICpcblx0ICovXG5cdHB1YmxpYyBjYXNjYWRlZDpib29sZWFuO1xuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0cHVibGljIHJlbmRlclNjZW5lVHJhbnNmb3JtOk1hdHJpeDNEO1xuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0cHVibGljIHNvdXJjZUVudGl0eTpJRW50aXR5O1xuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0cHVibGljIG1hdGVyaWFsT3duZXI6SU1hdGVyaWFsT3duZXI7XG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRwdWJsaWMgbWF0ZXJpYWw6TWF0ZXJpYWxCYXNlO1xuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0cHVibGljIGdldEluZGV4RGF0YSgpOkluZGV4RGF0YVxuXHR7XG5cdFx0aWYgKHRoaXMuX2luZGV4RGF0YURpcnR5KVxuXHRcdFx0dGhpcy5fdXBkYXRlSW5kZXhEYXRhKCk7XG5cblx0XHRyZXR1cm4gdGhpcy5faW5kZXhEYXRhO1xuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRwdWJsaWMgZ2V0VmVydGV4RGF0YShkYXRhVHlwZTpzdHJpbmcpOlZlcnRleERhdGFcblx0e1xuXHRcdGlmICh0aGlzLl9pbmRleERhdGFEaXJ0eSlcblx0XHRcdHRoaXMuX3VwZGF0ZUluZGV4RGF0YSgpO1xuXG5cdFx0aWYgKHRoaXMuX3BWZXJ0ZXhEYXRhRGlydHlbZGF0YVR5cGVdKVxuXHRcdFx0dGhpcy5fdXBkYXRlVmVydGV4RGF0YShkYXRhVHlwZSk7XG5cblx0XHRyZXR1cm4gdGhpcy5fdmVydGV4RGF0YVt0aGlzLl9jb25jYXRlbmF0ZUFycmF5cz8gVHJpYW5nbGVTdWJHZW9tZXRyeS5WRVJURVhfREFUQSA6IGRhdGFUeXBlXVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRwdWJsaWMgZ2V0VmVydGV4T2Zmc2V0KGRhdGFUeXBlOnN0cmluZyk6bnVtYmVyXG5cdHtcblx0XHRpZiAodGhpcy5faW5kZXhEYXRhRGlydHkpXG5cdFx0XHR0aGlzLl91cGRhdGVJbmRleERhdGEoKTtcblxuXHRcdGlmICh0aGlzLl9wVmVydGV4RGF0YURpcnR5W2RhdGFUeXBlXSlcblx0XHRcdHRoaXMuX3VwZGF0ZVZlcnRleERhdGEoZGF0YVR5cGUpO1xuXG5cdFx0cmV0dXJuIHRoaXMuX3ZlcnRleE9mZnNldFtkYXRhVHlwZV07XG5cdH1cblxuXHQvKipcblx0ICpcblx0ICogQHBhcmFtIHNvdXJjZUVudGl0eVxuXHQgKiBAcGFyYW0gbWF0ZXJpYWxPd25lclxuXHQgKiBAcGFyYW0gc3ViR2VvbWV0cnlcblx0ICogQHBhcmFtIGFuaW1hdGlvblN1Ykdlb21ldHJ5XG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcihwb29sOlJlbmRlcmFibGVQb29sLCBzb3VyY2VFbnRpdHk6SUVudGl0eSwgbWF0ZXJpYWxPd25lcjpJTWF0ZXJpYWxPd25lciwgbGV2ZWw6bnVtYmVyID0gMCwgaW5kZXhPZmZzZXQ6bnVtYmVyID0gMClcblx0e1xuXHRcdHRoaXMuX29uSW5kaWNlc1VwZGF0ZWREZWxlZ2F0ZSA9IChldmVudDpTdWJHZW9tZXRyeUV2ZW50KSA9PiB0aGlzLl9vbkluZGljZXNVcGRhdGVkKGV2ZW50KTtcblx0XHR0aGlzLl9vblZlcnRpY2VzVXBkYXRlZERlbGVnYXRlID0gKGV2ZW50OlN1Ykdlb21ldHJ5RXZlbnQpID0+IHRoaXMuX29uVmVydGljZXNVcGRhdGVkKGV2ZW50KTtcblxuXHRcdC8vc3RvcmUgYSByZWZlcmVuY2UgdG8gdGhlIHBvb2wgZm9yIGxhdGVyIGRpc3Bvc2FsXG5cdFx0dGhpcy5fcG9vbCA9IHBvb2w7XG5cblx0XHQvL3JlZmVyZW5jZSB0byBsZXZlbCBvZiBvdmVyZmxvd1xuXHRcdHRoaXMuX2xldmVsID0gbGV2ZWw7XG5cblx0XHQvL3JlZmVyZW5jZSB0byB0aGUgb2Zmc2V0IG9uIGluZGljZXMgKGlmIHRoaXMgaXMgYW4gb3ZlcmZsb3cgcmVuZGVyYWJsZSlcblx0XHR0aGlzLl9pbmRleE9mZnNldCA9IGluZGV4T2Zmc2V0O1xuXG5cdFx0dGhpcy5zb3VyY2VFbnRpdHkgPSBzb3VyY2VFbnRpdHk7XG5cdFx0dGhpcy5tYXRlcmlhbE93bmVyID0gbWF0ZXJpYWxPd25lcjtcblx0fVxuXG5cdHB1YmxpYyBkaXNwb3NlKClcblx0e1xuXHRcdHRoaXMuX3Bvb2wuZGlzcG9zZUl0ZW0odGhpcy5tYXRlcmlhbE93bmVyKTtcblxuXHRcdHRoaXMuX2luZGV4RGF0YS5kaXNwb3NlKCk7XG5cdFx0dGhpcy5faW5kZXhEYXRhID0gbnVsbDtcblxuXHRcdGZvciAodmFyIGRhdGFUeXBlIGluIHRoaXMuX3ZlcnRleERhdGEpIHtcblx0XHRcdCg8VmVydGV4RGF0YT4gdGhpcy5fdmVydGV4RGF0YVtkYXRhVHlwZV0pLmRpc3Bvc2UoKTtcblx0XHRcdHRoaXMuX3ZlcnRleERhdGFbZGF0YVR5cGVdID0gbnVsbDtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5fb3ZlcmZsb3cpIHtcblx0XHRcdHRoaXMuX292ZXJmbG93LmRpc3Bvc2UoKTtcblx0XHRcdHRoaXMuX292ZXJmbG93ID0gbnVsbDtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgaW52YWxpZGF0ZUdlb21ldHJ5KClcblx0e1xuXHRcdHRoaXMuX2dlb21ldHJ5RGlydHkgPSB0cnVlO1xuXG5cdFx0Ly9pbnZhbGlkYXRlIGluZGljZXNcblx0XHRpZiAodGhpcy5fbGV2ZWwgPT0gMClcblx0XHRcdHRoaXMuX2luZGV4RGF0YURpcnR5ID0gdHJ1ZTtcblxuXHRcdGlmICh0aGlzLl9vdmVyZmxvdylcblx0XHRcdHRoaXMuX292ZXJmbG93LmludmFsaWRhdGVHZW9tZXRyeSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRwdWJsaWMgaW52YWxpZGF0ZUluZGV4RGF0YSgpXG5cdHtcblx0XHR0aGlzLl9pbmRleERhdGFEaXJ0eSA9IHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogLy9UT0RPXG5cdCAqXG5cdCAqIEBwYXJhbSBkYXRhVHlwZVxuXHQgKi9cblx0cHVibGljIGludmFsaWRhdGVWZXJ0ZXhEYXRhKGRhdGFUeXBlOnN0cmluZylcblx0e1xuXHRcdHRoaXMuX3BWZXJ0ZXhEYXRhRGlydHlbZGF0YVR5cGVdID0gdHJ1ZTtcblx0fVxuXG5cdHB1YmxpYyBfcEdldFN1Ykdlb21ldHJ5KCk6U3ViR2VvbWV0cnlCYXNlXG5cdHtcblx0XHR0aHJvdyBuZXcgQWJzdHJhY3RNZXRob2RFcnJvcigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIC8vVE9ET1xuXHQgKlxuXHQgKiBAcGFyYW0gc3ViR2VvbWV0cnlcblx0ICogQHBhcmFtIG9mZnNldFxuXHQgKiBAaW50ZXJuYWxcblx0ICovXG5cdHB1YmxpYyBfaUZpbGxJbmRleERhdGEoaW5kZXhPZmZzZXQ6bnVtYmVyKVxuXHR7XG5cdFx0aWYgKHRoaXMuX2dlb21ldHJ5RGlydHkpXG5cdFx0XHR0aGlzLl91cGRhdGVHZW9tZXRyeSgpO1xuXG5cdFx0dGhpcy5faW5kZXhEYXRhID0gSW5kZXhEYXRhUG9vbC5nZXRJdGVtKHRoaXMuX3N1Ykdlb21ldHJ5LCB0aGlzLl9sZXZlbCwgaW5kZXhPZmZzZXQpO1xuXG5cdFx0dGhpcy5fbnVtVHJpYW5nbGVzID0gdGhpcy5faW5kZXhEYXRhLmRhdGEubGVuZ3RoLzM7XG5cblx0XHRpbmRleE9mZnNldCA9IHRoaXMuX2luZGV4RGF0YS5vZmZzZXQ7XG5cblx0XHQvL2NoZWNrIGlmIHRoZXJlIGlzIG1vcmUgdG8gc3BsaXRcblx0XHRpZiAoaW5kZXhPZmZzZXQgPCB0aGlzLl9zdWJHZW9tZXRyeS5pbmRpY2VzLmxlbmd0aCkge1xuXHRcdFx0aWYgKCF0aGlzLl9vdmVyZmxvdylcblx0XHRcdFx0dGhpcy5fb3ZlcmZsb3cgPSB0aGlzLl9wR2V0T3ZlcmZsb3dSZW5kZXJhYmxlKHRoaXMuX3Bvb2wsIHRoaXMubWF0ZXJpYWxPd25lciwgaW5kZXhPZmZzZXQsIHRoaXMuX2xldmVsICsgMSk7XG5cblx0XHRcdHRoaXMuX292ZXJmbG93Ll9pRmlsbEluZGV4RGF0YShpbmRleE9mZnNldCk7XG5cdFx0fSBlbHNlIGlmICh0aGlzLl9vdmVyZmxvdykge1xuXHRcdFx0dGhpcy5fb3ZlcmZsb3cuZGlzcG9zZSgpO1xuXHRcdFx0dGhpcy5fb3ZlcmZsb3cgPSBudWxsO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBfcEdldE92ZXJmbG93UmVuZGVyYWJsZShwb29sOlJlbmRlcmFibGVQb29sLCBtYXRlcmlhbE93bmVyOklNYXRlcmlhbE93bmVyLCBsZXZlbDpudW1iZXIsIGluZGV4T2Zmc2V0Om51bWJlcik6UmVuZGVyYWJsZUJhc2Vcblx0e1xuXHRcdHRocm93IG5ldyBBYnN0cmFjdE1ldGhvZEVycm9yKCk7XG5cdH1cblxuXHQvKipcblx0ICogLy9UT0RPXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRwcml2YXRlIF91cGRhdGVHZW9tZXRyeSgpXG5cdHtcblx0XHRpZiAodGhpcy5fc3ViR2VvbWV0cnkpIHtcblx0XHRcdGlmICh0aGlzLl9sZXZlbCA9PSAwKVxuXHRcdFx0XHR0aGlzLl9zdWJHZW9tZXRyeS5yZW1vdmVFdmVudExpc3RlbmVyKFN1Ykdlb21ldHJ5RXZlbnQuSU5ESUNFU19VUERBVEVELCB0aGlzLl9vbkluZGljZXNVcGRhdGVkRGVsZWdhdGUpO1xuXHRcdFx0dGhpcy5fc3ViR2VvbWV0cnkucmVtb3ZlRXZlbnRMaXN0ZW5lcihTdWJHZW9tZXRyeUV2ZW50LlZFUlRJQ0VTX1VQREFURUQsIHRoaXMuX29uVmVydGljZXNVcGRhdGVkRGVsZWdhdGUpO1xuXHRcdH1cblxuXHRcdHRoaXMuX3N1Ykdlb21ldHJ5ID0gdGhpcy5fcEdldFN1Ykdlb21ldHJ5KCk7XG5cblx0XHR0aGlzLl9jb25jYXRlbmF0ZUFycmF5cyA9IHRoaXMuX3N1Ykdlb21ldHJ5LmNvbmNhdGVuYXRlQXJyYXlzO1xuXG5cdFx0aWYgKHRoaXMuX3N1Ykdlb21ldHJ5KSB7XG5cdFx0XHRpZiAodGhpcy5fbGV2ZWwgPT0gMClcblx0XHRcdFx0dGhpcy5fc3ViR2VvbWV0cnkuYWRkRXZlbnRMaXN0ZW5lcihTdWJHZW9tZXRyeUV2ZW50LklORElDRVNfVVBEQVRFRCwgdGhpcy5fb25JbmRpY2VzVXBkYXRlZERlbGVnYXRlKTtcblx0XHRcdHRoaXMuX3N1Ykdlb21ldHJ5LmFkZEV2ZW50TGlzdGVuZXIoU3ViR2VvbWV0cnlFdmVudC5WRVJUSUNFU19VUERBVEVELCB0aGlzLl9vblZlcnRpY2VzVXBkYXRlZERlbGVnYXRlKTtcblx0XHR9XG5cblx0XHQvL2Rpc3Bvc2Vcbi8vXHRcdFx0aWYgKHRoaXMuX2luZGV4RGF0YSkge1xuLy9cdFx0XHRcdHRoaXMuX2luZGV4RGF0YS5kaXNwb3NlKCk7IC8vVE9ETyB3aGVyZSBpcyBhIGdvb2QgcGxhY2UgdG8gZGlzcG9zZT9cbi8vXHRcdFx0XHR0aGlzLl9pbmRleERhdGEgPSBudWxsO1xuLy9cdFx0XHR9XG5cbi8vXHRcdFx0Zm9yICh2YXIgZGF0YVR5cGUgaW4gdGhpcy5fdmVydGV4RGF0YSkge1xuLy9cdFx0XHRcdCg8VmVydGV4RGF0YT4gdGhpcy5fdmVydGV4RGF0YVtkYXRhVHlwZV0pLmRpc3Bvc2UoKTsgLy9UT0RPIHdoZXJlIGlzIGEgZ29vZCBwbGFjZSB0byBkaXNwb3NlP1xuLy9cdFx0XHRcdHRoaXMuX3ZlcnRleERhdGFbZGF0YVR5cGVdID0gbnVsbDtcbi8vXHRcdFx0fVxuXG5cdFx0dGhpcy5fZ2VvbWV0cnlEaXJ0eSA9IGZhbHNlO1xuXG5cdFx0Ly9zcGVjaWZpYyB2ZXJ0ZXggZGF0YSB0eXBlcyBoYXZlIHRvIGJlIGludmFsaWRhdGVkIGluIHRoZSBzcGVjaWZpYyByZW5kZXJhYmxlXG5cdH1cblxuXHQvKipcblx0ICogLy9UT0RPXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRwcml2YXRlIF91cGRhdGVJbmRleERhdGEoKVxuXHR7XG5cdFx0dGhpcy5faUZpbGxJbmRleERhdGEodGhpcy5faW5kZXhPZmZzZXQpO1xuXG5cdFx0dGhpcy5faW5kZXhEYXRhRGlydHkgPSBmYWxzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiAvL1RPRE9cblx0ICpcblx0ICogQHBhcmFtIGRhdGFUeXBlXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRwcml2YXRlIF91cGRhdGVWZXJ0ZXhEYXRhKGRhdGFUeXBlOnN0cmluZylcblx0e1xuXHRcdHRoaXMuX3ZlcnRleE9mZnNldFtkYXRhVHlwZV0gPSB0aGlzLl9zdWJHZW9tZXRyeS5nZXRPZmZzZXQoZGF0YVR5cGUpO1xuXG5cdFx0aWYgKHRoaXMuX3N1Ykdlb21ldHJ5LmNvbmNhdGVuYXRlQXJyYXlzKVxuXHRcdFx0ZGF0YVR5cGUgPSBTdWJHZW9tZXRyeUJhc2UuVkVSVEVYX0RBVEE7XG5cblx0XHR0aGlzLl92ZXJ0ZXhEYXRhW2RhdGFUeXBlXSA9IFZlcnRleERhdGFQb29sLmdldEl0ZW0odGhpcy5fc3ViR2VvbWV0cnksIHRoaXMuZ2V0SW5kZXhEYXRhKCksIGRhdGFUeXBlKTtcblxuXHRcdHRoaXMuX3BWZXJ0ZXhEYXRhRGlydHlbZGF0YVR5cGVdID0gZmFsc2U7XG5cdH1cblxuXHQvKipcblx0ICogLy9UT0RPXG5cdCAqXG5cdCAqIEBwYXJhbSBldmVudFxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0cHJpdmF0ZSBfb25JbmRpY2VzVXBkYXRlZChldmVudDpTdWJHZW9tZXRyeUV2ZW50KVxuXHR7XG5cdFx0dGhpcy5pbnZhbGlkYXRlSW5kZXhEYXRhKCk7XG5cdH1cblxuXHQvKipcblx0ICogLy9UT0RPXG5cdCAqXG5cdCAqIEBwYXJhbSBldmVudFxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0cHJpdmF0ZSBfb25WZXJ0aWNlc1VwZGF0ZWQoZXZlbnQ6U3ViR2VvbWV0cnlFdmVudClcblx0e1xuXHRcdHRoaXMuX2NvbmNhdGVuYXRlQXJyYXlzID0gKDxTdWJHZW9tZXRyeUJhc2U+IGV2ZW50LnRhcmdldCkuY29uY2F0ZW5hdGVBcnJheXM7XG5cblx0XHR0aGlzLmludmFsaWRhdGVWZXJ0ZXhEYXRhKGV2ZW50LmRhdGFUeXBlKTtcblx0fVxufVxuXG5leHBvcnQgPSBSZW5kZXJhYmxlQmFzZTsiXX0=