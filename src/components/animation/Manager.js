import * as THREE from 'three'

export default class Manager {

    constructor(gui, canvasRef, resolution) {
        this.canvasMountRef = canvasRef;
        this.gui = gui;
        this.width = resolution.width;
        this.height = resolution.height;
        this.setUpRenderers();
        this.setUpScene();
    }

    setUpScene = () => {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, this.width/this.height, 0.1, 1000 );

        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        this.cube = new THREE.Mesh( geometry, material );
        this.scene.add( this.cube );

        this.camera.position.z = 5;
    }
    setUpRenderers = () => {
        // Set up internal canvas to keep canvas size on screen consistent
        this.internalCanvas = document.createElement("canvas");
        this.internalCanvas.width = this.width;
        this.internalCanvas.height = this.height;
        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, canvas: this.internalCanvas});
        

        this.externalCtx = this.canvasMountRef.getContext("2d");
        this.renderer.setClearColor('#000000');
        this.renderer.setSize(this.width, this.height);
    }

    avg  = (arr) => {
        let avg = 0;
        for(var i = 0; i < arr.length; i ++) {
            avg+=arr[i];
        }
        return avg / arr.length;
    }

    update = (time, audioData) => {
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
        const s = this.avg(audioData.frequencyData);
        this.cube.scale.set(s / 40,s / 40,s /40);


        this.renderer.render( this.scene, this.camera );

        this.externalCtx.drawImage(this.internalCanvas, 0, 0, this.canvasMountRef.width, this.canvasMountRef.height);
    }

}