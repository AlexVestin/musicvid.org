import * as THREE from 'three'
import Demuxer from './OldDemuxer.js'

export default class Video extends THREE.MeshBasicMaterial {
    constructor(item) {
        super() 

        this.video = document.createElement('video'); 
        // this.video.loop = true;
        this.decoder = new Demuxer(this.onDecoderReady);
        this.transparent = true;    
        this.path = "material";
        this.__parent = item;
        this.encoding = false; 
    }

    prepareEncoding = () => {
        this.encoding = true;
        this.initWasmDecoder();
    }

    cancelEncoding = () => {
        this.encoding = true;
        this.initHTMLDecoder();
    }

    initHTMLDecoder = (file) => {
        this.map = new THREE.VideoTexture(this.video);
        this.map.minFilter = THREE.LinearFilter;
        this.map.magFilter = THREE.LinearFilter;
        this.map.format = THREE.RGBFormat;
        this.video.muted = true;
    }

    loadVideo = (file) => {
        var fr = new FileReader()
        this.bytesLoaded = false
        fr.onload = () => {            
            this.__bytes = new Uint8Array(fr.result);
            this.bytesLoaded = true;
            this.decoder.init(this.__bytes, this.__bytes.length, false, this.decoderInitialized, this.onframe);
            this.__bytes = null;
        }

        fr.readAsArrayBuffer(file);
        
        this.video.src = URL.createObjectURL(file); 
        this.initHTMLDecoder(file);
    }

    loadVideoFile() {
        this.folder.getRoot().modalRef.toggleModal(20).then(selected => {
            if(selected) {
                this.loadVideo(selected)
            }
        })
    }

    __setUpGUI = (f) => {
        const folder = f; 
        const i = this.__parent;
        i.addController(folder, this.video, "playbackRate", {min: 0.5, max:4});
        i.addController(folder, this, "loadVideoFile");
        this.folder = f;
    }
 

    convertTimeToFrame = (time) => Math.floor((time*this.__info.fps) - (this.__parent.__startTime * this.__info.fps));

    seekTime = (time, playing) => {
        if(this.decoderReady) {
            const frameId = this.convertTimeToFrame(time);
            this.decoder.setFrame(frameId);
            this.time = time;
        }   
    }

    initWasmDecoder = (info) => {
        this.texData = new Uint8Array(this.__info.width * this.__info.height * 3);
        this.map = new THREE.DataTexture(this.texData, this.__info.width, this.__info.height, THREE.RGBFormat, THREE.UnsignedByteType);
        this.map.flipY = true;
        this.map.needsUpdate = true;
        this.decoderReady = true;
    }   

    decoderInitialized = (info) => {
        this.__info = info.videoInfo;        
    }


    onframe = (frame, shouldUpdate = true) => {
        if( (shouldUpdate && this.playing) || this.encoding) {
            console.log("Updating frame")
            this.texData.set(frame);
            this.map.needsUpdate = true;
        }
    }

    updateMaterial = (time, dt, data) => {
        this.time = time;
        
        if(this.decoderReady && this.encoding) {
            const frameId = this.convertTimeToFrame(time)
            if(frameId >= 0 && frameId < this.__info.fps * this.__info.duration){
                this.decoder.getFrame(this.onframe, frameId);
            }
        }

        if (this.map) {
            this.needsUpdate = true;
            this.map.needsUpdate = true;
        }
        
    }

    stop = () => {
        this.video.pause();
        this.video.currentTime = 0;
        this.playing = false;
        this.__time = 0
    }

    seekTime = (t) => {
        this.video.currentTime = t;
    }


    play = (time) => {
        this.video.play();
        this.__time = time;
        this.playing = true;
    }
}

