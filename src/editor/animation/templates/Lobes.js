

import WebGLManager from '../WebGLManager'

export default class Manager extends WebGLManager {

    setUpScene() {
        this.scenes.push(this.addOrthoScene());
        this.scenes[0].addItemFromText("SideLobes");        
    }
}