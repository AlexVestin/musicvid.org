import React, { PureComponent } from 'react'
import Button from '@material-ui/core/Button'
import AudioReactiveItem from './AudioReactiveItem'


export default class ItemContainer extends PureComponent {
    constructor(props) {
        super(props);

        this.item = props.item;
        this.state = { name: this.item.name };
    }


    updateName = (e) => {
        const val = e.target.value
        this.setState({name: val});
        this.item.name = val;
    }
    
    render() {

        const {item} = this.props;
        return (
            <div>

                <input value={this.state.name} onChange={this.updateName}></input>
                {item.type === "audio" &&  <AudioReactiveItem item={item}></AudioReactiveItem>}
                {item.type === "math" &&  <div ref={this.mountRef}></div>}
                {item.type === "points" &&  <div ref={this.mountRef}></div>}

                <Button onClick={this.props.back}>Go Back</Button>
            </div>



        )
  }
}
