const React = require('react');
const classNames = require('classnames');
const Segment = require('../../services/segment.service');

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
  },
  updatePageLimit: function(e) {
    this.props.store.updatePageLimit(e.target.value);
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

    return (
      <div className="explorer-header" id="explorer-header">
        <div className="bread-crumbs">
          {breadCrumbText}

          <div className="pull-right">
          {
            (this.props.table.type === 'code') ? '' :
            (<span className="rows-per-page-selector">Rows per page:
            <select onChange={this.updatePageLimit} className="page-select">
              <option>5</option>
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
          </span>)
          }
            <span onClick={this.refreshExplorerBody} className={buttonClasses.refresh} />
            <span onClick={this.toggleExplorerBody.bind(this, 'code')} className={buttonClasses.code} />
            <div className="btn-group" role="group">
              <span onClick={this.toggleExplorerBody.bind(this, 'tree')} className={buttonClasses.tree} />
              <span onClick={this.toggleExplorerBody.bind(this, 'table')} className={buttonClasses.table} />
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ExplorerHeader;
