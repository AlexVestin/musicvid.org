import React, { PureComponent } from "react";

export default class InputItem extends PureComponent {
    constructor(props) {
        super(props);
        this.item = props.item;
        this.state = { value: this.item.inputString };

        this.inputRef = React.createRef();
    }

    componentDidMount() {
        this.inputRef.current.onkeyup = event => {
            event.stopPropagation();
            event.preventDefault();
        };
    }

    onChange = e => {
        const val = e.target.value;
        this.setState({ value: val });
        this.item.inputString = val;
    };

    render() {
        return (
            <textarea
                ref={this.inputRef}
                placeholder="Input valid math stuff here"
                value={this.state.value}
                onChange={this.onChange}
                style={{ width: "70%", height: 100 }}
            />
        );
    }
}
