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
        const links = gui.getRoot().__automationLinks;
        const autos = [];
        links.forEach(link => {
            if(link.controller === item) {
                autos.push({name: link.automation.name, id: link.automation.__id, item: link});
            }
        })

        this.setState({autos: autos});
    }   

    remove = (automation) => {
        const {item, gui} = this.props;
        const auto =  gui.__automations.find(e => e.__id === automation.id);
        auto.__items = auto.__items.filter(e => e.item !== item);
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
