export default class MasterSettings {
    constructor(gui) {
        this.fftSize = 1024;
        this.songLength = 300;
        this.layersFolder = gui.addFolder("Settings");
        this.layersFolder.add(this, 'fftSize', [1024, 2048, 4096]);
        this.layersFolder.add(this, 'songLength');
    }
}