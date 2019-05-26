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


export function setUpFullscreenControls(canvas) {
    let inFullcreenMode = false;
    document.body.addEventListener("keyup", e => {
        if (e.keyCode === 70) {
            if (!inFullcreenMode) {
                fullscreen(canvas);
            }else {
                try {
                    exitFullscreen()
                }catch(err) {
                    console.log("Error exiting fullscreen");
                }
            }

            inFullcreenMode = !inFullcreenMode;
        }
    });
}
