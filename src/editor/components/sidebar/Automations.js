import React, { PureComponent } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import AutomationsList from "../modal/Automations/AutomationsList";
import ItemContainer from "../modal/Automations/itemcomponents/ItemContainer";

import AudioAutomation from "../modal/Automations/items/AudioReactiveAutomation";
import MathAutomation from "../modal/Automations/items/InputAutomation";
import PointAutomation from "../modal/Automations/items/PointAutomation";
import classes from "./Automations.module.scss";

export default class Automations extends PureComponent {
    state = { index: 0 };

    onSelect = () => {
        const rootGui = this.props.gui.getRoot();
        rootGui.modalRef.toggleModal(13).then(selected => {
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
            
            this.setState({ index: 1 });
        });
    };

    onRemove = (automation) => {
        const rootGui = this.props.gui.getRoot();
        const index = rootGui.__automations.findIndex(e => e === automation);
        rootGui.__automations.splice(index, 1);
        rootGui.__automationLinks = rootGui.__automationLinks.filter(link => link.automation !== automation)
        this.setState({index: 0})
    }

    onSelectAutomation = (automation) => {
        this.selectedAutomation = automation;
        this.setState({ index: 1 });
    }

    render() {
        const { index } = this.state;
        const rootGui = this.props.gui.getRoot();
        const automations = rootGui.__automations;
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
                        <div>
                        <ItemContainer
                            item={this.selectedAutomation}
                            back={() => this.setState({ index: 0 })}
                            gui={rootGui}
                            onRemove={this.onRemove}
                        >
                            hello
                        </ItemContainer>
                        <Button style={{color:"#efefef"}} onClick={() => this.setState({index: 0})}>Back</Button>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
