


import WebGLManager from '../WebGLManager'

export default class Monstercat extends WebGLManager {

    setUpScene() {
        const particlesScene = this.addSceneFromText("perspective"); 
        const spectrumBarsScene = this.addSceneFromText("canvas"); 
        particlesScene.camera.position.y = 0;
        particlesScene.camera.position.z = 300;
        particlesScene.camera.updateMatrixWorld();
        spectrumBarsScene.addItemFromText("Monstercat2D");

        const image = spectrumBarsScene.addItemFromText("Image2D");
        image.loadNewImage();
        image.positionX = 0.14;
        image.positionY = 0.55;         

        const artistText = spectrumBarsScene.addItemFromText("Text2D");
        const songText = spectrumBarsScene.addItemFromText("Text2D");
        const remixText = spectrumBarsScene.addItemFromText("Text2D");

        const baseFontSize = Math.floor(this.width / 22);
        const margin = (baseFontSize / 1000) * (620 / this.height);
        const baseHeight = this.height === 480 ? 0.59 : 0.62;
        const x = 0.26;

        const ac = artistText.contextSettings; 
        ac.text  ="ARTIST ONE x ARTIST TWO";
        artistText.updateFont();
        artistText.positionX = x;
        artistText.positionY = baseHeight;
        ac.fontSize = baseFontSize;
        ac.textAlign = "left";

        const sc = songText.contextSettings; 
        sc.text  ="TRACKNAME";
        songText.positionX = x;
        songText.positionY = baseHeight + margin;
        sc.fontSize = baseFontSize / 2;
        sc.textAlign = "left";

        const rc = remixText.contextSettings; 
        remixText.text  ="EDIMASTER EDIT";
        remixText.positionX = x;
        remixText.positionY = baseHeight + margin *2;
        rc.fontSize = baseFontSize / 2;
        rc.textAlign = "left";


        artistText.setFolderName("Artist Text");
        songText.setFolderName("Song Text");
        remixText.setFolderName("Remix Text");

        artistText.updateDisplay();
        songText.updateDisplay();
        remixText.updateDisplay();
        particlesScene.addItemFromText("ParticlesSideways");

        this.postProcessing.addEffectPass("GlitchPass");
    }
}