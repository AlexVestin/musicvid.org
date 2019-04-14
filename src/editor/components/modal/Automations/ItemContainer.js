import React, { PureComponent } from "react";
import AudioReactiveItem from "./AudioReactiveItem";

export default class ItemContainer extends PureComponent {
    constructor(props) {
        super(props);

        this.item = props.item;
        this.state = { name: this.item.name };
    }

    updateName = e => {
        const val = e.target.value;
        this.setState({ name: val });
        this.item.name = val;
    };

    render() {
        const { item, onSelect } = this.props;
        return (
            <div>
                <input value={this.state.name} onChange={this.updateName} />
                {item.type === "audio" && (
                    <AudioReactiveItem onSelect={onSelect} item={item} />
                )}
                {item.type === "math" && <div ref={this.mountRef} />}
                {item.type === "points" && <div ref={this.mountRef} />}
            </div>
        );
    }
}
