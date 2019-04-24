let proc, audioProc;

function log(text, fs) {
    fs.appendFile("log.txt", text, function(err) {});
}

let local = true;
let lastEncodedFrame;

window.__init = config => {
    if (local) {
        const { spawn } = require("child_process");
        const { width, height, fps, name = "outmp3.mp4", sound, preset } = config;

        //const proc = spawn('ffmpeg', ['-pix_fmt', 'rgb32', '-s:v', '1280x720', '-f', 'rawvideo', '-i', 'pipe:0', '-framerate', '30', 'output.mp4']);
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
            "libx264",
            //'-preset',
            //`${preset}`,
            `output.h264`
        ];
        alert(args.join(" "));
        proc = spawn("ffmpeg", args);

        proc.stdout.on("data", function(data) {});

        proc.stderr.on("data", function(data) {
            const msg = data.toString();
            if (msg.includes("fps")) {
                lastEncodedFrame = Number(
                    msg
                        .split("fps")[0]
                        .split("frame=")[1]
                        .replace(/\s/g, "")
                );
            }
        });

        proc.on("exit", function() {
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
                `${name}`
            ];
            let msg = "";

            audioProc = spawn("ffmpeg", args2);
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

            audioProc.on("exit", function() {
                alert("Encoding done, check folder for file");
                try {
                    fs.unlinkSync("output.h264");
                } catch (err) {
                    alert(err);
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

    if (frameIdx > lastEncodedFrame + 5) {
        return 100;
    }

    return 0;
};

window.__addAudio = audio => {};

window.__close = () => {
    proc.stdin.end();
};

//<script src="export.js"></script>
