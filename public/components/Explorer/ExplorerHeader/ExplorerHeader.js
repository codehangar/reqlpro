import React from 'react';
import classNames from 'classnames';
import Segment from '../../../services/segment.service';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { connect } from 'react-redux';
import { queryTable, refreshExplorerBody } from '../../../actions';
import Breadcrumbs from './Breadcrumbs';
import FilterPredicate from './FilterPredicate';
import OrderByPredicate from './OrderByPredicate';
import QueryProfile from './QueryProfile';

const ExplorerHeader = ({
  table,
  connection,
  dbConnection,
  selectedTable,
  onUpdatePageLimit,
  refreshExplorerBody,
  toggleExplorerBody
}) => {

  let buttonClasses = {
    tree: classNames({
      'btn btn-default btn-sm': true,
      'fa': true,
      'fa-tree': true,
      'active': table.type === 'tree'
    }),
    table: classNames({
      'btn btn-default btn-sm': true,
      'fa': true,
      'fa-th': true,
      'active': table.type === 'table'
    }),
    code: classNames({
      'btn btn-default btn-sm': true,
      'fa': true,
      'fa-plus': true,
      'active': table.type === 'code'
    }),
    refresh: classNames({
      'btn btn-default btn-sm': true,
      'fa': true,
      'fa-refresh': true,
      'hidden': table.type === 'code'
    })
  };

  const refreshTooltip = <Tooltip id="tt-refresh-query">Refresh Query</Tooltip>;
  const addRecordTooltip = <Tooltip id="tt-add-record">Add New Record</Tooltip>;
  const treeViewTooltip = <Tooltip id="tt-tree-view">Switch to Tree View</Tooltip>;
  const tableViewTooltip = <Tooltip id="tt-table-view">Switch to Table View</Tooltip>;

  const rowsPerPage = (
    <span className="rows-per-page-selector">Rows per page:
      <select onChange={(e) => onUpdatePageLimit(e, dbConnection, table.databaseName, table.name, selectedTable)}
              className="page-select" value={table.query.limit} disabled={table.queryError}>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </span>
  );

  return (
    <div className="explorer-header" id="explorer-header">
      <div className="explorer-header-row">
        <Breadcrumbs connection={connection} table={table}/>
        <div className="pull-right">
          {(table.type === 'code') ? '' : rowsPerPage}
          <OverlayTrigger placement="bottom" overlay={refreshTooltip}>
            <button onClick={refreshExplorerBody} className={buttonClasses.refresh}/>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={addRecordTooltip}>
            <button onClick={() => toggleExplorerBody('code')} className={buttonClasses.code} disabled={!!table.queryError}/>
          </OverlayTrigger>
          <div className="btn-group" role="group">
            <OverlayTrigger placement="bottom" overlay={treeViewTooltip}>
              <button onClick={() => toggleExplorerBody('tree')} className={buttonClasses.tree} disabled={table.queryError}/>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={tableViewTooltip}>
              <button onClick={() => toggleExplorerBody('table')} className={buttonClasses.table} disabled={table.queryError}/>
            </OverlayTrigger>
          </div>
        </div>
      </div>

      <div className="explorer-header-row">
        <span className="query-builder">
          {(table.type === 'code') ? '' : <FilterPredicate />}
          {(table.type === 'code') ? '' : <OrderByPredicate />}
        </span>
        <QueryProfile lastResult={table.lastResult}/>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    connection: state.connection.selected,
    dbConnection: state.main.dbConnection,
    selectedTable: state.main.selectedTable
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onUpdatePageLimit: (e, dbConnection, databaseName, tableName, selectedTable) => {
      console.log('onUpdatePageLimit e', selectedTable);
      dispatch({
        type: "SET_TABLE_PAGE_LIMIT",
        limit: e.target.value
      });
      let params = Object.assign({}, selectedTable.query)
      params.limit = e.target.value;
      dispatch(queryTable(dbConnection, databaseName, tableName, params));

      Segment.track({
        event: 'Set Rows per Page',
        properties: {
          'limit': e.target.value,
          'table size': selectedTable.size
        }
      });
    },
    refreshExplorerBody: () => {
      console.log('refreshExplorerBody e');
      dispatch(refreshExplorerBody());

      Segment.track({
        event: 'explorer.refreshExplorerBody',
        properties: {}
      });
    },
    toggleExplorerBody: (key) => {
      console.log('toggleExplorerBody e', key);
      dispatch({
        type: "HIDE_CONNECTION_FORM"
      });
      dispatch({
        type: "TOGGLE_EXPLORER_BODY",
        key: key
      });
      Segment.track({
        event: 'explorer.toggleExplorerBody',
        properties: {
          key: key
        }
      });
      if(key === 'code'){
        Segment.track({
          event: 'explorer.addRow',
        });
      }
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExplorerHeader);
