import BloomPass from './bloompass'
import SepiaShader from '../shaders/sepiashader'
import ShaderPass from './shaderpass';
import ColorShader from '../shaders/colorshader'
import ColorPass from './colorpass'
import CopyShader from '../shaders/copyshader'
import SSAAPass from './ssaapass'
import GlitchPass from './glitchpass'
import HalftonePass from './halftonepass';
import PixelPass from './pixelpass'
import FilmPass from './FilmPass'




const passes = {
    BloomPass: { class: BloomPass },
    GlitchPass: {img: "img/items/HexaGone.png", class: GlitchPass},
    FilmPass: {class: FilmPass}
};

export function loadPassFromText(text) {
    let C = passes[text].class;
    switch(text) {
        case "CopyPass":
            return new C(CopyShader);
        case "GlitchPass":
            return new GlitchPass();
        case "RenderPass":
            return C;
        default:
            return new C();
    }
}

export { passes };

