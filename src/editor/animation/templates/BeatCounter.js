

import WebGLManager from '../WebGLManager'

export default class Manager extends WebGLManager {

    setUpScene() {
        const scene = this.addCanvasScene();
        scene.addItemFromText("BeatCounter");
        this.scenes.push(scene);
    }
}