import * as THREE from 'three'
import Demuxer from './OldDemuxer.js'

export default class Video extends THREE.MeshBasicMaterial {
    constructor(item) {
        super() 
        this.decoder = new Demuxer(this.onDecoderReady)
        this.playAudio = false
        this.transparent = true;
        this.map =  new THREE.Texture();
    
        this.path = "material";
        this.__parent = item;
    }

    loadVideo = (file) => {
        var fr = new FileReader()
        this.bytesLoaded = false
        fr.onload = () => {            
            this.__bytes = new Uint8Array(fr.result);
            this.bytesLoaded = true;
            this.decoder.init(this.__bytes, this.__bytes.length, false, this.decoderInitialized, this.onframe);
            this.__bytes = null
        }

        fr.readAsArrayBuffer(file) 

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
        i.addController(folder, this, "loadVideoFile");
        this.folder = f;
    }
 

    convertTimeToFrame = (time) => Math.floor((time*this.__info.fps) - (this.__parent.__startTime * this.__info.fps))

    seekTime = (time, playing) => {
        if(this.decoderReady) {
            const frameId = this.convertTimeToFrame(time)
            this.decoder.setFrame(frameId)
            this.time = time    
        }   
    }

    decoderInitialized = (info) => {
        this.__info = info.videoInfo;        
        this.texData = new Uint8Array(info.videoInfo.width*info.videoInfo.height*3)
        this.map = new THREE.DataTexture(this.texData, this.__info.width, this.__info.height, THREE.RGBFormat, THREE.UnsignedByteType);
        this.map.flipY = true;
        this.map.needsUpdate = true;
        this.decoderReady = true;
    }


    onframe = (frame, shouldUpdate = true) => {
        console.log("on frame", shouldUpdate)
        if(shouldUpdate) {
            this.texData.set(frame);
            this.map.needsUpdate = true;
        }
    }

    updateMaterial = (time) => {
        this.time = time
        if(this.decoderReady) {
            const frameId = this.convertTimeToFrame(time)
            if(frameId >= 0 && frameId < this.__info.fps * this.__info.duration){
                console.log(time, frameId)
                this.decoder.getFrame(this.onframe, frameId)
            }
                
        }
    }

    stop = () => {
        this.__time = 0
        if(this.decoderReady)
            this.decoder.setFrame(0)
    }

    play = (time) => {
        this.__time = time
    }
}

