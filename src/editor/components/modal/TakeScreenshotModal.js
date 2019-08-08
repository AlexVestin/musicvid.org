import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";
import { app, base } from 'backend/firebase'
import { Typography } from "@material-ui/core";
import { setSnackbarMessage } from "fredux/actions/message";

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


class ScrollDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = { width: 1, height: 1 };
        this.canvasRef = React.createRef();
        this.loaded = false;
        this.drawn = false;
    }

    upload = () => {
        const img = this.canvasRef.current.toDataURL("image/jpeg", 0.88);
        this.setState({message: "Uploading..."});

        const cu = app.auth().currentUser;
        if (!cu) {
            setSnackbarMessage(
                "You need to be logged and have created a project in order to save a screenshot.",
                "error"
            );
            return;
        }

        if (cu.uid !== this.props.manager.__ownerId) {
            setSnackbarMessage(
                "Couldn't add thumbnail, this isn't your project. You can create a copy by saving the project first.",
                "error"
            );
            return;
        }

        
        let docRef = base.collection("projects").doc(this.props.manager.__id);
        docRef.get()
            .then((doc) => {
                if(!doc.exists) {
                    setSnackbarMessage(
                        "You need to save the project before you can take a thumbnail for it",
                        "error"
                    );
                    return;
                } else {
                    docRef.update( {thumbnail: img} );
                    setSnackbarMessage(
                        "Successfully set thumbnail",
                        "success", 
                        2000
                    );
                }
            }).catch(err => {
                setSnackbarMessage(
                    err.message,
                    "error"
                );
            });
       
        this.setState({message: "Uploaded! closing modal"})
        setTimeout(() => this.props.onSelect(), 1000);
    }

    onLoad = () => {};

    drawToCanvas = () => {
        const { manager } = this.props;
        const c = manager.canvas;

        if (this.canvasRef.current) {
            this.drawn = true;
            this.canvasRef.current.width = 200 * (c.width / c.height);
            this.canvasRef.current.height = 200;

            const ctx = this.canvasRef.current.getContext("2d");
            manager.redoUpdate();
            const { width, height } = this.canvasRef.current;
            ctx.drawImage(c, 0, 0, width, height);
            this.setState({ width, height });
        } 
    };

    componentDidMount() {
        this.drawToCanvas();

        setTimeout(this.drawToCanvas, 100);
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
