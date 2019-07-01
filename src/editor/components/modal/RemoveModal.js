import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

class AlertDialog extends React.Component {

    handleClose = accept => {
        this.props.onSelect(accept)
    };

    render() {
        return (
            <Dialog
                open={this.props.open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {`Remove ${this.props.item.title}?`}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        id="alert-dialog-description"
                        style={{ lineHeight: 0.95 }}
                        component={"span"}
                    >
                        This will remove {this.props.item.title}, there is no undo.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => this.handleClose(false)}
                        color="primary"
                    >
                        no
                    </Button>
                    <Button
                        onClick={() => this.handleClose(true)}
                        color="secondary"
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
