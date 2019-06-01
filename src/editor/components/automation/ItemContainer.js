import React, { PureComponent } from "react";
import AudioReactiveItem from "./AudioReactiveItem";
import InputItem from "./MathInputItem";
import PointItem from "./PointItem";
import Button from '@material-ui/core/Button'
import { Typography } from "@material-ui/core";
import { ReactComponent as Delete } from "./baseline-delete-24px.svg";


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

    remove = () => {
        this.props.onRemove(this.props.item);
    }

    render() {
        const { item, onSelect, gui } = this.props;
        return (
            <div>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%"}}> 
                    <Button style={{color:"#efefef"}} onClick={this.props.back}>Back</Button>
                    <Delete fill="red" onClick={this.remove} style={{color: "red", cursor: "pointer"}}></Delete>
                </div>

                <div style={{backgroundColor: "rgba(0,0,0,0.3)", padding: 10}}>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", color: "#efefef", marginBottom: 5, marginTop: 10}}>
                <Typography style={{color: "#efefef"}} variant="h6">
                        Name: 
                    </Typography>
                    <input ref={this.inputRef} value={this.state.name} onChange={this.updateName} />
                </div>

                {item.type === "audio" && (<AudioReactiveItem onSelect={onSelect} item={item} /> )}
                {item.type === "shake" && ( <AudioReactiveItem onSelect={onSelect} item={item} />)}
                {item.type === "math" && <InputItem onSelect={onSelect} item={item} />}
                {item.type === "point" && <PointItem gui={gui} onSelect={onSelect} item={item} />}
                </div>
            </div>
        );
    }
}
