 export default class Layer {
    constructor(folder, name) {
        this.folder = folder;
        this.name = String(name);

        folder.add(this, "name").onChange(this.updateName);
        this.items = folder.addFolder("Items");
        this.items.add(this, "addItem");
        this.settings = folder.addFolder("Settings");

        this.config = {title: "hello", d: "sfign"}
        this.settings.add(this.config, "title")
        this.settings.add(this.config, "d")

        this.styleElement = this.getStyleElement(folder);
           
        this.setFolderColor(folder, "#0a0a0a");
        this.setFolderColor(this.items, "#0f0f0f");
        this.setFolderColor(this.settings, "#0f0f0f");
    }

    getStyleElement = (folder) => {
        return folder.domElement.childNodes[0].childNodes[0];
    }

    setFolderColor = (ele, color) => {
       this.getStyleElement(ele).style.backgroundColor = color;
    }

    updateName = (value) => {
        this.styleElement.innerHTML = value;
    }

    addItem = () => {
        console.log("add item")
    }
}