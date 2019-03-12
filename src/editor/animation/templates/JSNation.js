

import OrthographicScene from '../scenes/OrthographicScene'
import PerspectiveScene from '../scenes/PerspectiveScene'
import WebGLManager from '../WebGLManager'

export default class Manager extends WebGLManager {

    setUpScene() {
        this.scenes.push(new OrthographicScene(this.layersFolder, this.resolution));
        this.scenes.push(new PerspectiveScene(this.layersFolder, this.resolution));
        this.scenes.push(new OrthographicScene(this.layersFolder, this.resolution));
        

        const it1 = this.scenes[0].addItemFromText("Background");
        const it2 = this.scenes[1].addItemFromText("Particles");
        const it3 = this.scenes[2].addItemFromText("JSNation");

        it1.setUpGUI(this.gui.__folders["Overview"], "Background");
        it2.setUpGUI(this.gui.__folders["Overview"], "Particles");
        it3.setUpGUI(this.gui.__folders["Overview"], "JSNation");

        this.gui.__folders["Overview"].onResize();
        
    }

}