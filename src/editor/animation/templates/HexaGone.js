
import WebGLManager from '../WebGLManager'

export default class Manager extends WebGLManager {

    setUpScene() {
        const scene = this.addSceneFromText("ortho");
        scene.addItemFromText("HexaGone");
        this.postProcessing.addEffectPass("glitch");
        this.overviewFolder.updateDisplay();

    }
}