import React, { PureComponent } from 'react'
import classes from './Header.module.scss';


import Header from '../../../home/modules/views/AppAppBar'




export default function withHeader(WrappedComponent) {
  return class extends PureComponent {

    render() {
      return (
        <div className={classes.container}>
          <Header></Header>

          <WrappedComponent {...this.props}></WrappedComponent>
        </div>
      )
    }
  }
}
