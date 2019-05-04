

export default class Pass  {
    constructor(config) {
        this.TYPE = "effect";
        this.name = "pass";
        this.isScene =  false;
        this.__automations = [];
            // if set to true, the pass is processed by the composer
        this.enabled = true;

        // if set to true, the pass indicates to swap read and write buffer after rendering
        this.needsSwap = true;

        // if set to true, the pass clears its buffer before rendering
        this.clear = false;

        // if set to true, the result of the pass is rendered to screen. This is set automatically by EffectComposer.
        this.renderToScreen = false;

        this.__objectsToSerialize = [];
    }

    removeMe = () => {
        console.log("remove")
    }

    addBasicControls = (folder) => {
        folder.add(this, "enabled");
        folder.add(this, "clear");
        folder.add(this, "needsSwap");
    }

    setUpGUI = (gui) => {
        this.folder = gui.addFolder(this.name, true, true);
        this.folder.upFunction = () => this.__moveItem({up: true, scene: this});
        this.folder.downFunction = () => this.__moveItem({up: false, scene: this});
        this.addBasicControls(this.folder);
        this.__setUpGUI(this.folder);
        this.folder.add(this, "removeMe").name("Remove");
    }
    __setUpGUI = () => {};
    update = () => {}

    stop = ( ) => {}

    setSize(width, height) { }

    render(renderer, writeBuffer, readBuffer, delta, maskActive) {
        console.error('THREE.Pass: .render() must be implemented in derived pass.');
    }
};

