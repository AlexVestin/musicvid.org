import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Input from "./Input";

const CustomTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    body: {
        fontSize: 14
    }
}))(TableCell);

const styles = theme => ({
    root: {
        width: "100%",
        marginTop: theme.spacing(3),
        overflowX: "auto"
    },
    table: {
        minWidth: 700
    },
    row: {
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.background.default
        }
    }
});


class NameInput extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { name: props.initalValue }; 
        this.ref = React.createRef();
    }

    onChange = (e) => {
        const val = e.target.value;
        this.props.onChange(val);
        this.setState({name: val})
    }

    

    

    componentDidMount() {

        const prevent = (event) => {
            event.stopPropagation();
            event.preventDefault(); 
        }

        this.ref.current.onkeyup = prevent;
        this.ref.current.onkeydown = prevent;
       
    }
    render() {
        return(
            <input value={this.state.name} onChange={this.onChange} ref={this.ref}></input>
        )
    }
}

class CustomizedTable extends React.PureComponent {

    constructor() {
        super();

        this.startRef = React.createRef();
        this.endRef = React.createRef();
        this.typeRef = React.createRef();

    }
    state = {values: []};


    onKey = (e) => {
        console.log("kkey")
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

    }
    updateLinks = () => {
        const automations = this.props.automations;
        this.setState({values: automations.map(e => e.controller.object[e.controller.property])});
    }

    componentDidMount() {
        this.updateRef = window.setInterval(this.updateLinks, 75);
    }
    componentWillUnmount() {
        window.clearInterval(this.updateRef);
    }

    changeValueToUse = (event, item) => {
        this.setState({valueToUse: event.target.value});
        item.valueToUse = event.target.value;
    }
    

    render() {
        const { classes, automations, item } = this.props;

        return (
            <Paper className={classes.root}>
                <div>Base value: {item.preAutomationValue}</div>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell>
                                Active Automations
                            </CustomTableCell>

                            <CustomTableCell align="center">
                                Value to use
                            </CustomTableCell>

                            <CustomTableCell align="center">
                                Timerange
                            </CustomTableCell>

                            <CustomTableCell align="center">
                                Transform
                            </CustomTableCell>
                            
                            <CustomTableCell align="center">
                                value
                            </CustomTableCell>

                            <CustomTableCell align="right" />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {automations.map((row, i) => (
                            <TableRow
                                className={classes.row}
                                key={row.automation.id}
                            >
                                <CustomTableCell component="th" scope="row">
                                    <NameInput
                                        onChange={(val) => row.automation.name = val}
                                        initalValue={row.automation.name}
                                    >
                                    </NameInput>
                         
                                </CustomTableCell>

                                <CustomTableCell component="th" scope="row">
                                    <select defaultValue={row.item.valueToUse || "value"} onChange={(e) => this.changeValueToUse(e, row.item)}>
                                        {row.automation.values.map(val => {  
                                            return( 
                                                <option value={val}>{val}</option>
                                            )
                                        })}
                                    </select>
                        
                                        
                                </CustomTableCell>

                                <CustomTableCell align="center">
                                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                        Start: 
                                        <Input ref={this.startRef} style={{width: 40}} defaultValue={row.item.startTime} onChange={e => (row.item.startTime = e.target.value)
                                        }></Input>
                                    </div>
                                    
                                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 4}}>
                                        End: 
                                        <Input  style={{width: 40}} defaultValue={row.item.endTime} onChange={e =>
                                            (row.item.endTime = e.target.value)
                                        }></Input>
                                    </div>
                                    
                                </CustomTableCell>


                                <CustomTableCell align="center">
                                    <Input ref={this.typeRef} style={{width: 80}} defaultValue={row.item.type} onChange={e =>
                                            (row.item.type = e.target.value)
                                        }></Input>
                                </CustomTableCell>

                                <CustomTableCell align="center">
                                   <div style={{width: 40}}>{String(this.state.values[i]).substr(0, 6)}</div>
                                </CustomTableCell>


                                <CustomTableCell align="right">
                                    <Button
                                        onClick={() => this.props.remove(row)}
                                        style={{ color: "red" }}
                                    >
                                        remove
                                    </Button>
                                </CustomTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

CustomizedTable.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CustomizedTable);
