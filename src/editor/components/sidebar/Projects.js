

import React, { PureComponent } from 'react'
import ProjectList from 'home/ProjectList'

import classes from './Project.module.css';
import { GUIMount } from './ControllerContainer'; 
export default class Projects extends PureComponent {

  state = {index: 0};
  render() {
    const { index } = this.state;
    return (
      <div className={classes.container}>
          <div className={classes.nav} >
            <div style={{backgroundColor: index === 0 ? "#2f2f2f" : ""}} onClick={()=>this.setState({index: 0})}>Settings</div>
            <div style={{backgroundColor: index === 1 ? "#2f2f2f" : ""}} onClick={()=>this.setState({index: 1})}>My projects</div>
            <div style={{backgroundColor: index === 2 ? "#2f2f2f" : ""}} onClick={()=>this.setState({index: 2})}>Community projects</div>
          </div>

        <div className={classes.content}>
          {index === 0 &&  <GUIMount gui={this.props.gui.__folders["Project"].domElement}/>}
          {index === 1 && <ProjectList loadProject={this.props.loadProject}></ProjectList>}
          {index === 2 && <div>Community projects will be moved here</div>}
        </div>
          
      </div>
    )
  }
}
