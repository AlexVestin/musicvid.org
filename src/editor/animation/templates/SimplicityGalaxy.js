

import Scene3DOrthoGraphic from '../common/scenes/Scene3DOrthoGraphic'
import WebGLManager from '../WebGLManager'

export default class Manager extends WebGLManager {

    setUpScene() {
        const scene = new Scene3DOrthoGraphic(this.gui.__folders["Layers"], this.resolution);
        

        const it0 = scene.addItemFromText("SimplicityGalaxy");
        const it1 = scene.addItemFromText("SpriteTextMask");
        it0.setUpGUI(this.gui.__folders["Overview"], "SimplicityGalaxy");
        it1.setUpGUI(this.gui.__folders["Overview"], "Overlay");
        this.gui.__folders["Overview"].onResize();
        this.scenes.push(scene);
    }

}