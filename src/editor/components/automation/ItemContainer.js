import React, { PureComponent } from "react";
import AudioReactiveItem from "./AudioReactiveItem";
import InputItem from "./MathInputItem";
import PointItem from "./PointItem";
import Button from '@material-ui/core/Button'
import { Typography } from "@material-ui/core";


export default class ItemContainer extends PureComponent {
    constructor(props) {
        super(props);

        this.item = props.item;
        this.state = { name: this.item.name };
        this.inputRef = React.createRef();
    }

    componentDidMount = () => {
        this.inputRef.current.onkeyup = (event) => {
            event.stopPropagation();
            event.preventDefault(); 
        }
    }
    updateName = e => {
        const val = e.target.value;
        this.setState({ name: val });
        this.item.name = val;
    };

    render() {
        const { item, onSelect, gui, onRemove } = this.props;
        return (
            <div>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", color: "#efefef", marginBottom: 5, marginTop: 10}}>
                <Typography style={{color: "#efefef"}} variant="h6">
                        Name: 
                    </Typography>
                    <input ref={this.inputRef} value={this.state.name} onChange={this.updateName} />
                </div>
                {item.type === "audio" && (
                    <AudioReactiveItem onSelect={onSelect} item={item} />
                )}
                {item.type === "math" && <InputItem onSelect={onSelect} item={item} />}
                {item.type === "point" && <PointItem gui={gui} onSelect={onSelect} item={item} />}

                <Button onClick={() => onRemove(item)} style={{backgroundColor: "red", color: "white", marginTop: 30}}>remove</Button>
            </div>
        );
    }
}
