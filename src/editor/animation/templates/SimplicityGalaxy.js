

import WebGLManager from '../WebGLManager'
export default class Manager extends WebGLManager {
    setUpScene() {
        const scene = this.addOrthoScene();
        scene.addItemFromText("SimplicityGalaxy");
        scene.addItemFromText("SpriteTextMask");
        this.overviewFolder.onResize();
        this.scenes.push(scene);
    }
}