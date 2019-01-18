import Layer from "./Layer";


export default class Layers {
    constructor(gui) {
        this.layers = [];
        
        this.layersFolder = gui.addFolder("Layers");
        this.layersFolder.add(this, 'add2DLayer');
        this.layersFolder.add(this, 'add3DLayer');

        this.editElementName(this.layersFolder, "add2DLayer", "Add 2D Layer");
        this.editElementName(this.layersFolder, "add3DLayer", "Add 3D Layer");
        this.name = 0;
    }

    editElementName = (ele, textToMatch, ) => {
        const folder = this.getStyleElement(ele);
        
    }

    getStyleElement = (element) => {
        return element.domElement.childNodes[0].childNodes[0];
    }

    add2DLayer = () => { 
        this.name++;
        let item = this.layersFolder.addFolder("2D Layer: " + this.name);
        this.layers.push(new Layer(item, this.name));
    };

    add3DLayer = () => { 
        this.name++;
        let item = this.layersFolder.addFolder("3D Layer: " + this.name);
        this.layers.push(new Layer(item, this.name));
    };
}