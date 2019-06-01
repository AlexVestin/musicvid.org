
//import WasmVideoEncoder from './WasmVideoEncoder'

export default class Demuxer {
    constructor(onload){
        // in the public folder
        this.worker = new Worker("workers/demuxworker.js")
        this.worker.onmessage = this.onmessage;
        this.onload = onload;
        this.awaitingFrame = false;
        this.extractAudio = 0;
        this.currentFrameId = 0;
    }

    init = (buffer, bufferLength, keepAudio, oninit, onframe) => {
        this.worker.postMessage({action: "init", keepAudio: keepAudio});
        this.worker.postMessage(buffer, [buffer.buffer]);
        this.oninit = oninit;
        this.keepAudio = keepAudio;
        this.onframe = onframe;
    }

    setFrame = (frameId) => {
        if(frameId < 0) {
            frameId = 0;
        }

        this.worker.postMessage({action: "set_frame", value: frameId});
    }


    getFrame = (onframe, frameId) => {
        this.worker.postMessage({action: "get_frame", frameId: this.currentFrameId++});
        this.onframe = onframe;
    }

    close = (onsuccess) => { 
        this.worker.postMessage({action: "close"});
    }   
    
    onmessage = (e) => {
        const { data } = e;

        if(data.action === undefined) {
            if(this.keepAudio && this.extractAudio === 2) {
                this.audioLeft = data;
                this.extractAudio--;
            }else if (this.keepAudio && this.extractAudio === 1) {
                this.setFrame(0);
                this.oninit({ videoInfo: this.videoInfo });
                this.extractAudio--;
            }else {
                this.onframe(data);
   
            }
        }

        switch(data.action){
            case "loaded":
                if(this.onload)
                    this.onload();
                break;
            case "init":
                const { info } = data;
                this.videoInfo = {
                    fps: info[0] / info[1],
                    width: info[2],
                    height: info[3],
                    format: info[4],
                    bitrate: info[5],
                    duration: info[6] / 1000000 // ffmpeg AV_TIMESCALE_SOMETHING
                };
                
                if(this.keepAudio) {
                    this.worker.postMessage( {action: "extract_audio"})
                }else  {
                    this.setFrame(0);
                    this.oninit({videoInfo: this.videoInfo});
                }
                break;
            case "frame_decoded":
                this.awaitedFrameId = data.frameId
                break;
            case "audio_extracted":
                this.bitrate = data.info;
                this.extractAudio = 2; 
                break;
            case "return":
                this.onsuccess(data.data);
                break;
            case "error":
                break;
            default:
                
                
        }
    }
}