import React, { PureComponent } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import AutomationsList from "../modal/Automations/AutomationsList";
import ItemContainer from "../automation/ItemContainer";

import AudioAutomation from "editor/animation/automation/AudioReactiveAutomation";
import MathAutomation from "editor/animation/automation/InputAutomation";
import PointAutomation from "editor/animation/automation/PointAutomation";
import classes from "./Automations.module.scss";

export default class Automations extends PureComponent {
    state = { index: 0 };

    onSelect = () => {
        const rootGui = this.props.gui.getRoot();
        rootGui.modalRef.toggleModal(13).then(selected => {
            if(selected){
                const root = this.props.gui.getRoot();
                switch(selected.type) {
                    case "audio":
                    this.selectedAutomation = new AudioAutomation(root);
                        break;
                    case "math":
                        this.selectedAutomation = new MathAutomation(root);
                        break;
                    case "point":
                        this.selectedAutomation = new PointAutomation(root);
                        break;
                    default:
                    console.log("unknown type")
                }
                
                rootGui.__automations[this.selectedAutomation.__id] = this.selectedAutomation;
                this.setState({ index: 1 });
            }
           
        });
    };

    onRemove = (automation) => {
        const rootGui = this.props.gui.getRoot();
        delete rootGui.__automations[automation.__id];
        this.setState({index: 0})
    }

    onSelectAutomation = (automation) => {
        this.selectedAutomation = automation;
        this.setState({ index: 1 });
    }

    render() {
        const { index } = this.state;
        const rootGui = this.props.gui.getRoot();
        const automations = Object.keys(rootGui.__automations).map(key => rootGui.__automations[key]);

        return (
            <div className={classes.container}>
                <div className={classes.column}>
                    {index === 0 && (
                        <React.Fragment>
                             <Typography variant="h4" style={{color: "white"}}>
                                    Automations 
                            </Typography>

                            {automations.length > 0 ? (
                               
                                <AutomationsList
                                    onSelect={this.onSelectAutomation}
                                    automations={automations}
                                />
                            ) : (
                                <Typography variant="h6" color="secondary">
                                    There are currently no automations! <br />
                                    You can add a new one using the button below
                                </Typography>
                            )}

                            <Button
                                onClick={this.onSelect}
                                style={{ color: "#efefef" }}
                            >
                                Add new automation
                            </Button>
                        </React.Fragment>
                    )}
                    {index === 1 && (
                        <ItemContainer
                            item={this.selectedAutomation}
                            back={() => this.setState({ index: 0 })}
                            gui={rootGui}
                            onRemove={this.onRemove}
                        >
                        </ItemContainer>
                        
                    )}
                </div>
            </div>
        );
    }
}
