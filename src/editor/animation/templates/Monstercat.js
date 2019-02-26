

import Scene3DOrthoGraphic from '../common/scenes/Scene3DOrthoGraphic'
import Scene3DPerspective from '../common/scenes/Scene3DPerspective'
import WebGLManager from '../WebGLManager'

export default class Monstercat extends WebGLManager {

    setUpScene() {
        const particlesScene = new Scene3DPerspective(this.gui.__folders["Layers"], this.aspect); 
        const spectrumBarsScene = new Scene3DOrthoGraphic(this.gui.__folders["Layers"], this.aspect); 

        particlesScene.camera.position.z = 300;
        particlesScene.camera.updateMatrixWorld();
        this.scenes.push(particlesScene);

        const bars = spectrumBarsScene.addItemFromText("MonsterBars");
        const artistText = spectrumBarsScene.addItemFromText("SpriteText");
        artistText.setText("Artist - Song", 0, -0.125);
        artistText.setUpGUI(this.gui.__folders["Overview"], "Artist text");


        this.scenes.push(spectrumBarsScene);
        bars.setUpGUI(this.gui.__folders["Overview"], "Bars")


        const it1 = particlesScene.addItemFromText("ParticlesSideways");
        it1.setUpGUI(this.gui.__folders["Overview"], "Particles");
        this.gui.__folders["Overview"].onResize();
        
    }

}