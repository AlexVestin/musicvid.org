importScripts("WasmEncoder.js")

let Module = {}
WasmEncoder(Module)

let useAudio = false

const fileType = 1
Module["onRuntimeInitialized"] = () => { 
    postMessage({action: "loaded"})
};

openVideo = (config) => {
    let { w, h, fps, bitrate, presetIdx } = config
    console.log(presetIdx) 
    Module._open_video(w, h, fps, bitrate, presetIdx, fileType, fileType );
}

let encodeVideo, videoFramesEncoded = 0, videoTimeSum = 0, audioWindowLength = 0 

let debug = false

addAudioFrame = (buffer) => {
    const left = new Float32Array(buffer.slice(0, audioWindowLength));
    const right = new Float32Array(buffer.slice(audioWindowLength, audioWindowLength*2));
    var left_p = Module._malloc(audioWindowLength * 4)
    Module.HEAPF32.set(left, left_p >> 2)
    var right_p = Module._malloc(audioWindowLength * 4)
    Module.HEAPF32.set(right, right_p >> 2)

    Module._add_audio_frame(left_p, right_p, audioWindowLength)
    postMessage({action: "ready"})
}


openAudio = (config) => {
    const { bitrate, sampleRate } = config; 
    try {
      Module._open_audio(sampleRate, 2, bitrate, 2)
    }catch(err) {
      console.log(err)
    }
}

writeHeader = () => {
    Module._write_header();
} 

close_stream = () => {
    var video_p, size_p, size;
    video_p = Module._close_stream(size_p);
    size = Module.HEAP32[size_p >> 2]
    return  new Uint8Array(Module.HEAPU8.subarray(video_p, video_p + size))
}



addVideoFrame = (buffer) => {
    const t = performance.now()
    try {
        var encodedBuffer_p = Module._malloc(buffer.length)
        Module.HEAPU8.set(buffer, encodedBuffer_p)
        Module._add_video_frame(encodedBuffer_p)
    }finally {
        Module._free(encodedBuffer_p)
    }
    //hack to avoid memory leaks
   postMessage(buffer.buffer, [buffer.buffer])
   const delta = performance.now() - t
   videoTimeSum+= delta
   if(videoFramesEncoded++ % 25 === 0 && debug) 
        console.log("Video added, time taken: ", delta, " average: ", videoTimeSum / videoFramesEncoded)
   postMessage({action: "ready"})
}

close = () => {
    let vid = close_stream()
    Module._free_buffer();
    postMessage({action:"return", data: vid.buffer})
}

onmessage = (e) => {
    const { data } = e
    if(data.action === undefined){
        if(encodeVideo) {
            addVideoFrame(data);
        }else {
            addAudioFrame(data);
            //postMessage({action:"ready"})
        }
        return
    }

    switch(data.action) {
        
        case "audio":
            encodeVideo = false;
            audioWindowLength = data.data;
            break;
        case "video":
            encodeVideo = true;
            break;
        case "init":
            openVideo(data.data.videoConfig)
            openAudio(data.data.audioConfig)
            useAudio = true
            writeHeader()
            postMessage({action: "initialized"})
            initialized = true
            break;
        case "addFrame":
            addFrame(data.data)
            break;
        case "close":
            close(data.data)
            break;
        default:
            console.log("unknown command")
    }
}