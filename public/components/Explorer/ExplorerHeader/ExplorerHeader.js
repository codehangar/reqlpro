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
      'active': selectedTable.type === 'tree'
    }),
    table: classNames({
      'btn btn-default btn-sm': true,
      'fa': true,
      'fa-th': true,
      'active': selectedTable.type === 'table'
    }),
    code: classNames({
      'btn btn-default btn-sm': true,
      'fa': true,
      'fa-plus': true,
      'active': selectedTable.type === 'code'
    }),
    refresh: classNames({
      'btn btn-default btn-sm': true,
      'fa': true,
      'fa-refresh': true,
      'hidden': selectedTable.type === 'code'
    })
  };

  const refreshTooltip = <Tooltip id="tt-refresh-query">Refresh Query</Tooltip>;
  const addRecordTooltip = <Tooltip id="tt-add-record">Add New Record</Tooltip>;
  const treeViewTooltip = <Tooltip id="tt-tree-view">Switch to Tree View</Tooltip>;
  const tableViewTooltip = <Tooltip id="tt-table-view">Switch to Table View</Tooltip>;

  const rowsPerPage = (
    <span className="rows-per-page-selector">Rows per page:
      <select
        onChange={(e) => onUpdatePageLimit(e, dbConnection, selectedTable.databaseName, selectedTable.name, selectedTable)}
        className="page-select" value={selectedTable.query.limit} disabled={selectedTable.queryError}>
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
        <Breadcrumbs connection={connection} table={selectedTable}/>
        <div className="pull-right">
          {(selectedTable.type === 'code') ? '' : rowsPerPage}
          <OverlayTrigger placement="bottom" overlay={refreshTooltip}>
            <button onClick={refreshExplorerBody} className={buttonClasses.refresh}/>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={addRecordTooltip}>
            <button onClick={() => toggleExplorerBody('code')} className={buttonClasses.code}
                    disabled={!!selectedTable.queryError}/>
          </OverlayTrigger>
          <div className="btn-group" role="group">
            <OverlayTrigger placement="bottom" overlay={treeViewTooltip}>
              <button onClick={() => toggleExplorerBody('tree')} className={buttonClasses.tree}
                      disabled={selectedTable.queryError}/>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={tableViewTooltip}>
              <button onClick={() => toggleExplorerBody('table')} className={buttonClasses.table}
                      disabled={selectedTable.queryError}/>
            </OverlayTrigger>
          </div>
        </div>
      </div>

      <div className="explorer-header-row">
        <span className="query-builder">
          {(selectedTable.type === 'code') ? '' : <FilterPredicate />}
          {(selectedTable.type === 'code') ? '' : <OrderByPredicate />}
        </span>
        <QueryProfile lastResult={selectedTable.lastResult}/>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    connection: state.connection.selected,
    dbConnection: state.main.dbConnection,
    selectedTable: state.main.selectedTable || {}
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onUpdatePageLimit: (e, dbConnection, databaseName, tableName, selectedTable) => {
      dispatch({
        type: "SET_TABLE_PAGE_LIMIT",
        limit: e.target.value
      });
      dispatch(refreshExplorerBody());

      Segment.track({
        event: 'Set Rows per Page',
        properties: {
          'limit': e.target.value,
          'table size': selectedTable.size
        }
      });
    },
    refreshExplorerBody: () => {
      dispatch(refreshExplorerBody());

      Segment.track({
        event: 'explorer.refreshExplorerBody',
        properties: {}
      });
    },
    toggleExplorerBody: (key) => {
      dispatch({
        type: "HIDE_CONNECTION_FORM"
      });
      dispatch({
        type: "TOGGLE_EXPLORER_BODY",
        key: key
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExplorerHeader);
