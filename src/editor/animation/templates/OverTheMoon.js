

import WebGLManager from '../WebGLManager'

export default class Manager extends WebGLManager {

    setUpScene() {
        const scene = this.addOrthoScene();
        scene.addItemFromText("StarField");
        scene.addItemFromText("OverTheMoon");
        this.overviewFolder.onResize();
        this.scenes.push(scene);
    }
}