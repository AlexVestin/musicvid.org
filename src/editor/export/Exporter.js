import * as FileSaver from "file-saver";
import VideoEncoder from "./VideoEncodeWorker";

export default class Exporter {
    constructor(
        config,
        ondone,
        onProgress,
        onError,
        mallocTestResult,
        exportNum
    ) {
        this.onProgress = onProgress;
        this.fps = Number(config.video.fps);
        this.videoBitrate = config.video.bitrate;

        this.videoConfig = config.video;
        this.audioConfig = { duration: config.sound.duration };

        this.onError = onError;
        this.encodedVideoFrames = 0;
        this.width = config.video.width;
        this.height = config.video.height;
        this.sound = config.sound;
        this.fileName = config.fileName || "myVid.mp4";
        this.ondone = ondone;
        this.animationManager = config.animationManager;
        this.time = 0;
        this.frames = [];

        this.presetIdx = config.video.presetIdx;
        this.gui = config.gui.getRoot();

        let duration = config.sound.duration;
        let time = 0;
        this.closed = false;
        this.mallocTestResult = mallocTestResult;
        this.exportNum = exportNum;

        if (config.useCustomTimeRange) {
            time = config.startTime;
            duration = config.endTime;
        }

        this.duration = duration;
        this.__startTime = time;
    }

    prepare = () => {
        this.sound.setEncodeStartTime(this.__startTime);
        this.animationManager.seekTime(this.__startTime);
        this.time = this.__startTime;
    };

    init = (onready) => {
        this.onready = onready;
        this.videoEncoder = new VideoEncoder(
            this.initEncoder,
            this.onError,
            this.mallocTestResult,
            this.exportNum
        );
    };
    initEncoder = () => {
        const videoConfig = {
            w: this.width,
            h: this.height,
            bitrate: this.videoBitrate,
            fps: this.fps,
            presetIdx: this.presetIdx,
            duration: this.duration
        };

        const audioConfig = {
            channels: 2,
            sampleRate: this.sound.sampleRate,
            bitrate: 320000
        };

        this.videoEncoder.init(
            videoConfig,
            audioConfig,
            this.encoderInitialized,
            this.encode
        );
    };

    encoderInitialized = () => {
        this.encoding = true;
        this.encodedVideoFrames = 0;
        this.startTime = performance.now();
        this.onready();
    };

    cancel = () => {
        this.canceled = true;
        this.videoEncoder.close();
    };

    setTime = (startTime) => {
        this.time = startTime;
        this.sound.setEncodeStartTime(startTime);
    };

    encode = () => {
        if (!this.canceled && !this.closed) {
            const videoTs = this.time;
            const audioTs =
                (this.sound.exportFrameIdx * this.sound.exportWindowSize) /
                this.sound.sampleRate;
            if (videoTs >= audioTs) {
                this.encodeAudioFrame();
            } else {
                const audioData = this.sound.getAudioData(this.time);
                Object.keys(this.gui.__automations).forEach((key) => {
                    this.gui.__automations[key].update(this.time, audioData);
                });
                this.animationManager.update(this.time, audioData, true);
                this.time += 1 / this.fps;

                this.encodeVideoFrame();
            }

            this.videoEncoder.sendFrame();

            if (this.encodedVideoFrames % 15 === 0)
                this.onProgress(
                    this.encodedVideoFrames,
                    Math.floor((this.duration - this.__startTime) * this.fps)
                );

            if (this.time > this.duration) {
                this.closed = true;
                this.videoEncoder.close(this.saveBlob);
            }
        }
    };

    encodeVideoFrame = () => {
        this.pixels = this.animationManager.readPixels();
        this.videoEncoder.queueFrame({ type: "video", pixels: this.pixels });
        this.pixels = null;
        this.encodedVideoFrames++;
    };

    encodeAudioFrame = () => {
        const frame = this.sound.getEncodingFrame();
        this.videoEncoder.queueFrame(frame);
    };

    saveBlob = (vid) => {
        const blob = new Blob([vid], { type: "video/mp4" });
        FileSaver.saveAs(blob, this.fileName);
        this.ondone(
            blob,
            this.fileName,
            this.videoConfig,
            this.audioConfig,
            performance.now() - this.startTime
        );
    };
}
