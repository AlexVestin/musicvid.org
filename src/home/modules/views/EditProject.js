import React, { PureComponent } from 'react'
import Button from '../components/Button'
import LayoutBody from '../components/LayoutBody'
import Typography from '../components/Typography'
import { base, app } from 'backend/firebase'

export default class EditProject extends PureComponent {
  state = {isOwner: false}
    componentDidMount() {
      console.log(app.auth().currentUser.uid, this.props)
      if(app.auth().currentUser.uid === this.props.project.owner)
          this.setState({isOwner: true})
    }

    delete = () => {
      console.log(this.props)
      base.collection("featured").doc("all").collection("projects").doc(this.props.project.id).delete().then(() => {
        alert("Successfully deleted")
        this.props.back();
      }).catch(() => {
        alert("Could not delete");
      })
    }

  isOwner = () => {
   
  }
  render() {
    const { project, imgSrc } =  this.props;
    console.log(project);
    return (
      <div>
           <LayoutBody
                style={{display: "flex", flexDirection: "column", alignItems: "center"}}
                    component="section"
                    width="large"
                >
                    <Typography
                        variant="h4"
                        marked="center"
                        align="center"
                        component="h2"
                        style={{marginTop: 30}}
                    >
                        
                        {project.name}


                    </Typography>
                    <Typography variant="h6" align="center" style={{marginTop: 30, width: 200, display:"flex", flexDirection: "row", justifyContent: "space-between"}} >
                        Likes: <div>(todo)</div>
                    </Typography>
                    <Typography variant="h6" align="center" style={{width: 200, display:"flex", flexDirection: "row", justifyContent: "space-between"}}>
                        Downloads: <div>(todo)</div>
                    </Typography>
                    <img  style={{marginTop: 30}} src={imgSrc} alt="thumbnail"/>

                    {this.state.isOwner && <Button  style={{color:"red"}} onClick={this.delete}>Remove this projected from featured</Button>}
                    
  
                </LayoutBody>
      </div>
    )
  }
}
