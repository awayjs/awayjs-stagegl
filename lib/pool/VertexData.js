var SubGeometryBase = require("awayjs-display/lib/base/SubGeometryBase");
var SubGeometryEvent = require("awayjs-display/lib/events/SubGeometryEvent");
/**
 *
 */
var VertexData = (function () {
    function VertexData(subGeometry, dataType) {
        var _this = this;
        this._dataDirty = true;
        this.invalid = new Array(8);
        this.buffers = new Array(8);
        this.contexts = new Array(8);
        this._subGeometry = subGeometry;
        this._dataType = dataType;
        this._onVerticesUpdatedDelegate = function (event) { return _this._onVerticesUpdated(event); };
        this._subGeometry.addEventListener(SubGeometryEvent.VERTICES_UPDATED, this._onVerticesUpdatedDelegate);
    }
    VertexData.prototype.updateData = function (originalIndices, indexMappings) {
        if (originalIndices === void 0) { originalIndices = null; }
        if (indexMappings === void 0) { indexMappings = null; }
        if (this._dataDirty) {
            this._dataDirty = false;
            this.dataPerVertex = this._subGeometry.getStride(this._dataType);
            var vertices = this._subGeometry[this._dataType];
            if (indexMappings == null) {
                this.setData(vertices);
            }
            else {
                var splitVerts = new Array(originalIndices.length * this.dataPerVertex);
                var originalIndex;
                var splitIndex;
                var i = 0;
                var j = 0;
                while (i < originalIndices.length) {
                    originalIndex = originalIndices[i];
                    splitIndex = indexMappings[originalIndex] * this.dataPerVertex;
                    originalIndex *= this.dataPerVertex;
                    for (j = 0; j < this.dataPerVertex; j++)
                        splitVerts[splitIndex + j] = vertices[originalIndex + j];
                    i++;
                }
                this.setData(splitVerts);
            }
        }
    };
    VertexData.prototype.dispose = function () {
        for (var i = 0; i < 8; ++i) {
            if (this.contexts[i]) {
                this.buffers[i].dispose();
                this.buffers[i] = null;
                this.contexts[i] = null;
            }
        }
    };
    /**
     * @private
     */
    VertexData.prototype.disposeBuffers = function () {
        for (var i = 0; i < 8; ++i) {
            if (this.buffers[i]) {
                this.buffers[i].dispose();
                this.buffers[i] = null;
            }
        }
    };
    /**
     * @private
     */
    VertexData.prototype.invalidateBuffers = function () {
        for (var i = 0; i < 8; ++i)
            this.invalid[i] = true;
    };
    /**
     *
     * @param data
     * @param dataPerVertex
     * @private
     */
    VertexData.prototype.setData = function (data) {
        if (this.data && this.data.length != data.length)
            this.disposeBuffers();
        else
            this.invalidateBuffers();
        this.data = data;
    };
    /**
     * //TODO
     *
     * @param event
     * @private
     */
    VertexData.prototype._onVerticesUpdated = function (event) {
        var dataType = this._subGeometry.concatenateArrays ? SubGeometryBase.VERTEX_DATA : event.dataType;
        if (dataType == this._dataType)
            this._dataDirty = true;
    };
    return VertexData;
})();
module.exports = VertexData;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1zdGFnZWdsL2xpYi9wb29sL3ZlcnRleGRhdGEudHMiXSwibmFtZXMiOlsiVmVydGV4RGF0YSIsIlZlcnRleERhdGEuY29uc3RydWN0b3IiLCJWZXJ0ZXhEYXRhLnVwZGF0ZURhdGEiLCJWZXJ0ZXhEYXRhLmRpc3Bvc2UiLCJWZXJ0ZXhEYXRhLmRpc3Bvc2VCdWZmZXJzIiwiVmVydGV4RGF0YS5pbnZhbGlkYXRlQnVmZmVycyIsIlZlcnRleERhdGEuc2V0RGF0YSIsIlZlcnRleERhdGEuX29uVmVydGljZXNVcGRhdGVkIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLGVBQWUsV0FBYyx5Q0FBeUMsQ0FBQyxDQUFDO0FBQy9FLElBQU8sZ0JBQWdCLFdBQWMsNENBQTRDLENBQUMsQ0FBQztBQUtuRixBQUdBOztHQURHO0lBQ0csVUFBVTtJQWlCZkEsU0FqQktBLFVBQVVBLENBaUJIQSxXQUEyQkEsRUFBRUEsUUFBZUE7UUFqQnpEQyxpQkEwSENBO1FBckhRQSxlQUFVQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUVuQkEsWUFBT0EsR0FBa0JBLElBQUlBLEtBQUtBLENBQVVBLENBQUNBLENBQUNBLENBQUNBO1FBRS9DQSxZQUFPQSxHQUF3QkEsSUFBSUEsS0FBS0EsQ0FBZ0JBLENBQUNBLENBQUNBLENBQUNBO1FBRTNEQSxhQUFRQSxHQUFxQkEsSUFBSUEsS0FBS0EsQ0FBYUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFRNURBLElBQUlBLENBQUNBLFlBQVlBLEdBQUdBLFdBQVdBLENBQUNBO1FBQ2hDQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUUxQkEsSUFBSUEsQ0FBQ0EsMEJBQTBCQSxHQUFHQSxVQUFDQSxLQUFzQkEsSUFBS0EsT0FBQUEsS0FBSUEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxLQUFLQSxDQUFDQSxFQUE5QkEsQ0FBOEJBLENBQUNBO1FBQzdGQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxnQkFBZ0JBLENBQUNBLGdCQUFn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RUROOzs7OztPQUtHQTtJQUNLQSx1Q0FBa0JBLEdBQTFCQSxVQUEyQkEsS0FBc0JBO1FBRWhETyxJQUFJQSxRQUFRQSxHQUFVQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxpQkFBaUJBLEdBQUVBLGVBQWVBLENBQUNBLFdBQVdBLEdBQUdBLEtBQUtBLENBQUNBLFFBQVFBLENBQUNBO1FBRXhHQSxFQUFFQSxDQUFDQSxDQUFDQSxRQUFRQSxJQUFJQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQTtZQUM5QkEsSUFBSUEsQ0FBQ0EsVUFBVUEsR0FBR0EsSUFBSUEsQ0FBQ0E7SUFDekJBLENBQUNBO0lBQ0ZQLGlCQUFDQTtBQUFEQSxDQTFIQSxBQTBIQ0EsSUFBQTtBQUVELEFBQW9CLGlCQUFYLFVBQVUsQ0FBQyIsImZpbGUiOiJwb29sL1ZlcnRleERhdGEuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFN1Ykdlb21ldHJ5QmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Jhc2UvU3ViR2VvbWV0cnlCYXNlXCIpO1xuaW1wb3J0IFN1Ykdlb21ldHJ5RXZlbnRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9ldmVudHMvU3ViR2VvbWV0cnlFdmVudFwiKTtcblxuaW1wb3J0IElDb250ZXh0R0xcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL0lDb250ZXh0R0xcIik7XG5pbXBvcnQgSVZlcnRleEJ1ZmZlclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvSVZlcnRleEJ1ZmZlclwiKTtcblxuLyoqXG4gKlxuICovXG5jbGFzcyBWZXJ0ZXhEYXRhXG57XG5cdHByaXZhdGUgX29uVmVydGljZXNVcGRhdGVkRGVsZWdhdGU6KGV2ZW50OlN1Ykdlb21ldHJ5RXZlbnQpID0+IHZvaWQ7XG5cdHByaXZhdGUgX3N1Ykdlb21ldHJ5OlN1Ykdlb21ldHJ5QmFzZTtcblx0cHJpdmF0ZSBfZGF0YVR5cGU6c3RyaW5nO1xuXHRwcml2YXRlIF9kYXRhRGlydHkgPSB0cnVlO1xuXG5cdHB1YmxpYyBpbnZhbGlkOkFycmF5PGJvb2xlYW4+ID0gbmV3IEFycmF5PGJvb2xlYW4+KDgpO1xuXG5cdHB1YmxpYyBidWZmZXJzOkFycmF5PElWZXJ0ZXhCdWZmZXI+ID0gbmV3IEFycmF5PElWZXJ0ZXhCdWZmZXI+KDgpO1xuXG5cdHB1YmxpYyBjb250ZXh0czpBcnJheTxJQ29udGV4dEdMPiA9IG5ldyBBcnJheTxJQ29udGV4dEdMPig4KTtcblxuXHRwdWJsaWMgZGF0YTpBcnJheTxudW1iZXI+O1xuXG5cdHB1YmxpYyBkYXRhUGVyVmVydGV4Om51bWJlcjtcblxuXHRjb25zdHJ1Y3RvcihzdWJHZW9tZXRyeTpTdWJHZW9tZXRyeUJhc2UsIGRhdGFUeXBlOnN0cmluZylcblx0e1xuXHRcdHRoaXMuX3N1Ykdlb21ldHJ5ID0gc3ViR2VvbWV0cnk7XG5cdFx0dGhpcy5fZGF0YVR5cGUgPSBkYXRhVHlwZTtcblxuXHRcdHRoaXMuX29uVmVydGljZXNVcGRhdGVkRGVsZWdhdGUgPSAoZXZlbnQ6U3ViR2VvbWV0cnlFdmVudCkgPT4gdGhpcy5fb25WZXJ0aWNlc1VwZGF0ZWQoZXZlbnQpO1xuXHRcdHRoaXMuX3N1Ykdlb21ldHJ5LmFkZEV2ZW50TGlzdGVuZXIoU3ViR2VvbWV0cnlFdmVudC5WRVJUSUNFU19VUERBVEVELCB0aGlzLl9vblZlcnRpY2VzVXBkYXRlZERlbGVnYXRlKTtcblx0fVxuXG5cdHB1YmxpYyB1cGRhdGVEYXRhKG9yaWdpbmFsSW5kaWNlczpBcnJheTxudW1iZXI+ID0gbnVsbCwgaW5kZXhNYXBwaW5nczpBcnJheTxudW1iZXI+ID0gbnVsbClcblx0e1xuXHRcdGlmICh0aGlzLl9kYXRhRGlydHkpIHtcblx0XHRcdHRoaXMuX2RhdGFEaXJ0eSA9IGZhbHNlO1xuXG5cdFx0XHR0aGlzLmRhdGFQZXJWZXJ0ZXggPSB0aGlzLl9zdWJHZW9tZXRyeS5nZXRTdHJpZGUodGhpcy5fZGF0YVR5cGUpO1xuXG5cdFx0XHR2YXIgdmVydGljZXM6QXJyYXk8bnVtYmVyPiA9IHRoaXMuX3N1Ykdlb21ldHJ5W3RoaXMuX2RhdGFUeXBlXTtcblxuXHRcdFx0aWYgKGluZGV4TWFwcGluZ3MgPT0gbnVsbCkge1xuXHRcdFx0XHR0aGlzLnNldERhdGEodmVydGljZXMpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFyIHNwbGl0VmVydHM6QXJyYXk8bnVtYmVyPiA9IG5ldyBBcnJheTxudW1iZXI+KG9yaWdpbmFsSW5kaWNlcy5sZW5ndGgqdGhpcy5kYXRhUGVyVmVydGV4KTtcblx0XHRcdFx0dmFyIG9yaWdpbmFsSW5kZXg6bnVtYmVyO1xuXHRcdFx0XHR2YXIgc3BsaXRJbmRleDpudW1iZXI7XG5cdFx0XHRcdHZhciBpOm51bWJlciA9IDA7XG5cdFx0XHRcdHZhciBqOm51bWJlciA9IDA7XG5cdFx0XHRcdHdoaWxlKGkgPCBvcmlnaW5hbEluZGljZXMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0b3JpZ2luYWxJbmRleCA9IG9yaWdpbmFsSW5kaWNlc1tpXTtcblxuXHRcdFx0XHRcdHNwbGl0SW5kZXggPSBpbmRleE1hcHBpbmdzW29yaWdpbmFsSW5kZXhdKnRoaXMuZGF0YVBlclZlcnRleDtcblx0XHRcdFx0XHRvcmlnaW5hbEluZGV4ICo9IHRoaXMuZGF0YVBlclZlcnRleDtcblxuXHRcdFx0XHRcdGZvciAoaiA9IDA7IGogPCB0aGlzLmRhdGFQZXJWZXJ0ZXg7IGorKylcblx0XHRcdFx0XHRcdHNwbGl0VmVydHNbc3BsaXRJbmRleCArIGpdID0gdmVydGljZXNbb3JpZ2luYWxJbmRleCArIGpdO1xuXG5cdFx0XHRcdFx0aSsrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy5zZXREYXRhKHNwbGl0VmVydHMpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBkaXNwb3NlKClcblx0e1xuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IDg7ICsraSkge1xuXHRcdFx0aWYgKHRoaXMuY29udGV4dHNbaV0pIHtcblx0XHRcdFx0dGhpcy5idWZmZXJzW2ldLmRpc3Bvc2UoKTtcblx0XHRcdFx0dGhpcy5idWZmZXJzW2ldID0gbnVsbDtcblx0XHRcdFx0dGhpcy5jb250ZXh0c1tpXSA9IG51bGw7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRwcml2YXRlIGRpc3Bvc2VCdWZmZXJzKClcblx0e1xuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IDg7ICsraSkge1xuXHRcdFx0aWYgKHRoaXMuYnVmZmVyc1tpXSkge1xuXHRcdFx0XHR0aGlzLmJ1ZmZlcnNbaV0uZGlzcG9zZSgpO1xuXHRcdFx0XHR0aGlzLmJ1ZmZlcnNbaV0gPSBudWxsO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0cHJpdmF0ZSBpbnZhbGlkYXRlQnVmZmVycygpXG5cdHtcblx0XHRmb3IgKHZhciBpOm51bWJlciA9IDA7IGkgPCA4OyArK2kpXG5cdFx0XHR0aGlzLmludmFsaWRbaV0gPSB0cnVlO1xuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqIEBwYXJhbSBkYXRhXG5cdCAqIEBwYXJhbSBkYXRhUGVyVmVydGV4XG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRwcml2YXRlIHNldERhdGEoZGF0YTpBcnJheTxudW1iZXI+KVxuXHR7XG5cdFx0aWYgKHRoaXMuZGF0YSAmJiB0aGlzLmRhdGEubGVuZ3RoICE9IGRhdGEubGVuZ3RoKVxuXHRcdFx0dGhpcy5kaXNwb3NlQnVmZmVycygpO1xuXHRcdGVsc2Vcblx0XHRcdHRoaXMuaW52YWxpZGF0ZUJ1ZmZlcnMoKTtcblxuXHRcdHRoaXMuZGF0YSA9IGRhdGE7XG5cdH1cblxuXHQvKipcblx0ICogLy9UT0RPXG5cdCAqXG5cdCAqIEBwYXJhbSBldmVudFxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0cHJpdmF0ZSBfb25WZXJ0aWNlc1VwZGF0ZWQoZXZlbnQ6U3ViR2VvbWV0cnlFdmVudClcblx0e1xuXHRcdHZhciBkYXRhVHlwZTpzdHJpbmcgPSB0aGlzLl9zdWJHZW9tZXRyeS5jb25jYXRlbmF0ZUFycmF5cz8gU3ViR2VvbWV0cnlCYXNlLlZFUlRFWF9EQVRBIDogZXZlbnQuZGF0YVR5cGU7XG5cblx0XHRpZiAoZGF0YVR5cGUgPT0gdGhpcy5fZGF0YVR5cGUpXG5cdFx0XHR0aGlzLl9kYXRhRGlydHkgPSB0cnVlO1xuXHR9XG59XG5cbmV4cG9ydCA9IFZlcnRleERhdGE7Il19