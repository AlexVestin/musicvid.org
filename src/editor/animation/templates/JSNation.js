
import WebGLManager from '../WebGLManager'

export default class Manager extends WebGLManager {

    setUpScene() {
        this.scenes.push(this.addOrthoScene());
        this.scenes.push(this.addPerspectiveScene());
        this.scenes.push(this.addCanvasScene());
        
        this.scenes[0].addItemFromText("Background");
        this.scenes[1].addItemFromText("Particles");
        this.scenes[2].addItemFromText("JSNation");
        
        this.gui.__folders["Overview"].onResize();
        
    }

}