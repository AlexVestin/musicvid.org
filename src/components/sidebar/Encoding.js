import React, { PureComponent } from 'react'
import * as dat from '../dat.gui.src'

export default class Encoding extends PureComponent {

    constructor() {
        super();

        this.mountRef = React.createRef();
    }

    componentDidMount = () => {
        this.gui = new dat.GUI({ autoPlace: false, width: "100%" });
    }
  render() {
    return (
      <div ref={this.mountRef} >          
      </div>
    )
  }
}
