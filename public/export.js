let proc, audioProc;
let procRunning = false;
let audioProcRunning = false;


function log(text, fs) {
    fs.appendFile("log.txt", text, function(err) {});
}

let local = true;
let lastEncodedFrame;

let output = "";
window.__init = (config) => {
    
    if (local) {
        window.__localExporter = true;
        const { spawn } = require("child_process");
        const { width, height, fps, name = "out.mp4", sound, preset } = config;

        let n = name;
        if(!n.endsWith(".mp4"))
            n += ".mp4"

        const args = [
            "-y",
            "-pix_fmt",
            "bgr32",
            "-s:v",
            `${width}x${height}`,
            "-f",
            "rawvideo",
            "-r",
            `${fps}`,
            "-i",
            "-",
            "-c:v",
            //"h264_nvenc",
            "libx264",
            //'-preset',
            //`${preset}`,
            `output.h264`
        ];
        proc = spawn("ffmpeg", args);
        procRunning = true;
        proc.stdout.on("data", function(data) {});
        proc.stderr.on("data", function(data) {
            const msg = data.toString();
            if (msg.includes("fps")) {
                let part1 =  msg.split("fps")[0];
                if(part1.includes("frame=")) {
                    let part2 = part1.split("frame=")[1];
                    if(part2) {
                        lastEncodedFrame = Number(part2.replace(/\s/g, ""));
                    }
                }
            }

            output += "\n" + msg;
        });

        proc.on("exit", function(code) {
            procRunning = false;
            if(code) {
                window.__onError(code, output);
                
                return;
            } 

            var fs = require("fs");
            let args2 = [
                "-y",
                "-i",
                "output.h264",
                "-f",
                "f32le",
                "-ac",
                "2",
                "-ar",
                `${sound.sampleRate}`,
                "-i",
                "-",
                "-c:v",
                "copy",
                `${n}`
            ];
            let msg = "";

            audioProc = spawn("ffmpeg", args2);
            audioProcRunning = true;
            const ch0 = sound.bufferSource.buffer.getChannelData(0);
            const ch1 = sound.bufferSource.buffer.getChannelData(1);

            const inter = new Float32Array(ch0.length * 2);
            for (var i = 0; i < inter.length; i += 2) {
                inter[i] = ch0[i / 2];
                inter[i + 1] = ch1[i / 2];
            }

            const bytes = new Uint8Array(inter.buffer);
            audioProc.stdin.write(Buffer.from(bytes));
            audioProc.stdin.end();

            audioProc.stdout.on("data", function(data) {
                if (msg === data.toString().split("fps")[0])
                    audioProc.stdin.end();
                msg = data.toString().split("fps")[0];

                log(data.toString(), fs);
            });

            audioProc.stderr.on("data", function(data) {
                log(data.toString(), fs);
            });

            audioProc.on("exit", function(code) {
                audioProcRunning = false;
                if(code) {
                    window.__onError(code, output);
                    return;
                } 
                try {
                    fs.unlinkSync("output.h264");
                } catch (err) {
                    window.__onError(-1, "Failed to delete temporary file output.h264")
                }
            });
        });
    }
};

window.__encodeAudio = sound => {};

window.__addImage = (image, frameIdx) => {
    const buffer = Buffer.from(image);

    if (proc.stdin.writable) {
        proc.stdin.write(buffer);
    } else {
        console.log("Error: process closed");
    }

    if (frameIdx > lastEncodedFrame + 30) {
        console.log("5 Frames ahead", lastEncodedFrame)
        return 100;
    }

    return 0;
};

window.__addAudio = audio => {};

window.__close = () => {
    proc.stdin.end();
};

window.__cancel = () => {
    if(procRunning) {
        proc.kill('SIGINT');    
    }
    if (audioProcRunning) {
        audioProc.kill('SIGINT');
    }
}

//<script src="export.js"></script>
