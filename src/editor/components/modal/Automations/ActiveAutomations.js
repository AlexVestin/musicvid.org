import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';

import Paper from '@material-ui/core/Paper';

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
});

let id = 0;
function createData(name, baseValue, type) {
  id += 1;
  return { id, name, type, baseValue };
}

const rows = [
  createData('Shake', 159, "="),
  createData('Audio reactive', 237, "-"),
  createData('Eclair', 262, "*"),
  createData('Cupcake', 305, "+"),
  createData('Gingerbread', 356, "+"),
];

function CustomizedTable(props) {
  const { classes, item } = props;
    console.log(item);
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <CustomTableCell>Active Automations</CustomTableCell>
            <CustomTableCell align="right">Basevalue</CustomTableCell>
            <CustomTableCell align="right">Type</CustomTableCell>

            <CustomTableCell align="right"></CustomTableCell>
            <CustomTableCell align="right"></CustomTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow className={classes.row} key={row.id}>
              <CustomTableCell component="th" scope="row">
                {row.name}
              </CustomTableCell>
              <CustomTableCell align="right">{row.baseValue}</CustomTableCell>
              <CustomTableCell align="right">{row.type}</CustomTableCell>

              <CustomTableCell align="right"><Button>Edit</Button></CustomTableCell>
              <CustomTableCell align="right"><Button>move up</Button><Button>move down</Button></CustomTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

CustomizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomizedTable);