var React = require('react');
var classNames = require('classnames');
var RethinkDbClient = window.rethinkDbClient;

var ExplorerHeader = React.createClass({
  toggleExplorerBody: function(key, e) {
    e.preventDefault();
    RethinkDbClient.toggleExplorerBody(key);
  },
  // toogleAddItem: function() {
  //   RethinkDbClient.insert({
  //     name: 'Johnny ' + (new Date()).getSeconds(),
  //     age: (new Date()).getSeconds()
  //   });
  // },
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
      })
    };

    var breadCrumbText;
    console.log(this.props.table);
    if(this.props.table.type === 'code') {
      if(this.props.table.codeAction === 'update') {
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
      if(this.props.table.codeAction === 'add') {
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