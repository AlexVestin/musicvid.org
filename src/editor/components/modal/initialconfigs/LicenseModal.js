import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import license from "../../../util/License";
import Typography from "@material-ui/core/Typography";

class AlertDialog extends React.Component {
    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = accept => {
        if (accept) {
            this.props.accept();
        } else {
            this.props.reject();
        }
        this.setState({ open: false });
    };

    getContributors = items => {
        const authors = {};
        items.forEach(item => {
            if (item.license === license.REQUIRE_ATTRIBUTION) {
                item.authors.forEach(author => {
                    if (author.name in authors) {
                        authors[author.name].items += " & " + item.name;
                    } else {
                        authors[author.name] = { ...author, items: item.name };
                    }
                });
            }
        });

        return authors;
    };

    render() {
        const authors = this.getContributors(this.props.items);
        return (
            <Dialog
                open={this.props.open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Attribution notice"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        id="alert-dialog-description"
                        style={{ lineHeight: 0.95 }}
                        component={"span"}
                    >
                        This composition contains licensed work and to use these
                        items commercially attribution is legally required.
                        <br />
                        <br />
                        <div style={{ backgroundColor: "#efefef" }}>
                            <Typography
                                component="h6"
                                variant="h6"
                                color="inherit"
                                style={{ fontSize: 18 }}
                            >
                                {`Visuals made by: `}
                            </Typography>
                            {Object.keys(authors).map(key => {
                                const author = authors[key];
                                return (
                                    <div key={key}>
                                        <Typography
                                            component="h6"
                                            variant="h6"
                                            color="inherit"
                                            style={{ fontSize: 15 }}
                                        >
                                            {author.name + " - " + author.items}
                                        </Typography>

                                        {author.social1 && author.social1.url}
                                        <br />
                                        {author.social2 && author.social2.url}
                                        <br />
                                    </div>
                                );
                            })}
                        </div>
                        <br />
                        By selecting "I AGREE" you agree to add this attribution
                        visibly to your content.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => this.handleClose(false)}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => this.handleClose(true)}
                        color="primary"
                        autoFocus
                    >
                        I Agree
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default AlertDialog;
