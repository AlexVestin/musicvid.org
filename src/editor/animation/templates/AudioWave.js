

import Scene3DOrthoGraphic from '../common/scenes/Scene3DOrthoGraphic'
import WebGLManager from '../WebGLManager'

export default class Manager extends WebGLManager {

    setUpScene() {
        this.fftSize = 2048;
        this.scenes.push(new Scene3DOrthoGraphic(this.gui.__folders["Layers"],this.aspect));
        
        const it0 = this.scenes[0].addItemFromText("Background");
        const it1 = this.scenes[0].addItemFromText("TimeRep");
        const it2 = this.scenes[0].addItemFromText("SpriteText");
        const it3 = this.scenes[0].addItemFromText("SpriteText");
        it2.mesh.position.y = 0.70;
        it2.text = "Artist";
        it2.font = "Verdana";
        
        it3.mesh.position.y = 0.55;
        it3.fontSize  = 70;
        it3.text = "Song";
        it3.font = "Verdana";
        
        it2.updateText();
        it3.updateText();
        it2.folder.updateDisplay();
        it3.folder.updateDisplay();


        it0.setUpGUI(this.gui.__folders["Overview"], "Background");
        it1.setUpGUI(this.gui.__folders["Overview"], "TimeRep");
        it2.setUpGUI(this.gui.__folders["Overview"], "SpriteText");
        it3.setUpGUI(this.gui.__folders["Overview"], "SpriteText2");
    
        this.gui.__folders["Overview"].onResize();
        
    }

}