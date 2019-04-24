

import WebGLManager from '../WebGLManager'

export default class Manager extends WebGLManager {

    setUpScene() {
        const scene = this.addSceneFromText("ortho");
        scene.addItemFromText("Noise");
        this.overviewFolder.onResize();
    }
}