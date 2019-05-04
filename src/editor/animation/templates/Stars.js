

import WebGLManager from '../WebGLManager'
export default class Stars extends WebGLManager {

    setUpScene() {
        const scene = this.addSceneFromText("ortho");
        scene.addItemFromText("StarField");
    }
}