import * as FileSaver from "file-saver";
import VideoEncoder from "./VideoEncodeWorker";
import VideoModule from "./WasmEncoder1t";

export default class Exporter {
    constructor(config, ondone, onProgress) {
        this.onProgress = onProgress;
        this.fps = Number(config.video.fps);
        this.videoBitrate = config.video.bitrate;

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

        if (config.useCustomTimeRange) {
            time = config.startTime;
            duration = config.endTime;
        }

        this.Module = {};
        this.Module["locateFile"] = (file) => "workers/" + file;

        this.Module["onRuntimeInitialized"] = () => {
            console.log("initialized");
            this.initEncoder();
        };

        this.Module["mainScriptUrlOrBlob"] = "WasmEncoder1t.js";

        VideoModule(this.Module);

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
        console.log("?");
        //this.videoEncoder = new VideoEncoder(this.initEncoder);
    };
    initEncoder = () => {
        try {
            this.Module._open_video(
                this.width,
                this.height,
                this.fps,
                this.videoBitrate,
                this.presetIdx,
                1,
                1
            );

            this.Module._write_header();
        } catch (err) {
            console.error("Error in initializing video: ", err.message);
        }
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

    close_stream = () => {
        var video_p, size_p, size;
        try {
            video_p = this.Module._close_stream(size_p);
        } catch (err) {
            console.error("Error closing streams: ", err.message);
            postMessage({
                action: "error",
                errTitle: "Error closing streams",
                errMsg: err.message
            });
        }

        size = this.Module.HEAP32[size_p >> 2];
        return this.Module.HEAPU8.subarray(video_p, video_p + size);
    };

    encode = () => {
        if (!this.canceled) {
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

            //this.videoEncoder.sendFrame();

            if (this.encodedVideoFrames % 15 === 0)
                this.onProgress(
                    this.encodedVideoFrames,
                    Math.floor((this.duration - this.__startTime) * this.fps)
                );

            if (this.time > this.duration) {
                try {
                    let vid = this.close_stream();
                    this.Module._free_buffer();
                    this.saveBlob(vid.buffer);
                } catch (err) {
                    postMessage({
                        action: "error",
                        errTitle: "Error closing streams",
                        errMsg: err.message
                    });
                }
            } else {
                setTimeout(this.encode, 0);
            }
        }
    };

    encodeVideoFrame = () => {
        const buffer = this.animationManager.readPixels();

        try {
            var encodedBuffer_p = this.Module._malloc(buffer.length);
            this.Module.HEAPU8.set(buffer, encodedBuffer_p);
            this.Module._add_video_frame(encodedBuffer_p);
        } catch (err) {
            console.error("Error encoding video: ", err.message);
        } finally {
            this.Module._free(encodedBuffer_p);
        }

        this.pixels = null;
        this.encodedVideoFrames++;
    };

    encodeAudioFrame = () => {
        const frame = this.sound.getEncodingFrame();
        const audioWindowLength = 1024;

        /*let left_p = this.Module._malloc(audioWindowLength * 4);
        let right_p = this.Module._malloc(audioWindowLength * 4);
        try {
            this.Module.HEAPF32.set(frame.left, left_p >> 2);
            this.Module.HEAPF32.set(frame.right, right_p >> 2);
            this.Module._add_audio_frame(left_p, right_p, audioWindowLength);
        } catch (err) {
            console.error("Error in encoding audio: ", err.message);
            postMessage({
                action: "error",
                errTitle: "Error adding audio frame",
                errMsg: err.message
            });
            return;
        } finally {
            this.Module._free(left_p);
            this.Module._free(right_p);
        }
        //this.videoEncoder.queueFrame(frame);*/
    };

    saveBlob = (vid) => {
        const blob = new Blob([vid], { type: "video/mp4" });
        FileSaver.saveAs(blob, this.fileName);
        this.ondone(blob, this.fileName);
    };
}
