
import WebGLManager from '../WebGLManager'

export default class Manager extends WebGLManager {

    setUpScene() {
        const back = this.addSceneFromText("ortho");        
        back.addItemFromText("Meme");
        this.postProcessing.addEffectPass("FilmPass");
    }
}