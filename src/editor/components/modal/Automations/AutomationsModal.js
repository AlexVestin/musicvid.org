import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";
import SelectAutomation from './SelectAutomation'
import ConfigureAutomations from "./ConfigureAutomations";
import AddNewAutomation from "./AddNewAutomation";

// audio automation
import AudioAutomation from './items/AudioReactiveAutomation'
import ItemContainer from './ItemContainer'
const styles = theme => ({
    form: {
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        width: "fit-content"
    },
    formControl: {
        marginTop: theme.spacing.unit * 2,
        minWidth: 120
    },
    formControlLabel: {
        marginTop: theme.spacing.unit
    }
});

class ScrollDialog extends React.Component {
    state = {
        scroll: "paper",
        index: 0
    };


    addAudioAutomation = () => {
      const root = this.props.gui.getRoot();
      this.selectedAutomation = new AudioAutomation(root);
      this.setState({index: 3});
    }

    render() {
        const { gui, item } = this.props;
        const { index } = this.state;
        const rootGui = this.props.gui.getRoot();
        return (
            <Dialog
                open={this.props.open}
                aria-labelledby="max-width-dialog-title"
                fullWidth={true}
                maxWidth="lg"
                fullheight
            >
                <DialogTitle id="scroll-dialog-title">Automations</DialogTitle>
                <DialogContent>
                    {index === 0 && (
                        <ConfigureAutomations
                            item={item}
                            selectAutomation={() => this.setState({ index: 1 })}
                        />
                    )}

                    {index === 1 && (
                        <SelectAutomation
                            item={item}
                            gui={rootGui}
                            back={() => this.setState({ index: 0 })}
                            addNewAutomation={() => this.setState({ index: 2 })}

                        />
                    )}

                    {index === 2 && (
                        <AddNewAutomation
                            item={item}
                            back={() => this.setState({ index: 0 })}
                            addAudioAutomation={this.addAudioAutomation}
                            addMathAutomation={this.addAudioAutomation}
                            addPointsAutomation={this.addAudioAutomation}
                        />
                    )}

                  {index === 3 && (
                        <ItemContainer
                            item={this.selectedAutomation}
                            back={() => this.setState({ index: 1 })}
                        />
                    )}

                   
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => this.props.onSelect()}
                        color="primary"
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}
export default withStyles(styles)(ScrollDialog);
