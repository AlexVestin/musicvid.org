
import WebGLManager from '../WebGLManager'

export default class Manager extends WebGLManager {

    setUpScene() {
        const back = this.addSceneFromText("ortho");
        const part = this.addSceneFromText("perspective");
        const jsna = this.addSceneFromText("canvas");
        back.addItemFromText("Background");
        part.addItemFromText("Particles");
        part.addItemFromText("ParticleLines");
        jsna.addItemFromText("JSNation2");
        this.postProcessing.addEffectPass("FilmPass");
    }
}