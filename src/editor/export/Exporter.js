
import * as FileSaver from "file-saver";
import VideoEncoder from './VideoEncodeWorker'

export default class Exporter {
    constructor(config, onready, ondone) {

        this.fps                = Number(config.video.fps);
        this.videoBitrate       = config.video.bitrate;
        this.duration           = config.sound.duration;
        this.encodedVideoFrames = 0;
        this.width              = config.video.width;
        this.height             = config.video.height;
        this.sound              = config.sound;
        this.onready            = onready;
        this.fileName           = config.fileName || "myVid.mp4";
        this.ondone             = ondone;
        this.animationManager   = config.animationManager;
        this.time               = 0;
        this.frames             = [];
        this.videoEncoder       = new VideoEncoder(this.initEncoder);
    }


    initEncoder = () => {
        const videoConfig = {
            w: this.width,
            h: this.height,
            bitrate: this.videoBitrate,
            fps: this.fps,
            presetIdx: 6,
        }

        const audioConfig = {
            channels: 2,
            sampleRate: this.sound.sampleRate,
            bitrate: 320000
        }

        this.videoEncoder.init(videoConfig, audioConfig, this.encoderInitialized, this.encode)
    }

    encoderInitialized = () => {
        this.encoding = true;
        this.encodedVideoFrames = 0;
        this.startTime = performance.now()
        this.onready();
    }

    encode = () => {
        const videoTs = (this.encodedVideoFrames / this.fps );
        const audioTs = (this.sound.exportFrameIdx * this.sound.exportWindowSize) / this.sound.sampleRate; 
        if( videoTs >= audioTs ) {
            
            this.encodeAudioFrame();
        }else{
            const audioData = this.sound.getAudioData(this.time);
            this.animationManager.update(this.time, audioData);
            this.time += 1 / this.fps;
            this.encodeVideoFrame();
        }

        this.videoEncoder.sendFrame();

        console.log(this.encodedVideoFrames, this.duration, this.fps, Math.floor(this.duration * this.fps))
        if(this.encodedVideoFrames >= Math.floor(this.duration * this.fps)) {
            this.videoEncoder.close(this.saveBlob);
        }
    }

    encodeVideoFrame = () => {
        const { width, height } = this;
        const glContext = this.animationManager.renderer.getContext();
        this.pixels = new Uint8Array(width * height * 4);
        glContext.readPixels(0,0,width,height, glContext.RGBA, glContext.UNSIGNED_BYTE, this.pixels);
        this.videoEncoder.queueFrame( {type: "video", pixels: this.pixels} );
        this.pixels = null;
        this.encodedVideoFrames++;
    }

    encodeAudioFrame = () => {
        const frame = this.sound.getEncodingFrame();
        this.videoEncoder.queueFrame(frame);
    }

    saveBlob = (vid) => {
        FileSaver.saveAs(new Blob([vid], { type: 'video/mp4' }), this.fileName);
        this.ondone();
    }    
}