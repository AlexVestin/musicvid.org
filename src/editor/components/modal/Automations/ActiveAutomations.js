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
        this.ref.current.onkeyup = (event) => {
            event.stopPropagation();
            event.preventDefault(); 
        }
    }
    render() {
        return(
            <input value={this.state.name} onChange={this.onChange} ref={this.ref}></input>
        )
    }
}

class CustomizedTable extends React.PureComponent {

    render() {
        const { classes, automations } = this.props;

        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell>
                                Active Automations
                            </CustomTableCell>

                            <CustomTableCell align="right">
                                Type
                            </CustomTableCell>

                            <CustomTableCell align="right" />
                            <CustomTableCell align="right" />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {automations.map(row => (
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

                                <CustomTableCell align="right">
                                    <select
                                        defaultValue={row.item.type}
                                        onChange={e =>
                                            (row.item.type = e.target.value)
                                        }
                                    >
                                        <option value="+">+</option>
                                        <option value="-">-</option>
                                        <option value="=">=</option>
                                        <option value="*">*</option>
                                    </select>
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
