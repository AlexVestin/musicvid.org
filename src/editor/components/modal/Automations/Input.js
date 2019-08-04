import React, { PureComponent } from 'react'

export default class Input extends PureComponent {

    constructor() {
        super();

        this.ref = React.createRef()
    }

    componentDidMount() {
        const prevent = (event) => {
            event.stopPropagation();
            //event.preventDefault(); 
        }

        this.ref.current.onkeyup = prevent;
        this.ref.current.onkeydown = prevent;
    }

 
    render() {
        return (
            <input ref={this.ref} {...this.props}></input>
        )
    }
}
