function exitFullscreen() {
    if(document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.mozFullScreenElement) {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
    }
    
}
function fullscreen(canvas) {
    if (canvas.RequestFullScreen) {
        canvas.RequestFullScreen();
    } else if (canvas.webkitRequestFullScreen) {
        canvas.webkitRequestFullScreen();
    } else if (canvas.mozRequestFullScreen) {
        canvas.mozRequestFullScreen();
    } else if (canvas.msRequestFullscreen) {
        canvas.msRequestFullscreen();
    } else {
        alert("This browser doesn't supporter fullscreen");
    }
}

function fs_status() {
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement)
        return true;
    else
        return false;
}

export function setUpFullscreenControls(gui) {
    const canvas = gui.canvasMountRef; 

    const width = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;

    const height = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;
    document.body.addEventListener("keyup", e => {
        if (e.keyCode === 70) {
            if (!fs_status(canvas)) {
                fullscreen(canvas);
                gui.toggleFullscreen(true, width, height);
            }else {
                try {
                    exitFullscreen()
                    gui.toggleFullscreen(false);
                }catch(err) {
                    console.log("Error exiting fullscreen");
                }
            }
        }
    });

    document.addEventListener("fullscreenchange", function () {
        const s = fs_status();
        if(!s) {
            gui.toggleFullscreen(false);
        }
    }, false);
    document.addEventListener("mozfullscreenchange", function () {
        const s = fs_status();
        if(!s) {
            gui.toggleFullscreen(false);
        }
    }, false);
    document.addEventListener("webkitfullscreenchange", function () {
        const s = fs_status();
        if(!s) {
            gui.toggleFullscreen(false);
        }
    }, false);

}
