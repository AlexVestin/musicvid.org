

import Scene3DOrthoGraphic from '../common/scenes/Scene3DOrthoGraphic'
import Scene3DPerspective from '../common/scenes/Scene3DPerspective'
import WebGLManager from '../WebGLManager'

export default class Manager extends WebGLManager {

    setUpScene() {
        this.scenes.push(new Scene3DOrthoGraphic(this.gui.__folders["Layers"],this.resolution));
        this.scenes.push(new Scene3DPerspective(this.gui.__folders["Layers"], this.resolution));
        this.scenes.push(new Scene3DOrthoGraphic(this.gui.__folders["Layers"], this.resolution));
        

        const it1 = this.scenes[0].addItemFromText("Background");
        const it2 = this.scenes[1].addItemFromText("Particles");
        const it3 = this.scenes[2].addItemFromText("JSNation");

        it1.setUpGUI(this.gui.__folders["Overview"], "Background");
        it2.setUpGUI(this.gui.__folders["Overview"], "Particles");
        it3.setUpGUI(this.gui.__folders["Overview"], "JSNation");

        this.gui.__folders["Overview"].onResize();
        
    }

}