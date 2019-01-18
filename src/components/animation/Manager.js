import * as THREE from 'three'

export default class Manager {

    constructor(canvasRef, resolution) {
        this.canvasMountRef = canvasRef;

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

        console.log(this.width, this.height, this.canvasMountRef.width, this.canvasMountRef.height);
    }

    update = (time, audioData) => {
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;

        this.renderer.render( this.scene, this.camera );

        this.externalCtx.drawImage(this.internalCanvas, 0, 0, this.canvasMountRef.width, this.canvasMountRef.height);
    }

}