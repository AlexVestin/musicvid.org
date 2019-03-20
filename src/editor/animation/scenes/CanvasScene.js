
import * as THREE from 'three';
import Scene from './Scene'
export default class CanvasScene extends Scene{
    constructor(gui, resolution, remove, moveScene) {
        super(gui, resolution, remove, moveScene)
        this.canvas = document.createElement("canvas",);
        this.canvas.width = resolution.width;
        this.canvas.height = resolution.height;
        this.ctx = this.canvas.getContext("2d");
       
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 20 );
        this.camera.position.z = 1.0;
        this.tex = new THREE.Texture(this.canvas);
        this.tex.minFilter = THREE.LinearFilter;
        this.tex.magFilter = THREE.LinearFilter;
        this.tex.generateMipmaps = false;

        this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2,2), new THREE.MeshBasicMaterial({map: this.tex, transparent: true}));
        this.scene.add(this.mesh);
        
        this.MODAL_REF_NR = 5;
        this.TYPE = "canvas";
        this.folder.name = this.TYPE + " scene";

        this.setUpControls();
    }

    
    update = (time, audioData, shouldIncrement) => {
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);

        this.items.forEach(item =>  {
            this.ctx.save();
            item.update(time, audioData, shouldIncrement);
            this.ctx.restore();
        });    
        
        this.tex.needsUpdate = true;
    }
}