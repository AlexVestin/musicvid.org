

import * as THREE from 'three'


export default class WebGLManager {

    constructor(gui) {
        this.fftSize = 16384;
        this.canvasMountRef = gui.canvasMountRef;
        this.modalRef = gui.modalRef;
        this.gui = gui;
        
        this.scenes = [];
        this.audio = null;
        this.inFullScreen = false;
       
        document.body.addEventListener("keydown", (e) => {
            if(e.keyCode === 70) {
                if(!this.inFullScreen) {
                    this.fullscreen(this.canvasMountRef);
                }else {
                    this.exitFullscreen(this.canvasMountRef);
                }
                this.inFullScreen = !this.inFullScreen;
                
            }
        })
    }

    init = ( resolution ) => {
        console.log("res", resolution);
        this.resolution = resolution;
        this.width = resolution.width;
        this.height = resolution.height;
        this.aspect = this.width / this.height;
        this.overviewFolder = this.gui.__folders["Overview"];
        this.layersFolder = this.gui.__folders["Layers"];


        console.log(this.resolution);
        this.setUpRenderers();
        this.setUpScene();
    }

    

    getAllItems = () => {
        const items = [];
        this.scenes.forEach(scene => {
            scene.items.forEach(item => {
                items.push(item.__attribution);
            })
        })
        return items;
    }

    setClear = () => {
        this.renderer.setClearColor(this.clearColor);
        this.renderer.setClearAlpha(this.clearAlpha);
    }

    setAudio = (audio) => {
        this.audio = audio;
        this.setFFTSize(this.fftSize);
    }

    setFFTSize = (size) => {
        this.audio.setFFTSize(size);
        this.gui.__folders["Audio"].updateDisplay();
    }



    setUpRenderers = () => {
        // Set up internal canvas to keep canvas size on screen consistent
        this.internalCanvas = document.createElement("canvas");
        this.internalCanvas.width = this.width;
        this.internalCanvas.height = this.height;
        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, canvas: this.internalCanvas});
        this.renderer.autoClear = false;
        this.externalCtx = this.canvasMountRef.getContext("2d");
        this.renderer.setClearColor('#000000');
        this.renderer.setSize(this.width, this.height);

        this.clearColor = "#000000";
        this.clearAlpha = 1.0;

        this.gui.__folders["Settings"].addColor(this, "clearColor").onChange(this.setClear);
        this.gui.__folders["Settings"].add(this, "clearAlpha", 0, 1, 0.001).onChange(this.setClear);

    }

    exitFullscreen(canvas) {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
    };
    fullscreen(canvas){
        if(canvas.RequestFullScreen){
            canvas.RequestFullScreen();
        }else if(canvas.webkitRequestFullScreen){
            canvas.webkitRequestFullScreen();
        }else if(canvas.mozRequestFullScreen){
            canvas.mozRequestFullScreen();
        }else if(canvas.msRequestFullscreen){
            canvas.msRequestFullscreen();
        }else{
            alert("This browser doesn't supporter fullscreen");
        }
    }

    stop = () => {
        this.externalCtx.clearRect( 0, 0, this.canvasMountRef.width, this.canvasMountRef.height);
        this.scenes.forEach(scene => {
            scene.stop();
        })
        this.renderer.clear();
    }

    setUpScene() {
        console.log("Implement this");
    }

    update = (time, audioData) => {
        this.renderer.clear();
        this.scenes.forEach(scene => {
            scene.update(time, audioData);
            this.renderer.render(scene.scene, scene.camera);
        });        

        this.externalCtx.drawImage(this.internalCanvas, 0, 0, this.canvasMountRef.width, this.canvasMountRef.height);
    }

}