

import WebGLManager from '../WebGLManager'
export default class Stars extends WebGLManager {

    setUpScene() {
        this.scenes.push(this.addOrthoScene());
        this.scenes.push(this.addOrthoScene());
    
        this.scenes[0].addItemFromText("StarField");
        this.scenes[1].addItemFromText("SpriteTextMask");
        this.overviewFolder.onResize();
    }
}