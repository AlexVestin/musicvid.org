
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


    readPixels = () => {
        const {width, height} = this;
        const glContext = this.gl;
        const pixels = new Uint8Array(width * height * 4);
        glContext.readPixels(0,0,width,height, glContext.RGBA, glContext.UNSIGNED_BYTE, pixels);
        return pixels;
    }

    init = ( resolution ) => {
        this.resolution = resolution;
        this.width = resolution.width;
        this.height = resolution.height;
        this.aspect = this.width / this.height;
        this.overviewFolder = this.gui.__folders["Overview"];
        this.layersFolder = this.gui.__folders["Layers"];

        this.externalCtx = this.canvasMountRef.getContext("2d");
        this.internalCanvas = document.createElement("canvas");
        this.internalCanvas.width = this.width;
        this.internalCanvas.height = this.height;
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

    setAudio = (audio) => {
        this.audio = audio;
        this.setFFTSize(this.fftSize);
    }

    setFFTSize = (size) => {
        this.audio.setFFTSize(size);
        this.gui.__folders["Audio"].updateDisplay();
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

    }

    setTime = (time) => {

    }

    setUpScene() {
        console.log("Implement this");
    }

    setUpRenderers = () => {

    }

    update = (time, audioData) => {
      
    }

}