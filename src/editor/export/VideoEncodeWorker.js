//import WasmVideoEncoder from './WasmVideoEncoder'

export default class VideoEncoder {
    constructor(onload){

        // in the public folder
        this.worker = new Worker("workers/encodeworkers.js")
        this.worker.onmessage = this.onmessage;
        

        this.onload = onload
        this.isWorker = true

        this.frames = []
        this.buffer = new Uint8Array()
        this.encoding = false
    }

    init = (videoConfig, audioConfig, oninit, getFrame) => {
        this.worker.postMessage({action: "init", data: {audioConfig, videoConfig}})
        this.oninit = oninit
        this.getFrame = getFrame
        this.closed = false 
    }

    float32Concat(first, second){
        var firstLength = first.length, result = new Float32Array(firstLength + second.length);

        result.set(first);
        result.set(second, firstLength); 
        return result;
    }

    sendFrame = () => {
        this.encoding = true
        const frame = this.frames.pop()
        if(frame && !this.closed) {
            
            if(frame.type === "audio") {
                this.worker.postMessage({action: frame.type, data: frame.left.length})
                const buf = this.float32Concat(frame.left, frame.right)
                this.worker.postMessage(buf, [buf.buffer])
            }else {
                this.worker.postMessage({action: frame.type})
                this.worker.postMessage(frame.pixels, [frame.pixels.buffer])
            }   
        }
    }

    queueFrame = (frame) => {
        this.frames.push(frame)
    }

    close = (onsuccess) => {
        this.closed = true;
        this.onsuccess = onsuccess;
        setTimeout(e => this.worker.postMessage({action: "close"}), 500)                        
    }
    
    onmessage = (e) => {
        const { data } = e;
        switch(data.action){
            case "loaded":
                this.onload()
                break;
            case "initialized":
                this.oninit()
                break;
            case "ready":
                if(!this.closed) {
                    this.getFrame()
                    this.sendFrame()
                }
                break;
            case "return":
                if(this.onsuccess)
                    this.onsuccess(data.data)
                break;
            case "error":
                break;
            default:
                
        
        }
    }
}