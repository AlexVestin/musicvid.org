import SerializableObject from '../../SerializableObject'
export default class Pass  extends SerializableObject {
    constructor(config) {
        super();
        this.TYPE = "CHANGE THIS IN PASS.JS";
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
        this.addController(folder, folder, "name").name("Item name");
        this.addController(folder, this, "enabled");
        this.addController(folder, this, "clear");
        this.addController(folder, this, "needsSwap");
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
    play = (t) => {}
    stop = () => {}
    seekTime = () => {}

    setSize(width, height) { }

    render(renderer, writeBuffer, readBuffer, delta, maskActive) {
        console.error('THREE.Pass: .render() must be implemented in derived pass.');
    }
};

