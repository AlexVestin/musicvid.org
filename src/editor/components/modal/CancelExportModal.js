import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

class AlertDialog extends React.Component {

    handleClose = accept => {
        if (accept) {
            this.props.accept();
        } else {
            this.props.reject();
        }
    };

    render() {
        return (
            <Dialog
                open={this.props.open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Cancel Export?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        id="alert-dialog-description"
                        style={{ lineHeight: 0.95 }}
                        component={"span"}
                    >
                        If you go back you will cancel your export, do you want to proceed?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => this.handleClose(false)}
                        color="primary"
                    >
                        No, continue exporting
                    </Button>
                    <Button
                        onClick={() => this.handleClose(true)}
                        color="secondary"
                        autoFocus
                    >
                        Yes, cancel export and go back
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default AlertDialog;
