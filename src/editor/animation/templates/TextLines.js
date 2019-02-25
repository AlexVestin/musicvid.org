

import WebGLManager from '../WebGLManager'
import Scene3DPerspective from '../common/scenes/Scene3DPerspective';
import { Group } from 'three'

export default class Manager extends WebGLManager {

    setUpScene() {
        this.setFFTSize(2048);
        this.scenes.push(new Scene3DPerspective(this.gui.__folders["Layers"],this.aspect));
        
        const it0 = this.scenes[0].addItemFromText("TextLines");
        it0.mesh.position.y = 30;
        const it1 = this.scenes[0].addItemFromText("TextLines");
        it1.text = "Song"; 
        it1.mesh.position.y = -20;
        it0.setUpGUI(this.gui.__folders["Overview"], "TextLines");
        it1.setUpGUI(this.gui.__folders["Overview"], "TextLines");
        
        this.gui.__folders["Overview"].onResize();
        
    }

}