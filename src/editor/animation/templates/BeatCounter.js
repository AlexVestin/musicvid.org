

import WebGLManager from '../WebGLManager'

export default class Manager extends WebGLManager {

    setUpScene() {
        const scene = this.addSceneFromText("canvas");
        scene.addItemFromText("BeatCounter");
    }
}