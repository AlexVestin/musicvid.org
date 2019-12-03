import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";


class Questionaire extends React.Component {
    state = { open: false, modalShown: true }

    componentDidMount() {
        if (!localStorage.getItem('modalShown')) {

            setTimeout(() => {
                this.setState({modalShown: false });
                localStorage.setItem('modalShown', true);
            }, 1000)
        }
    };


    render() {

        return (
            <Dialog
                open={this.props.open && !this.state.modalShown}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth={this.state.open ? "md" : "sm" }
               
            >

        {this.state.open  && <iframe title="questions" src="https://docs.google.com/forms/d/e/1FAIpQLSd2MYT3GU3KFLYWGB91fQGIKuk08Lh-lk0Gx1wB4h6RK2qP1Q/viewform?embedded=true" width="640" height="3967" frameborder="0" marginheight="0" marginwidth="0">Läser in …</iframe> }
            {!this.state.open &&                
                <DialogTitle id="alert-dialog-title">
                    {"questionnaire"}
                </DialogTitle>
            }
                <DialogContent>

                    {!this.state.open &&
                    <DialogContentText
                        id="alert-dialog-description"
                        style={{ lineHeight: 0.95 }}
                        component={"span"}
                    >
                        <Typography>                        
                        Hi, your export is now running! 
                        <br/>
                        Do you have three minutes to fill out a questionnaire regarding audio visualizers? It won't affect the export
                        and would help a lot!
                        <br/>

                        
                        </Typography>

                        <Typography variant="h5">
                        Regards, Alex
                        </Typography>

                    </DialogContentText>
                    }

                </DialogContent>
                <DialogActions>
                   

                    {this.state.open && "Make sure to press send at the bottom before closing!"}
                    <Button
                        onClick={() => this.props.close(false)}
                        color="primary"
                    >
                        close
                    </Button>

                    {!this.state.open && 
                        <Button
                            onClick={() => this.setState({open: true})}
                            color="secondary"
                        >
                            sure!
                        </Button>
                    }
                </DialogActions>
            </Dialog>
        );
    }
}

export default Questionaire;
