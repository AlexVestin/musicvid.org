import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

class AlertDialog extends React.Component {
    render() {
        const name = this.props.project ? this.props.project.name : "";
        return (
            <Dialog
                open={this.props.open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    <div style={{display: "flex", flexDirection: "row"}}>
                        Are you sure you want to remove &nbsp; 
                        <div style={{ color: "#ff0000" }}>{name}</div>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This will remove the project permanently. There is no
                        undo.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleNo} color="primary">
                        no
                    </Button>
                    <Button
                        onClick={() => this.props.handleYes(this.props.project)}
                        color="primary"
                        autoFocus
                    >
                        yes
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default AlertDialog;
