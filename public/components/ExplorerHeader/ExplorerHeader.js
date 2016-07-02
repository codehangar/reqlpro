const React = require('react');
const classNames = require('classnames');
const Segment = require('../../services/segment.service');
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

const ExplorerHeader = React.createClass({
  toggleExplorerBody: function(key, e) {
    e.preventDefault();
    this.props.store.toggleExplorerBody(key);

    Segment.track({
      event: 'explorer.toggleView',
      properties: {
        'view': key
      }
    });
  },
  refreshExplorerBody: function() {
    this.props.store.refreshExplorerBody();

    Segment.track({
      event: 'explorer.refreshExplorerBody',
      properties: {}
    });
  },
  updatePageLimit: function(e) {
    this.props.store.updatePageLimit(e.target.value);

    Segment.track({
      event: 'explorer.updatePageLimit',
      properties: {
        'limit': e.target.value
      }
    });
  },
  render: function() {

    let buttonClasses = {
      tree: classNames({
        'btn btn-default btn-sm': true,
        'fa': true,
        'fa-tree': true,
        'active': this.props.table.type === 'tree'
      }),
      table: classNames({
        'btn btn-default btn-sm': true,
        'fa': true,
        'fa-th': true,
        'active': this.props.table.type === 'table'
      }),
      code: classNames({
        'btn btn-default btn-sm': true,
        'fa': true,
        'fa-plus': true,
        'active': this.props.table.type === 'code'
      }),
      refresh: classNames({
        'btn btn-default btn-sm': true,
        'fa': true,
        'fa-refresh': true,
        'hidden': this.props.table.type === 'code'
      })
    };

    let breadCrumbText;
    if (this.props.table.type === 'code') {
      if (this.props.table.codeAction === 'update') {
        breadCrumbText = (
          <div className="breadcrumb-text-container">
            <span><i className="fa fa-database"></i> {this.props.table.databaseName} </span>
            <i className="fa fa-angle-right"></i>
            <span> <i className="fa fa-table"></i> {this.props.table.name} </span>
            <i className="fa fa-angle-right"></i>
            <span>Update</span>
          </div>
        );
      }
      if (this.props.table.codeAction === 'add') {
        breadCrumbText = (
          <div className="breadcrumb-text-container">
            <span><i className="fa fa-database"></i> {this.props.table.databaseName} </span>
            <i className="fa fa-angle-right"></i>
            <span> <i className="fa fa-table"></i> {this.props.table.name} </span>
            <i className="fa fa-angle-right"></i>
            <span>Insert</span>
          </div>
        );
      }
    } else {
      breadCrumbText = (
        <div className="breadcrumb-text-container">
          <span><i className="fa fa-database"></i> {this.props.table.databaseName} </span>
          <i className="fa fa-angle-right"></i>
          <span> <i className="fa fa-table"></i> {this.props.table.name} </span>
        </div>
      );
    }

    let queryProfile;
    if (this.props.table.lastResult) {
      queryProfile = '[' + this.props.table.lastResult.profile[0].description + ' - ' ;
      queryProfile += this.props.table.lastResult.profile[0]['duration(ms)'] + 'ms]';
    }

    const refreshTooltip = (
      <Tooltip id="tt-refresh-query">Refresh Query</Tooltip>
    );
    const addRecordTooltip = (
      <Tooltip id="tt-add-record">Add New Record</Tooltip>
    );
    const treeViewTooltip = (
      <Tooltip id="tt-tree-view">Switch to Tree View</Tooltip>
    );
    const tableViewTooltip = (
      <Tooltip id="tt-table-view">Switch to Table View</Tooltip>
    );


    return (
      <div className="explorer-header" id="explorer-header">
        <div className="bread-crumbs">
          {breadCrumbText}

          <div className="breadcrumb-text-container" style={{marginLeft: '20px'}}>
            {queryProfile}
          </div>

          <div className="pull-right">
          {
            (this.props.table.type === 'code') ? '' :
            (<span className="rows-per-page-selector">Rows per page:
            <select onChange={this.updatePageLimit} className="page-select" value={this.props.table.query.limit}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </span>)
          }
            <OverlayTrigger placement="bottom" overlay={refreshTooltip}>
              <span onClick={this.refreshExplorerBody} className={buttonClasses.refresh} />
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={addRecordTooltip}>
              <span onClick={this.toggleExplorerBody.bind(this, 'code')} className={buttonClasses.code} />
            </OverlayTrigger>
            <div className="btn-group" role="group">
              <OverlayTrigger placement="bottom" overlay={treeViewTooltip}>
                <span onClick={this.toggleExplorerBody.bind(this, 'tree')} className={buttonClasses.tree} />
              </OverlayTrigger>
              <OverlayTrigger placement="bottom" overlay={tableViewTooltip}>
                <span onClick={this.toggleExplorerBody.bind(this, 'table')} className={buttonClasses.table} />
              </OverlayTrigger>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ExplorerHeader;
