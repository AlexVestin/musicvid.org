import React, { PureComponent } from "react";
import Button from "@material-ui/core/Button";
import DialogContentText from "@material-ui/core/DialogContentText";

import AutomationsList from "./AutomationsList";
import { Typography } from "@material-ui/core";

export default class SelectAutomation extends PureComponent {
    render() {
        const { gui, onSelect } = this.props;
        const automations = Object.keys(gui.__automations).map(key => gui.__automations[key]);
        return (
            <div>
                <DialogContentText>Select an automation :</DialogContentText>

                {automations.length > 0 ? (
                    <AutomationsList
                        onSelect={onSelect}
                        automations={automations}
                    />
                ) : (
                    <Typography>
                        There are currently no automations! You can add a new
                        one using the button below
                    </Typography>
                )}

                <Button onClick={this.props.addNewAutomation}>
                    Add new automation
                </Button>
            </div>
        );
    }
}
