import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";
import SelectAutomation from "./SelectAutomation";
import ConfigureAutomations from "./ConfigureAutomations";
import AddNewAutomation from "./AddNewAutomation";
import uuid from 'uuid/v4';

// audio automation
import ItemContainer from "../../automation/ItemContainer";
import AudioAutomation from "editor/animation/automation/AudioReactiveAutomation";
import InputAutomation from "editor/animation/automation/InputAutomation";
import PointAutomation from "editor/animation/automation/PointAutomation";

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

    constructor(props) {
        super(props);

        this.homeIndex = 0;
        if(props.mainMenu)
            this.homeIndex = 1;

        this.state = {
            scroll: "paper",
            index: this.homeIndex
        };
    }

    onSelect = automation => {
        const { item } = this.props;
        const link = { id: uuid(), type: "*", controller: item, automation, aid: automation.__id, iid: item.object.__id };
        const root = this.props.gui.getRoot();
        root.__automationLinks.push(link);
        
        this.setState({ index: this.homeIndex });
    }

    addAudioAutomation = () => {
        const root = this.props.gui.getRoot();
        this.selectedAutomation = new AudioAutomation(root);
        root.__automations[this.selectedAutomation.__id] = this.selectedAutomation;
        this.onSelect(this.selectedAutomation);
    };

    addPointAutomation = () => {
        const root = this.props.gui.getRoot();
        this.selectedAutomation = new PointAutomation(root);

        root.__automations[this.selectedAutomation.__id] = this.selectedAutomation;
        this.onSelect(this.selectedAutomation);
    };

    addMathAutomation = () => {
        const root = this.props.gui.getRoot();
        this.selectedAutomation = new InputAutomation(root);
        root.__automations[this.selectedAutomation.__id] = this.selectedAutomation;
        this.onSelect(this.selectedAutomation);
    };

    back = () => {
        const { index } = this.state;
        let newIndex = this.homeIndex;
        if (index === 3) {
            newIndex = 1;
        }

        this.setState({ index: newIndex });
    };

    render() {
        const { item } = this.props;
        const { index } = this.state;
        const rootGui = this.props.gui.getRoot();
        return (
            <Dialog
                open={this.props.open}
                aria-labelledby="max-width-dialog-title"
                fullWidth={true}
                maxWidth="md"
            >
                <DialogTitle id="scroll-dialog-title">Automations</DialogTitle>

                <DialogContent>
                    {index === 0 && (
                        <ConfigureAutomations
                            item={item}
                            gui={rootGui}
                            selectAutomation={() => this.setState({ index: 1 })}
                        />
                    )}

                    {index === 1 && (
                        <SelectAutomation
                            item={item}
                            gui={rootGui}
                            back={() => this.setState({ index: this.homeIndex })}
                            addNewAutomation={() => this.setState({ index: 2 })}
                            onSelect={this.onSelect}
                        />
                    )}

                    {index === 2 && (
                        <AddNewAutomation
                            item={item}
                            back={() => this.setState({ index: this.homeIndex })}
                            addAudioAutomation={this.addAudioAutomation}
                            addMathAutomation={this.addMathAutomation}
                            addPointAutomation={this.addPointAutomation}
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
                    {index !== this.homeIndex && (
                        <Button onClick={this.back}> Go back</Button>
                    )}
                    <Button
                        onClick={() => this.props.onSelect()}
                        color="primary"
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}
export default withStyles(styles)(ScrollDialog);
