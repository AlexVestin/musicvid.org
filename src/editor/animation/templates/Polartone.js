

import Scene3DOrthoGraphic from '../common/scenes/Scene3DOrthoGraphic'
import WebGLManager from '../WebGLManager'

export default class Manager extends WebGLManager {

    setUpScene() {
        this.fftSize = 2048;
        this.scenes.push(new Scene3DOrthoGraphic(this.gui.__folders["Layers"], this.resolution));
        
        const it1 = this.scenes[0].addItemFromText("Polartone");
        const it2 = this.scenes[0].addItemFromText("SpriteText");

        it1.setUpGUI(this.gui.__folders["Overview"], "Polartone");
        it2.setUpGUI(this.gui.__folders["Overview"], "SpriteText");
        this.gui.__folders["Overview"].onResize();
        
    }

}