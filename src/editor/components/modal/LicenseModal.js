import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import license from "../../animation/util/License";
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
        let uniqueItems = [];
        let isNeeded = false;


        items.forEach(i => {
            if (uniqueItems.findIndex(e => e.name === i.name) === -1) {
                uniqueItems.push(i);
            }
        })

        uniqueItems.forEach(item => {
            if (item.license === license.REQUIRE_ATTRIBUTION) {
                isNeeded = true;
               
            }

            item.authors.forEach(author => {
                if (author.name in authors) {
                    authors[author.name].items += " & " + item.name;
                } else {
                    authors[author.name] = { ...author, items: item.name };
                }
            });
        });

        return { authors, isNeeded };
    };

    render() {
        const { authors, isNeeded } = this.getContributors(this.props.items);

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
                        {isNeeded ? <div>

                            This composition contains licensed work, and in order to share it with others you are required to attribute
                            the authors, by displaying their information on or alongside your content.
                        </div> : 
                        <div>
                            Adding the attribution below is appreciated, but not required for this project! 
                        </div>
                        }
                       
                        <br />
                        <br />
                        <div style={{ backgroundColor: "#efefef" }}>

                            <Typography
               
                                color="inherit"
                                style={{ fontSize: 16 }}
                            >
                                {`Visuals made using https://musicvid.org` + (Object.keys(authors).length > 0 ?  ' and by creators: ' : '')}
                            </Typography>
                            {Object.keys(authors).map(key => {
                                const author = authors[key];
                                return (
                                    <div key={key}>
                                        <Typography
                            
                                            color="inherit"
                                            style={{ fontSize: 15 }}
                                        >
                                            {author.name + " - " + author.items}
                                        </Typography>
                                        {author.social1 && author.social1.url}
                                    </div>
                                );
                            })}
                        </div>
                        <br />

                        {isNeeded ? <div>

                        By selecting "I AGREE" you agree to honor the license of{" "}
                        <a
                            href="https://creativecommons.org/licenses/by/4.0/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            CC-BY
                        </a>{" "}
                        and to add to the above attribution 
                        <a  href="/faq#attribution"
                            target="_blank"
                            rel="noopener noreferrer"> visibly to your content. </a>
                        </div> : 
                            null
                        }
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

                        { isNeeded ? "I Agree" : "Export"}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default AlertDialog;
