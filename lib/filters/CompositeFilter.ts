import { CompositeTask } from './tasks/CompositeTask';

import { FilterBase } from './FilterBase';
import { Image2D } from '../image/Image2D';
import { ContextGLBlendFactor } from '../base/ContextGLBlendFactor';

export class CompositeFilter extends FilterBase {
	private _compositeTask: CompositeTask;

	public get blendDst() {
		return ContextGLBlendFactor.ONE_MINUS_SOURCE_ALPHA;
	}

	public get requireBlend() {
		return false;
	}

	constructor(blendMode: string, exposure: number = 1) {
		super();

		this._compositeTask = new CompositeTask(blendMode, exposure);

		this.addTask(this._compositeTask);
	}

	public get exposure(): number {
		return this._compositeTask.exposure;
	}

	public set exposure(value: number) {
		this._compositeTask.exposure = value;
	}

	public get overlayTexture(): Image2D {
		return this._compositeTask.overlayTexture;
	}

	public set overlayTexture(value: Image2D) {
		this._compositeTask.overlayTexture = value;
	}
}