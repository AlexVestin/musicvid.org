//import WasmVideoEncoder from './WasmVideoEncoder'
import { setSnackbarMessage } from "../../fredux/actions/message";
import { app } from "backend/firebase";
import { v4 as uuid } from "uuid";
import browser from "browser-detect";

export default class VideoEncoder {
    constructor(onload, onerror, mallocTestResult, exportNum) {
        // in the public folder
        this.onerror = onerror;
        this.mallocTestResult = mallocTestResult;
        this.exportNum = exportNum;

        this.worker = new Worker("workers/encodeworkers.js");
        this.worker.onmessage = this.onmessage;

        this.onload = onload;
        this.isWorker = true;

        this.frames = [];
        this.buffer = new Uint8Array();
        this.encoding = false;
        this.awaitingFile = false;

        this.videoConfig = {};
        this.audioConfig = {};
        this.encodedFrames = 0;

        this.dateStarted = "";
    }

    init = (videoConfig, audioConfig, oninit, getFrame) => {
        this.videoConfig = videoConfig;
        this.audioConfig = audioConfig;
        const sweTime = new Date().toLocaleString("sv-SE", {
            timeZone: "Europe/Stockholm"
        });

        this.dateStarted = sweTime;

        this.worker.postMessage({
            action: "init",
            data: { audioConfig, videoConfig }
        });
        this.oninit = oninit;
        this.getFrame = getFrame;
        this.closed = false;
    };

    float32Concat(first, second) {
        var firstLength = first.length,
            result = new Float32Array(firstLength + second.length);

        result.set(first);
        result.set(second, firstLength);
        return result;
    }

    sendFrame = () => {
        this.encoding = true;
        const frame = this.frames.pop();
        if (frame && !this.closed) {
            if (frame.type === "audio") {
                this.worker.postMessage({
                    action: frame.type,
                    data: frame.left.length
                });
                const buf = this.float32Concat(frame.left, frame.right);
                this.worker.postMessage(buf, [buf.buffer]);
            } else {
                this.worker.postMessage({ action: frame.type });
                this.worker.postMessage(frame.pixels, [frame.pixels.buffer]);
            }
        }

        this.encodedFrames++;
    };

    queueFrame = (frame) => {
        this.frames.push(frame);
    };

    close = (onsuccess) => {
        this.closed = true;
        this.onsuccess = onsuccess;
        setTimeout((e) => this.worker.postMessage({ action: "close" }), 500);
    };

    onmessage = (e) => {
        const { data } = e;
        if (this.awaitingFile) {
            this.awaitingFile = false;
            if (this.onsuccess) this.onsuccess(data);
        }

        switch (data.action) {
            case "error": {
                setSnackbarMessage(
                    data.errTitle + "-" + data.errMsg,
                    "error",
                    100000000
                );
                const errorId = uuid();
                const time = Date.now();

                const errObj = {
                    id: errorId,
                    errTitle: data.errTitle,
                    errMsg: data.errMsg,
                    log: data.log
                };
                this.onerror(errObj);

                const errTime = new Date().toLocaleString("sv-SE", {
                    timeZone: "Europe/Stockholm"
                });

                const dataToSend = JSON.parse(
                    JSON.stringify({
                        logVersion: 4,
                        exportNum:
                            this.exportNum === undefined
                                ? "undef"
                                : this.exportNum,
                        mallocTestResult: this.mallocTestResult,
                        exportStartTime: this.dateStarted,
                        errTime: errTime,
                        browser: browser(),
                        version: data.version,
                        platform: navigator.platform,
                        vendor: navigator.platform,
                        cpuClass: navigator.cpuClass,
                        log: data.log,
                        stack: data.stack,
                        time,
                        msg: data.errMsg,
                        title: data.errTitle,
                        duration: this.videoConfig.duraton,
                        bitrate: this.videoConfig.bitrate,
                        video: this.videoConfig,
                        audio: this.audioConfig,
                        mem: navigator.memory,
                        encodedFrame: this.encodedFrames
                    })
                );

                app.firestore()
                    .collection("errors")
                    .doc(errorId)
                    .set(dataToSend)
                    .then(() => {
                        console.log("uploaded error log");
                    })
                    .catch((err) =>
                        console.log(
                            "Failed to upload error log: " + err.message
                        )
                    );
                break;
            }
            case "loaded":
                this.onload();
                break;
            case "initialized":
                this.oninit();
                break;
            case "ready":
                if (!this.closed) {
                    this.getFrame();
                    this.sendFrame();
                }
                break;
            case "return":
                this.awaitingFile = true;
                break;

            default:
        }
    };
}
