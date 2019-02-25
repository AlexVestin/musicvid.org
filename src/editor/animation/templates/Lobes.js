

import Scene3DOrthoGraphic from '../common/scenes/Scene3DOrthoGraphic'
import WebGLManager from '../WebGLManager'

export default class Manager extends WebGLManager {

    setUpScene() {
        this.setFFTSize(2048);
        this.scenes.push(new Scene3DOrthoGraphic(this.gui.__folders["Layers"],this.aspect));
        
        const it0 = this.scenes[0].addItemFromText("SideLobes");
        it0.setUpGUI(this.gui.__folders["Overview"], "SideLobes");
        this.gui.__folders["Overview"].onResize();
        
    }

}