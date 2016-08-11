/******************************************************************************
 * Spine Runtimes Software License
 * Version 2.5
 * 
 * Copyright (c) 2013-2016, Esoteric Software
 * All rights reserved.
 * 
 * You are granted a perpetual, non-exclusive, non-sublicensable, and
 * non-transferable license to use, install, execute, and perform the Spine
 * Runtimes software and derivative works solely for personal or internal
 * use. Without the written permission of Esoteric Software (see Section 2 of
 * the Spine Software License Agreement), you may not (a) modify, translate,
 * adapt, or develop new applications using the Spine Runtimes or otherwise
 * create derivative works or improvements of the Spine Runtimes or (b) remove,
 * delete, alter, or obscure any trademarks or any copyright, trademark, patent,
 * or other intellectual property or proprietary rights notices on or in the
 * Software, including any copy thereof. Redistributions in binary or source
 * form must include this license and terms.
 * 
 * THIS SOFTWARE IS PROVIDED BY ESOTERIC SOFTWARE "AS IS" AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
 * EVENT SHALL ESOTERIC SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES, BUSINESS INTERRUPTION, OR LOSS OF
 * USE, DATA, OR PROFITS) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *****************************************************************************/

module spine.webgl {
	export class Texture implements Disposable {
		private _gl: WebGLRenderingContext;
		private _texture: WebGLTexture;
		private _image: HTMLImageElement;
		private _boundUnit = 0;

		constructor (gl: WebGLRenderingContext, image: HTMLImageElement, useMipMaps: boolean = false) {
			this._gl = gl;			
			this._texture = gl.createTexture();
			this._image = image;
			this.update(useMipMaps);
		}

		getImage (): HTMLImageElement {
			return this._image;
		}

		setFilters (minFilter: TextureFilter, magFilter: TextureFilter) {
			let gl = this._gl;
			this.bind();
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
		}

		setWraps (uWrap: TextureWrap, vWrap: TextureWrap) {
			let gl = this._gl;
			this.bind();
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, uWrap);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, vWrap);
		}

		update (useMipMaps: boolean) {
			let gl = this._gl;
			this.bind();
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, useMipMaps? gl.LINEAR_MIPMAP_LINEAR: gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			if (useMipMaps) gl.generateMipmap(gl.TEXTURE_2D);
		}

		bind (unit: number = 0) {
			let gl = this._gl;
			this._boundUnit = unit;
			gl.activeTexture(gl.TEXTURE0 + unit);
			gl.bindTexture(gl.TEXTURE_2D, this._texture);
		}

		unbind () {
			let gl = this._gl;
			gl.activeTexture(gl.TEXTURE0 + this._boundUnit);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}

		dispose () {
			let gl = this._gl;
			gl.deleteTexture(this._texture);
		}

		public static filterFromString (text: string): TextureFilter {
			switch (text.toLowerCase()) {
				case "nearest": return TextureFilter.Nearest;
				case "linear": return TextureFilter.Linear;
				case "mipmap": return TextureFilter.MipMap;
				case "mipmapnearestnearest": return TextureFilter.MipMapNearestNearest;
				case "mipmaplinearnearest": return TextureFilter.MipMapLinearNearest;
				case "mipmapnearestlinear": return TextureFilter.MipMapNearestLinear;
				case "mipmaplinearlinear": return TextureFilter.MipMapLinearLinear;
				default: throw new Error(`Unknown texture filter ${text}`);
			}
		}

		public static wrapFromString (text: string): TextureWrap {
			switch (text.toLowerCase()) {
				case "mirroredtepeat": return TextureWrap.MirroredRepeat;
				case "clamptoedge": return TextureWrap.ClampToEdge;
				case "repeat": return TextureWrap.Repeat;
				default: throw new Error(`Unknown texture wrap ${text}`);
			}
		}
	}

	export enum TextureFilter {
		Nearest = WebGLRenderingContext.NEAREST,
		Linear = WebGLRenderingContext.LINEAR,
		MipMap = WebGLRenderingContext.LINEAR_MIPMAP_LINEAR,
		MipMapNearestNearest = WebGLRenderingContext.NEAREST_MIPMAP_NEAREST,
		MipMapLinearNearest = WebGLRenderingContext.LINEAR_MIPMAP_NEAREST,
		MipMapNearestLinear = WebGLRenderingContext.NEAREST_MIPMAP_LINEAR,
		MipMapLinearLinear = WebGLRenderingContext.LINEAR_MIPMAP_LINEAR
	}

	export enum TextureWrap {
		MirroredRepeat = WebGLRenderingContext.MIRRORED_REPEAT,
		ClampToEdge = WebGLRenderingContext.CLAMP_TO_EDGE,
		Repeat = WebGLRenderingContext.REPEAT
	}
}
