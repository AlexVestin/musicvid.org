import React, { PureComponent } from 'react'

export default class AudioReactiveItem extends PureComponent {
  
    constructor(props) {
        super(props);

        this.item = props.item;
        this.mountRef = React.createRef();
    }

    componentDidMount() {
        this.item.folder.open();
        const de = this.item.folder.domElement;
        
        this.mountRef.current.appendChild(de);
    }
    render() {
        return (
            <div ref={this.mountRef}></div>
        )
  }
}
