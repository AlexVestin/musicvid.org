

import React, { PureComponent } from 'react'
import ProjectList from 'home/ProjectList'
export default class Projects extends PureComponent {
  render() {
    return (
      <div>
          <ProjectList loadProject={this.props.loadProject}></ProjectList>
      </div>
    )
  }
}
