

import WebGLManager from '../WebGLManager'
export default class Stars extends WebGLManager {

    setUpScene() {
        this.scenes.push(this.addOrthoScene());
        this.scenes[0].addItemFromText("StarField");
        this.overviewFolder.onResize();
    }
}