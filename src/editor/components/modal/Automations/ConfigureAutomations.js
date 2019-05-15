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

        const autos = [];

        item.__parentObject.__automations.forEach(link => {
            const a = automations[link.automationID];
            if(link.controllerID === item.__path) 
                autos.push({automation: a, item: link, controller: item});
        })

        this.setState({autos: autos});
    }   

    remove = (it) => {
        const { item } = this.props;
        item.__parentObject.__automations = item.__parentObject.__automations.filter(l => l.id !== it.item.id);
        this.update();
    }

    render() {
        const { item } = this.props;
        return (
            <div>
                <DialogContentText>
                    Configure automations for{" "}
                    {item.object.name + "-" + item.property} :
                </DialogContentText>

                <ActiveAutomations remove={this.remove} automations={this.state.autos} item={item} />
                <Button onClick={this.props.selectAutomation}>
                    {" "}
                    Select new automation{" "}
                </Button>
            </div>
        );
    }
}
