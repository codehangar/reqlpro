import React from 'react';
import { Table, Column, Cell } from 'fixed-data-table';
import 'fixed-data-table/dist/fixed-data-table.css';
import JSONTree from 'react-json-tree';
import _ from 'lodash';
import classNames from 'classnames';
import { connect } from 'react-redux';
import ExplorerTableCell from './ExplorerTableCell.js';
import Segment from '../../../../../services/segment.service';
import { refreshExplorerBody } from '../../../../../actions';
import { getColumnNames, getColumnWidth } from './explorer-table-view-utils';
import { saveRow, saveInlineEdit } from '../../../../../actions';

const ExplorerTableView = ({
  columnWidths,
  selectedTable,
  onUpdateTableSort,
  onEditClick,
  onDeleteClick,
  setColumnWidth,
  dbConnection,
  saveRowInline
}) => {

  // console.log('selectedTable----->', selectedTable);

  let columnNames = getColumnNames(selectedTable.data);

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
            onClick={() => onUpdateTableSort(selectedTable.query.sort, fieldName, selectedTable.query.direction)}>
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
          if (selectedTable.data[props.rowIndex].id === '11698a1f-f9db-4f9c-9fb8-4c27d75e1990' && fieldName === 'name') {
            // console.log("   --> ExplorerTableView cell render", this.props.table.data[props.rowIndex][fieldName])
          }
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
          height={window.innerHeight - 105}>
          {columnNodes}
        </Table>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    selectedTable: state.main.selectedTable,
    columnWidths: state.main.columnWidths,
    dbConnection: state.main.dbConnection
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onUpdateTableSort: (sort, field, direction) => {
      if (sort === field) {
        direction = direction === 'asc' ? 'desc' : 'asc';
      } else {
        direction = 'desc'
      }
      dispatch({
        type: "SET_ORDER_BY_PREDICATE",
        orderByPredicate: `r.${direction}('${field}')`
      });
      dispatch(refreshExplorerBody());
      Segment.track({
        event: 'Sort Table Column',
        properties: {}
      });
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

      Segment.track({
        event: 'Resize Table Column',
        properties: {}
      });
    },
    onEditClick: (row) => {
      dispatch({
        type: "SET_ROW_EDIT",
        row
      });

      // Segment.track({
      //   event: 'tableview.row.editBtn',
      //   properties: {}
      // });
    },
    onDeleteClick: (rowToDelete) => {
      dispatch({
        type: 'TOGGLE_CONFIRM_ROW_DELETE',
        rowToDelete
      });

      // Segment.track({
      //   event: 'tableview.row.deleteBtn',
      //   properties: {}
      // });
    },
    saveRowInline: (originalRow, row) => {
      const string = JSON.stringify(row);

      dispatch(saveInlineEdit(originalRow, string));

      Segment.track({
        event: 'Inline Edit Field',
        properties: {}
      });
    }
  };
}

const ExplorerTableViewContainer = connect(mapStateToProps, mapDispatchToProps)(ExplorerTableView);

export default ExplorerTableViewContainer;

