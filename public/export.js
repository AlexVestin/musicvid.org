

let proc;

window.onload = () => {
    alert(":D");
}

let local = true;
window.__init = (config) =>  {
    if(local) {
    
        const { spawn } = require('child_process');
        const {
            width,
            height,
            fps,
            name
        } = config;

        //const proc = spawn('ffmpeg', ['-pix_fmt', 'rgb32', '-s:v', '1280x720', '-f', 'rawvideo', '-i', 'pipe:0', '-framerate', '30', 'output.mp4']);
        const args = ['-y', '-pix_fmt', 'bgr32', '-s:v', `${width}x${height}`, '-f', 'rawvideo', '-r', `${fps}`, '-i', '-',  '-c:v', 'libx264', `output.mp4`]
        alert(args.join(" "))
        proc = spawn('ffmpeg', args);

        proc.stdout.on('data',  function (data) {
            //alert(data.toString());

        });

        proc.stderr.on('data', function (data) {
            //alert(data.toString());
        });

        proc.on('exit', function() {
            nw.App.closeAllWindows()
        })

    }
}

window.__addImage = (image) => {
    const buffer = Buffer.from(image);

    if (proc.stdin.writable) {
        proc.stdin.write(buffer);
    } else {
        console.log("Error: process closed");
    }
 }

window.__addAudio = (audio) => {

}

window.__close = () => {
    proc.stdin.end();
}

//<script src="export.js"></script>