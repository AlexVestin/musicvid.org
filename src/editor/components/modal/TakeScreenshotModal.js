import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";
import { storage } from 'backend/firebase'
import { Typography } from "@material-ui/core";

const styles = theme => ({
    form: {
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        width: "fit-content"
    },
    formControl: {
        marginTop: theme.spacing(2),
        minWidth: 120
    },
    formControlLabel: {
        marginTop: theme.spacing(1)
    }
});

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

class ScrollDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = { width: 1, height: 1 };

        this.canvasRef = React.createRef();
        this.loaded = false;
        this.scaleCanvas = document.createElement("canvas");
        this.ctx = this.scaleCanvas.getContext("2d");
    }

    upload = () => {
        const img = this.canvasRef.current.toDataURL("image/jpeg", 0.88);
        this.setState({message: "Uploading..."});
        const imgBlob = dataURLtoBlob(img);
        storage.ref().child(this.props.manager.__id).put(imgBlob).then(() => {
            this.setState({message: "Uploaded! closing modal"})
           setTimeout(() => this.props.onSelect(), 1000);
        });
    }

    onLoad = () => {};

    flipArray = (pixels, width, height) => {
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

    drawToCanvas = () => {
        const { manager } = this.props;
        const c = manager.canvas;

        if (this.canvasRef.current) {
            this.canvasRef.current.width = 280 * (c.width / c.height);
            this.canvasRef.current.height = 280;

            const ctx = this.canvasRef.current.getContext("2d");

            const img = ctx.createImageData(c.width, c.height);

            manager.redoUpdate();
            const pixels = this.flipArray(
                manager.readPixels(),
                c.width,
                c.height
            );
            img.data.set(pixels);

            this.scaleCanvas.width = c.width;
            this.scaleCanvas.height = c.height;

            this.ctx.putImageData(img, 0, 0);

            const { width, height } = this.canvasRef.current;
            ctx.drawImage(this.scaleCanvas, 0, 0, width, height);
            this.setState({ width, height });
        } else {
            console.log("???");
        }
    };

    componentDidMount() {
        this.drawToCanvas();
    }

    render() {
        const { manager } = this.props;
        const { width, height } = this.state;

        return (
            <Dialog
                open={this.props.open}
                aria-labelledby="max-width-dialog-title"
                fullWidth={true}
                maxWidth="md"
            >
                <DialogTitle id="scroll-dialog-title">
                    Create thumbnail
                </DialogTitle>
                <DialogContent style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                    <Typography variant="h4">
                        {this.state.message}
                    </Typography>
                    <canvas style={{ width, height }} ref={this.canvasRef} />
                </DialogContent>
                <DialogActions
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"
                        
                    }}
                >
                    <div>
                       
                        <Button style={{color: "red"}} onClick={() => this.props.onSelect()} color="primary">
                            close
                        </Button>
                        <Button  onClick={() => manager.parent.play()} color="primary">
                           play/pause
                        </Button>
             
                    </div>

                    <div>
                        <Button onClick={this.drawToCanvas} color="primary">
                            take screenshot
                        </Button>

                        <Button
                            onClick={this.upload}
                            color="primary"
                            style={{color: "green"}}
                        >
                            Upload
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>
        );
    }
}
export default withStyles(styles)(ScrollDialog);
