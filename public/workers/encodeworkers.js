let script =
    typeof Atomics === "undefined" && true
        ? "WasmEncoder.js"
        : "WasmEncoder1t.js";

const exportVersion = script === "WasmEncoder.js" ? "sequential" : "threaded";
//script = "WasmEncoder.js";
importScripts(script);

let Module = {};
Module["mainScriptUrlOrBlob"] = script;
try {
    WasmEncoder(Module);
} catch (err) {
    postMessage({
        action: "error",
        errTitle: "Error initializing webassembly",
        errMsg: err.message,
        version: exportVersion
    });
}

let closed = false;
let audioWindowLength = 1152;
const fileType = 1;
Module["onRuntimeInitialized"] = () => {
    postMessage({ action: "loaded" });
};

openVideo = (config) => {
    let { w, h, fps, bitrate, presetIdx, duration } = config;
    if (closed) {
        return;
    }
    try {
        Module._open_video(
            w,
            h,
            fps,
            bitrate,
            presetIdx,
            fileType,
            fileType,
            duration
        );
    } catch (err) {
        closed = true;
        postMessage({
            action: "error",
            errTitle: "Error initializing video",
            errMsg: err.message,
            stack: err.stack,
            log: getLog(),
            version: exportVersion
        });

        console.error("Error occurred while initializing video: ", err.message);
    }
};

let encodeVideo;

addAudioFrame = (buffer) => {
    if (closed) {
        return;
    }
    const left = new Float32Array(buffer.slice(0, audioWindowLength));
    const right = new Float32Array(
        buffer.slice(audioWindowLength, audioWindowLength * 2)
    );

    let left_p = Module._malloc(audioWindowLength * 4);
    let right_p = Module._malloc(audioWindowLength * 4);
    try {
        Module.HEAPF32.set(left, left_p >> 2);
        Module.HEAPF32.set(right, right_p >> 2);
        Module._add_audio_frame(left_p, right_p, audioWindowLength);
    } catch (err) {
        console.error("Error in encoding audio: ", err.message);
        closed = true;
        postMessage({
            action: "error",
            errTitle: "Error adding audio frame",
            errMsg: err.message,
            stack: err.stack,
            log: getLog(),
            version: exportVersion
        });
        return;
    } finally {
        Module._free(left_p);
        Module._free(right_p);
    }

    postMessage({ action: "ready" });
};

openAudio = (config) => {
    const { bitrate, sampleRate } = config;
    if (closed) {
        return;
    }
    try {
        Module._open_audio(sampleRate, 2, bitrate, 2);
    } catch (err) {
        closed = true;
        postMessage({
            action: "error",
            errTitle: "Error initializing audio",
            errMsg: err.message,
            stack: err.stack,
            log: getLog(),
            version: exportVersion
        });
        console.log("Error initializing audio: ", err.message);
    }
};

writeHeader = () => {
    console.log("writing header");
    if (closed) {
        return;
    }
    try {
        Module._write_header();
    } catch (err) {
        closed = true;
        postMessage({
            action: "error",
            errTitle: "Error writing header",
            errMsg: err.message,
            stack: err.stack,
            log: getLog(),
            version: exportVersion
        });
    }
};

close_stream = () => {
    var video_p, size_p, size;
    if (closed) {
        return;
    }
    try {
        video_p = Module._close_stream(size_p);
    } catch (err) {
        console.error("Error closing streams: ", err.message);
        closed = true;
        postMessage({
            action: "error",
            errTitle: "Error closing streams",
            errMsg: err.message,
            stack: err.stack,
            log: getLog(),
            version: exportVersion
        });
    }

    size = Module.HEAP32[size_p >> 2];
    try {
        const buf = new Uint8Array(
            Module.HEAPU8.subarray(video_p, video_p + size)
        );
        return buf;
    } catch (err) {
        postMessage({
            action: "error",
            errTitle:
                "Error copying buffer out of webassembly. This is likely due to a out of memory issue, try exporting with less bitrate, or shorter audio.",
            errMsg: err.message,
            stack: err.stack,
            log: getLog(),
            version: exportVersion
        });
    }
    return;
};
let count = 0;
addVideoFrame = (buffer) => {
    if (closed) {
        return;
    }
    try {
        var encodedBuffer_p = Module._malloc(buffer.length);
        Module.HEAPU8.set(buffer, encodedBuffer_p);
        Module._add_video_frame(encodedBuffer_p);
    } catch (err) {
        let msg = err.message;
        closed = true;
        if (msg.includes("abort(OOM)")) {
            msg =
                "Out of memory. There is a ~2GB limit on output filesize, so make sure to stay below this.";
        }
        postMessage({
            action: "error",
            errTitle: "Error encoding video frame",
            errMsg: msg,
            stack: err.stack,
            log: getLog()
        });
    } finally {
        Module._free(encodedBuffer_p);
    }

    postMessage({ action: "ready" });
};

bytesToString = (uintArr) => {
    let myString = "";
    for (var i = 0; i < uintArr.byteLength; i++) {
        myString += String.fromCharCode(uintArr[i]);
    }
    return myString;
};

getLog = () => {
    let str = "";
    try {
        const size = Module._get_log_size();
        const logPtr = Module._get_log();
        console.log(size, logPtr);
        const arr = new Uint8Array(Module.HEAPU8.buffer, logPtr, size);
        str = bytesToString(arr);
    } catch (err) {
        str = err.message;
    }

    return str;
};

close = () => {
    let stage = 0;
    if (closed) {
        return;
    }
    try {
        let vid = close_stream();
        stage++;
        Module._free_buffer();
        stage++;
        if (vid) {
            postMessage({ action: "return" });
            postMessage(vid, [vid.buffer]);
        }
    } catch (err) {
        closed = true;
        postMessage({
            action: "error",
            errTitle:
                "Error occurred when closing streams, at stage " +
                String(stage),
            errMsg: err.message,
            stack: err.stack,
            log: getLog()
        });
    }

    console.log();
};

onmessage = (e) => {
    const { data } = e;
    if (data.action === undefined) {
        if (encodeVideo) {
            addVideoFrame(data);
        } else {
            addAudioFrame(data);
        }
        return;
    }

    switch (data.action) {
        case "audio":
            encodeVideo = false;
            audioWindowLength = data.data;
            break;
        case "video":
            encodeVideo = true;
            break;
        case "init":
            closed = false;
            openVideo(data.data.videoConfig);
            openAudio(data.data.audioConfig);
            writeHeader();
            postMessage({ action: "initialized" });
            initialized = true;
            break;
        case "addFrame":
            addFrame(data.data);
            break;
        case "close":
            close();
            closed = true;

            break;
        default:
            console.log("unknown command");
    }
};
