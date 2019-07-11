import React, { PureComponent } from "react";
import Button from "@material-ui/core/Button";
import DialogContentText from "@material-ui/core/DialogContentText";
import ActiveAutomations from "./ActiveAutomations";

export default class ConfigureAutomations extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {autos: []};
    }

    componentDidMount() {
        this.update();
    }
    
    update = () => {
        const {item, gui} = this.props;
        const automations = gui.getRoot().__automations;
        const controller = item.controller; 

        const autos = [];

        controller.__parentObject.__automations.forEach(link => {
            const automation = automations[link.automationID];
            if(link.controllerID === controller.__path) 
                autos.push({automation, item: link, controller});
        })

        this.setState({autos: autos});
    }   

    remove = (it) => {
        const { item } = this.props;
        const controller = item.controller;
        controller.__parentObject.__automations = controller.__parentObject.__automations.filter(l => l.id !== it.item.id);
        this.update();
    }

    render() {
        const { item } = this.props;
        const controller = item.controller;
        return (
            <div>
                <DialogContentText>
                    Configure automations for{" "}
                    {controller.object.name + "-" + controller.property} :
                </DialogContentText>

                <ActiveAutomations remove={this.remove} automations={this.state.autos} item={controller} />
                <Button onClick={this.props.selectAutomation}>
                    {" "}
                    Select new automation{" "}
                </Button>
            </div>
        );
    }
}
