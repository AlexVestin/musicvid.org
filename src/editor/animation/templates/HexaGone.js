
import WebGLManager from '../WebGLManager'

export default class Manager extends WebGLManager {

    setUpScene() {
        const scene = this.addOrthoScene();
        const it0 = scene.addItemFromText("HexaGone");
        this.scenes.push(scene);
    }
}