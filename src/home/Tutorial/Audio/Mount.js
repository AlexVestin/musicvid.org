import React, { PureComponent } from 'react'

export default class Mount extends PureComponent {
    constructor() {
        super();
        this.mountRef = React.createRef();
    }

    componentDidMount() {
        this.mountRef.current.appendChild(this.props.gui.domElement);
    }
    render() {
        return (
            <div style={{minHeight: this.props.height, width: this.props.width, border: "1px solid gray", marginBottom: 10}} ref={this.mountRef}></div>
        )
    }
}
