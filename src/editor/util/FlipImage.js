

export function flipArray(pixels, width, height){
    var halfHeight = (height / 2) | 0; // the | 0 keeps the result an int
    var bytesPerRow = width * 4;

    // make a temp buffer to hold one row
    var temp = new Uint8Array(width * 4);
    for (var y = 0; y < halfHeight; ++y) {
        var topOffset = y * bytesPerRow;
        var bottomOffset = (height - y - 1) * bytesPerRow;

        // make copy of a row on the top half
        temp.set(pixels.subarray(topOffset, topOffset + bytesPerRow));
        pixels.copyWithin(
            topOffset,
            bottomOffset,
            bottomOffset + bytesPerRow
        );
        pixels.set(temp, bottomOffset);
    }
    return pixels;
};


function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

export function takeScreenShot(canvas) {
    const scaleCanvas = document.createElement("canvas");
    scaleCanvas.width = 280 * (canvas.width / canvas.height);
    scaleCanvas.height = 280;
    const scaleCtx = scaleCanvas.getContext("2d");
    scaleCtx.drawImage(canvas, 0, 0, scaleCanvas.width, scaleCanvas.height);
    const img = scaleCanvas.toDataURL("image/jpeg", 0.88);
    return dataURLtoBlob(img);
}