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
      add: classNames({
        'btn': true,
        'fa': true,
        'fa-plus': true,
        'active': this.props.table.type === 'add'
      })
    };

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="explorer-header">
            <div className="bread-crumbs">
              <p>{this.props.table.databaseName}</p>
              <i className="fa fa-arrow-right"></i>
              <p>{this.props.table.name}</p>
              <div className="pull-right">
                <button onClick={this.toggleExplorerBody.bind(this, 'add')} className={buttonClasses.add} />
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