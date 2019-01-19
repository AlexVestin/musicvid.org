import React, { PureComponent } from 'react'
import classes from './Header.module.scss';

export default function withHeader(WrappedComponent) {
  return class extends PureComponent {

    render() {
      return (
        <div className={classes.container}>

          <div className={classes.logo}>
            musicvid.org
          </div>

          <WrappedComponent {...this.props}></WrappedComponent>
        </div>
      )
    }
  }
}

/*


          <div className={classes.signUp}>
            <button onClick={() => alert("sign ups temporarily disabled")}>Log in</button>
            <button onClick={() => alert("sign ups temporarily disabled")}>Sign up</button>
          </div>*/