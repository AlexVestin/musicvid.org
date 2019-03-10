

import CanvasScene from '../common/scenes/CanvasScene'
import PerspectiveScene from '../common/scenes/PerspectiveScene'
import WebGLManager from '../WebGLManager'

export default class Monstercat extends WebGLManager {

    setUpScene() {
        const particlesScene = new PerspectiveScene(this.layersFolder, this.resolution); 
        const spectrumBarsScene = new CanvasScene(this.layersFolder, this.resolution); 
        particlesScene.camera.position.y = 0;
        particlesScene.camera.position.z = 300;
        particlesScene.camera.updateMatrixWorld();
        this.scenes.push(particlesScene);

        const bars = spectrumBarsScene.addItemFromText("Monstercat2D");



        const image = spectrumBarsScene.addItemFromText("Image2D");
        image.loadNewImage();
        image.setUpGUI(this.overviewFolder, "Image");
        image.positionX = 0.14;
        image.positionY = 0.55;         

        const artistText = spectrumBarsScene.addItemFromText("Text2D");
        const songText = spectrumBarsScene.addItemFromText("Text2D");
        const remixText = spectrumBarsScene.addItemFromText("Text2D");

        const baseFontSize = Math.floor(this.width / 22);
        const margin = (baseFontSize / 1000) * (620 / this.height);
        const baseHeight = this.height === 480 ? 0.59 : 0.62;
        const x = 0.26;

        artistText.text  ="ARTIST ONE x ARTIST TWO";
        artistText.updateFont();
        artistText.positionX = x;
        artistText.positionY = baseHeight;
        artistText.fontSize = baseFontSize;
        artistText.textAlign = "left";
        
        
        songText.text  ="TRACKNAME";
        songText.positionX = x;
        songText.positionY = baseHeight + margin;
        songText.fontSize = baseFontSize / 2;
        songText.textAlign = "left";

        remixText.text  ="EDIMASTER EDIT";
        remixText.positionX = x;
        remixText.positionY = baseHeight + margin *2;
        remixText.fontSize = baseFontSize / 2;
        remixText.textAlign = "left";


        artistText.setUpGUI(this.overviewFolder, "Artist text");
        songText.setUpGUI(this.overviewFolder, "Song text");
        remixText.setUpGUI(this.overviewFolder, "Remix Text");

        this.scenes.push(spectrumBarsScene);
        bars.setUpGUI(this.overviewFolder, "Bars")


        const it1 = particlesScene.addItemFromText("ParticlesSideways");
        it1.setUpGUI(this.overviewFolder, "Particles");
        this.overviewFolder.onResize();
    }
}