export default class LocalExporter {
    constructor(config, ondone, onProgress) {
        this.onProgress         = onProgress;
        this.fps                = Number(config.video.fps);
        this.videoBitrate       = config.video.bitrate;
        this.duration           = config.sound.duration;
        this.encodedVideoFrames = 0;
        this.width              = config.video.width;
        this.height             = config.video.height;
        this.sound              = config.sound;
        this.fileName           = config.fileName || "myVid.mp4";
        this.ondone             = ondone;
        this.animationManager   = config.animationManager;
        this.time               = 0;
        this.frames             = [];
        this.presetIdx          = config.video.presetIdx;
        this.gui                = config.gui.getRoot();
        this.canceled = false;

        if(window.__init) {
            window.__init({
                fps: this.fps,
                bitrate: this.videoBitrate,
                width: this.width,
                height: this.height,
                presetIdx: this.presetIdx
            });
        }else {
            alert("init not a ting");
        }
    }

    init = (cb) => {
        this.onready = cb;
        this.encoderInitialized();
    }

    encoderInitialized = () => {
        this.encoding = true;
        this.encodedVideoFrames = 0;
        this.startTime = performance.now()
        this.onready();
    }

    cancel = () => {
        alert("cancel")
        this.canceled = true;
        window.__close();
    }

    encode = () => {
        if(!this.canceled ) {
            const videoTs = (this.encodedVideoFrames / this.fps );
            const audioTs = (this.sound.exportFrameIdx * this.sound.exportWindowSize) / this.sound.sampleRate; 
            if( videoTs >= audioTs ) {
                this.encodeAudioFrame();
            }else{
                const audioData = this.sound.getAudioData(this.time);
                const automations = this.gui.getRoot().__automations;
                automations.forEach(item => {
                    item.update(this.time, audioData);
                    item.apply();
                })

                this.animationManager.update(this.time, audioData, true);
                this.time += 1 / this.fps;
                this.encodeVideoFrame();
            }
        
            if(this.encodedVideoFrames % 15 === 0) 
                this.onProgress(this.encodedVideoFrames, Math.floor(this.duration * this.fps))
    
            if(this.encodedVideoFrames >= Math.floor(this.duration * this.fps)) {
                if(window.__close) {
                    window.__close();
                }else {
                    alert("window.__close ? ")
                }
                
            }


            setTimeout(this.encode, 0);
        }
    }

    encodeVideoFrame = () => {

        
        if(window.__addImage) {
            window.__addImage(this.animationManager.readPixels());
        }else {
            alert("add video? :(")
        }

        this.encodedVideoFrames++;
        
    }


    encodeAudioFrame = () => {
        const frame = this.sound.getEncodingFrame();
        if(window.__addAudio) {
            window.__addAudio(frame); 
        }else {
            //alert("add audio? :(")
        }
    }
}