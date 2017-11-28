import React, { Component } from 'react';
import { Table, Column, Cell } from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import JSONTree from 'react-json-tree';
import _ from 'lodash';
import classNames from 'classnames';
import { connect } from 'react-redux';
import ExplorerTableCell from './ExplorerTableCell.js';
import { getColumnNames, getColumnWidth } from './explorer-table-view-utils';
import { saveRow, saveInlineEdit, refreshExplorerBody } from '../../../actions';
import * as types from '../../../action-types';

class ExplorerTableView extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.resizeTimeoutFunction = () => {
      this.resizeTimeout = setTimeout(() => {
        this.forceUpdate();
      }, 100);
    };
    window.onresize = () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeoutFunction();
    }
  }

  componentWillUnmount() {
    window.onresize = null;
  }

  render() {

    const {
      columnWidths,
      selectedTable,
      onUpdateTableSort,
      onEditClick,
      onDeleteClick,
      setColumnWidth,
      dbConnection,
      saveRowInline
    } = this.props;

    const columnNames = getColumnNames(selectedTable.data);

    const setColumnWidthCallback = (newColumnWidth, columnKey) => {
      setColumnWidth(newColumnWidth, columnKey, selectedTable)
    };

    const actionColumn = (
      <Column
        key="actions"
        header={<Cell>Action</Cell>}
        columnKey="action"
        cell={(props) => {
          const row = selectedTable.data[props.rowIndex];
          return (
            <Cell className="action-buttons">
              <span className="btn btn-sm btn-primary fa fa-pencil" onClick={() => onEditClick(row)}/>
              <span className="btn btn-sm btn-danger fa fa-trash" onClick={() => onDeleteClick(row)}/>
            </Cell>
          );
        }}
        width={100}/>
    );

    const dynamicColumns = columnNames.map((fieldName, index) => {
      const iconClasses = `fa fa-sort-${selectedTable.query.direction} pull-right`;
      let iconBody = '';
      if (selectedTable.query.sort === fieldName) {
        iconBody = <i className={iconClasses}/>;
      }
      const header = (
        <Cell className="tableview-header"
              onClick={() => onUpdateTableSort(fieldName)}>
          {fieldName}{iconBody}
        </Cell>
      );
      return (
        <Column
          key={index}
          header={header}
          isResizable={true}
          columnKey={fieldName}
          cell={(props) => {
            return (
              <Cell>
                <ExplorerTableCell row={selectedTable.data[props.rowIndex]} fieldName={fieldName}
                                   rowChanged={saveRowInline}/>
              </Cell>
            );
          }}
          width={getColumnWidth(columnWidths, selectedTable, fieldName)}
        />
      );
    });

    const columnNodes = [actionColumn].concat(dynamicColumns);

    return (
      <div style={{ position: 'relative' }}>
        <div className="table-view-container">
          <Table
            rowsCount={selectedTable.data.length}
            rowHeight={50}
            headerHeight={30}
            onColumnResizeEndCallback={setColumnWidthCallback}
            isColumnResizing={false}
            width={window.innerWidth - 360}
            height={window.innerHeight - 148}>
            {columnNodes}
          </Table>
        </div>
      </div>
    );
  };
}

function mapStateToProps(state) {
  return {
    selectedTable: state.selectedTable,
    columnWidths: state.main.columnWidths,
    dbConnection: state.main.dbConnection
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onUpdateTableSort: (field) => {
      dispatch({
        type: types.SET_TABLE_SORT,
        field
      });
      dispatch(refreshExplorerBody());
    },
    setColumnWidth: (newColumnWidth, columnKey, selectedTable) => {
      let width = {};
      width[columnKey] = newColumnWidth;

      dispatch({
        type: "SET_TABLE_COLUMN_WIDTH",
        databaseName: selectedTable.databaseName,
        tableName: selectedTable.name,
        width
      });
    },
    onEditClick: (row) => {
      dispatch({
        type: "SET_ROW_EDIT",
        row
      });
    },
    onDeleteClick: (rowToDelete) => {
      dispatch({
        type: 'TOGGLE_CONFIRM_ROW_DELETE',
        rowToDelete
      });
    },
    saveRowInline: (originalRow, row) => {
      const string = JSON.stringify(row);
      dispatch(saveInlineEdit(originalRow, string));
    }
  };
}

const ExplorerTableViewContainer = connect(mapStateToProps, mapDispatchToProps)(ExplorerTableView);

export default ExplorerTableViewContainer;

