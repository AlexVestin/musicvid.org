import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import OverviewFolder from "./OverviewFolder";

class AlertDialog extends React.Component {

    constructor(props) {
        super(props);
        const name = props.item.getName();
        this.state = {folders: ["root"], selected: "root", controllerName: name};
        this.inputRef = React.createRef();
    }

    
    handleClose = accept => {
        const {item,onSelect} = this.props;
        onSelect({
            item: item,
            name: this.state.controllerName,
            location: this.state.selected
        });

        
    };

    init = () => {
        const name = this.props.item.getName();
        this.setState({controllerName: name});
        this.setOptions();
    }

    componentDidMount() {
       this.init();
    }

    componentWillUnmount() {
        if(this.inputRef.current) {
            this.inputRef.current.onkeyup = null;
        }
    }

    setName = (event) => {
        if(this.inputRef.current && !this.inputRef.current.onkeyup) {
            this.inputRef.current.onkeyup = (event) => {
                event.stopPropagation();
                event.preventDefault(); 
            }
        }
      
        this.setState({controllerName: event.target.value});
    }

    setOptions = () => {    
        const {gui} = this.props;
        const folders = gui.getRoot().__folders["Overview"].__folders;
        const folderNames = Object.keys(folders).map(key => {
            return {name: folders[key].name, key: key}
        })

        this.setState({folders: [{name: "root", key: "root"}, ...folderNames] });
    }

    setFolder = (e) => {
        this.setState({selected: e.target.value})
    }

    render() {

        return (
            <Dialog onEnter={this.init} open={this.props.open}>
                <DialogTitle id="scroll-dialog-title">Automations</DialogTitle>

                <DialogContent style={{display: "flex", flexDirection:"column"}}>
                    <DialogContentText
                        id="alert-dialog-description"
                        style={{ lineHeight: 0.95 }}
                        component={"span"}
                    >

                        Link to existing controller 
                        {this.state.folders.map(obj => <OverviewFolder key={obj.key}></OverviewFolder>)}
                        <br></br>
                        Or
                        <br></br>
                        Add new controller to overview
                    </DialogContentText>
                    Name of controller: <input ref={this.inputRef} onChange={this.setName} value={this.state.controllerName}></input>
                    where to put: <select onChange={this.setFolder}>
                        {this.state.folders.map(obj => <option key={obj.key} value={obj.key}>{obj.name}</option>)}
                    </select>

                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} autoFocus>
                        Add controller
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default AlertDialog;
