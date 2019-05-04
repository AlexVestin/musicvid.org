
import WebGLManager from '../WebGLManager'

export default class Manager extends WebGLManager {

    setUpScene() {
        const back = this.addSceneFromText("ortho");
        const part = this.addSceneFromText("perspective");
        const jsna = this.addSceneFromText("canvas");
        
        back.addItemFromText("Background");
        part.addItemFromText("Particles");
        jsna.addItemFromText("JSNation");
        
        
        this.postProcessing.addEffectPass("FilmPass");
    }
}