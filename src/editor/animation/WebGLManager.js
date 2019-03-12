

import * as THREE from 'three'
import AttribItem from './items/ortho/Attribution'

export default class WebGLManager {

    constructor(gui) {
        this.fftSize = 16384;
        this.canvasMountRef = gui.canvasMountRef;
        this.modalRef = gui.modalRef;
        this.gui = gui;
        
        this.scenes = [];
        this.audio = null;
        this.inFullScreen = false;

        
       
        document.body.addEventListener("keyup", (e) => {
            if(e.keyCode === 70) {
                if(!this.inFullScreen) {
                    this.fullscreen(this.canvasMountRef);
                }
                
                this.inFullScreen = !this.inFullScreen;
                
            }
        })
    }

    setUpAttrib() {
         // Set up scene for attribution text
         this.attribScene = new THREE.Scene();
         this.attribCamera =  new THREE.OrthographicCamera( -1, 1, 1, -1, 0.1, 10 );
         this.attribCamera.position.z = 1;
         this.attribItem = new AttribItem(this.width, this.height);
         this.attribScene.add(this.attribItem.mesh);
         this.drawAttribution = false;
    }

    init = ( resolution ) => {
        this.resolution = resolution;
        this.width = resolution.width;
        this.height = resolution.height;
        this.aspect = this.width / this.height;
        this.setUpAttrib();
        this.overviewFolder = this.gui.__folders["Overview"];
        this.layersFolder = this.gui.__folders["Layers"];
        
        // Set up internal canvas to keep canvas size on screen consistent
        this.externalCtx = this.canvasMountRef.getContext("2d");
        this.internalCanvas = document.createElement("canvas");
        this.internalCanvas.width = this.width;
        this.internalCanvas.height = this.height;
        this.setUpRenderers();
        this.setUpScene();
    }

    refresh = (ref) => {
        this.canvasMountRef = ref;
        this.externalCtx = ref.getContext("2d");
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

    setTime = (time) => {

    }

    updateAttribution = () => {
        const items = this.getAllItems();
        const names = ["Visuals by:"];
        items.forEach(item => {
            item.authors.forEach(author => {
                if(names.indexOf(author.name) < 0 ) {
                    names.push(author.name);
                }
            })
        })
        
        this.attribItem.setText(names, 0.75, -0.6);
    }

    setUpRenderers = () => {
        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, canvas: this.internalCanvas});
        this.renderer.autoClear = false;
        this.renderer.setClearColor('#000000');
        this.renderer.setSize(this.width, this.height);
        this.clearColor = "#000000";
        this.clearAlpha = 1.0;
        this.gui.__folders["Settings"].addColor(this, "clearColor").onChange(this.setClear);
        this.gui.__folders["Settings"].add(this, "clearAlpha", 0, 1, 0.001).onChange(this.setClear);
        this.gui.__folders["Settings"].add(this, "drawAttribution").onChange(this.updateAttribution);
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

    readPixels = () => {
        const {width, height} = this;
        const glContext = this.renderer.getContext()
        const pixels = new Uint8Array(width * height * 4);
        glContext.readPixels(0,0,width,height, glContext.RGBA, glContext.UNSIGNED_BYTE, pixels);
        return pixels;
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

    update = (time, audioData, shouldIncrement) => {
        this.renderer.clear();        
        this.scenes.forEach(scene => {
            scene.update(time, audioData, shouldIncrement);
            this.renderer.render(scene.scene, scene.camera);
        }); 
        

        if(this.drawAttribution) {
            this.renderer.render(this.attribScene, this.attribCamera);
        }

        this.externalCtx.drawImage(this.internalCanvas, 0, 0, Math.floor(this.canvasMountRef.width), Math.floor(this.canvasMountRef.height));
    }

}