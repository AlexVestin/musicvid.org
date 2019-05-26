
import * as THREE from "three";
import BaseItem from '../BaseItem'
import { addOrthoMeshControls } from '../AddMeshControls'
import { MeshLineMaterial, MeshLine } from  'three.meshline';
export default class AudioWave extends BaseItem {
    constructor(info) {
        super(info);
        this.name = "Audio Wave";

        this.amplitude = 1.0;
        this.extent = 0.1;
        this.baseStrokeAlpha = 0.25;
        this.startBin = 0; 
        this.endBin = 450;

        this.width  = 0.5;
        this.height = 2;
        this.color = "#FFFFFF";
        this.positionX  = 0;
        this.positionY  = 0.35;
        this.textureScale = 1.0;
        this.aspect = info.width/info.height;
        this.prevArr = [];

        this.targetSize = 1024; 

       
       
        this.scene = info.scene;
        this.scene.remove(this.mesh);
        this.mesh =  new THREE.Mesh();
        this.initLine();
        this.scene.add(this.mesh);
        this.mesh.position.z = 0.1;
        this.mesh.position.y = this.positionY;
        this.taper = "none";
        this.taperFunc = (t) => 1;

        this.setUpFolder();
    }

    dispose = () => {
        this.line.geometry.dispose();
        this.line.material.dispose();
    }

    initLine = () => {
        this.line = new MeshLine();
        this.geometry = new THREE.Geometry();
        for(var i = 0; i < this.targetSize; i++) {
            this.geometry.vertices.push(new THREE.Vector3(i/1024,0,0));
        }

        this.line.setGeometry(this.geometry);

        if(this.material) {
            this.material.dispose();
        }
        
        this.material = new MeshLineMaterial({
            color: new THREE.Color(this.color),
            lineWidth: 0.001,
            transparent: true,
            opacity: 1.0
        });


        this.mesh.geometry  = this.line.geometry;
        this.mesh.material = this.material;

        if(this.lineOpacityController) {
            this.lineOpacityController.object = this.material;
            this.lineWidthController.object = this.material;
        }
        

    }

    setTaperFunc = () => {
        switch (this.taper) {
            case "linear":
                this.taperFunc = function(p) { return 1 - p; };
                break;
            case "middle-out":
                this.taperFunc = function(p) { return 1 - Math.abs(p - 0.5) * 2; };
                break;
            case "wavy":
                this.taperFunc = function(p) { return 2 + Math.sin(50 * p);};
                break;
            case "none":
                this.taperFunc = function(p) { return 1};
                break;
            default:
                console.log("Unknown taper")
        }
    }

    __setUpGUI = (folder) => {
        this.addController(folder, this, "amplitude", 0, 10.0, 0.01);
        this.addController(folder, this, "extent", 0, 2.0, 0.01);
        this.addController(folder, this, "width", 0, 5.0, 0.01);
        this.lineWidthController = this.addController(folder, this.material, "lineWidth", 0, 0.03);
        this.lineOpacityController = this.addController(folder, this.material, "opacity", 0, 1);
        this.addController(folder, this, "taper",  {values: ["linear", "none", "wavy", "middle-out"]}).onChange(this.setTaperFunc);
        this.addController(folder, this, "targetSize",  {values: [64, 128, 256, 512, 1024, 2048, 4096]}).onChange(this.initLine);



        this.addController(folder,this, "color", {color:true}).onChange(() => this.mesh.material.color = new THREE.Color(this.color));
        addOrthoMeshControls(this, this.mesh, folder);
        return this.__addFolder(folder);
    };

    dispose = () => {
        this.mesh.material.dispose();
        this.geometry.dispose();
    }

    update = (time, data) => {
        const audioData = data.timeData;
        const bufferLength = audioData.length;
        this.line.geometry.dispose();
        
        const step = bufferLength / this.targetSize;
        

        const geo = new THREE.Geometry();
        for(var i = 0; i < bufferLength ; i += step) {
            const x = ((i / bufferLength)*2 *this.width) -1 * this.width;
            const amplitude = audioData[i]  * this.amplitude;
            const y = (amplitude * this.extent) / 2;
            geo.vertices.push(new THREE.Vector3(x, y, 0));
        }

        this.line.setGeometry(geo, this.taperFunc);


       this.mesh.geometry.attributes.position.needsUpdate = true;
    };
}
