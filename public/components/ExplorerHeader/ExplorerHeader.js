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
        'btn': true,
        'fa': true,
        'fa-tree': true,
        'active': this.props.table.type === 'tree'
      }),
      table: classNames({
        'btn': true,
        'fa': true,
        'fa-th': true,
        'active': this.props.table.type === 'table'
      }),
      code: classNames({
        'btn': true,
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
            <p>{this.props.table.databaseName}</p>
            <i className="fa fa-arrow-right"></i>
            <p>{this.props.table.name}</p>
            <i className="fa fa-arrow-right"></i>
            <p>Update</p>
          </div>
        );
      }
      if(this.props.table.codeAction === 'add') {
        breadCrumbText = (
          <div className="breadcrumb-text-container">
            <p>{this.props.table.databaseName}</p>
            <i className="fa fa-arrow-right"></i>
            <p>{this.props.table.name}</p>
            <i className="fa fa-arrow-right"></i>
            <p>Insert</p>
          </div>
        );
      }
    } else {
      breadCrumbText = (
        <div className="breadcrumb-text-container">
          <p>{this.props.table.databaseName}</p>
          <i className="fa fa-arrow-right"></i>
          <p>{this.props.table.name}</p>
        </div>
      );
    }

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="explorer-header">
            <div className="bread-crumbs">
              {breadCrumbText}
              <div className="pull-right">
                <button onClick={this.toggleExplorerBody.bind(this, 'code')} className={buttonClasses.code} />
                <button onClick={this.toggleExplorerBody.bind(this, 'tree')} className={buttonClasses.tree} />
                <button onClick={this.toggleExplorerBody.bind(this, 'table')} className={buttonClasses.table} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ExplorerHeader;