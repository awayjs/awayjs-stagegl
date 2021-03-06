import { ITextureBase } from './ITextureBase';

export interface ICubeTexture extends ITextureBase
{
	size: number;

	uploadFromArray(array: Uint8Array | Array<number>, side: number, miplevel?: number, premultiplied?: boolean);

	uploadCompressedTextureFromArray(array: Uint8Array, offset: number, async: boolean, premultiplied?: boolean);
}