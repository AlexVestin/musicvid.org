import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";

class AlertDialog extends React.Component {
    handleClose = (accept) => {
        this.props.onSelect(accept);
    };

    render() {
        const error = this.props.error;
        return (
            <Dialog
                open={this.props.open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Typography variant="h4" color="error" style={{ padding: 30 }}>
                    {`A fatal error has occurred`}
                </Typography>
                <DialogContent>
                    <DialogContentText
                        id="alert-dialog-description"
                        style={{ lineHeight: 0.95 }}
                        component={"span"}
                    >
                        The exporting encountered a fatal error:
                        <div>
                            <div
                                style={{
                                    fontSize: 16,
                                    padding: 10,
                                    color: "black",
                                    fontWeight: 700
                                }}
                            >
                                {error.errTitle}
                            </div>
                            <div
                                style={{
                                    fontSize: 16,
                                    padding: 10,
                                    color: "black",
                                    fontWeight: 700
                                }}
                            >
                                {error.errMsg}
                            </div>
                        </div>
                        <div>
                            This export is no longer retrievable, so a new one
                            has to be made. Since the export is done in memory,
                            a common issue is running out of memory.
                            <br />
                            Some common fixes:
                            <ul>
                                <li>Export using Chrome.</li>
                                <li>
                                    Update your browser. Check{" "}
                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href="https://www.whatismybrowser.com/"
                                    >
                                        https://www.whatismybrowser.com/
                                    </a>{" "}
                                    if your browser is up to date
                                </li>
                                <li>Restarting the browser.</li>
                                <li>
                                    Use a lower bitrate. (0 allows the encoder
                                    to guess, but lands on around 6Mb for 720p
                                    and higher for 1080p).
                                </li>
                                <li> Use a lower resolution.</li>

                                <li>
                                    Close other tabs and programs while
                                    exporting.
                                </li>
                            </ul>
                            If none of these works, you can contact me in the
                            discord and provide the id:
                            <br />
                            {error.id}
                            <br />
                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => this.handleClose(false)}
                        color="primary"
                    >
                        close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default AlertDialog;
