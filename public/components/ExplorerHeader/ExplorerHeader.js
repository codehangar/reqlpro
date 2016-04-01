var React = require('react');
var classNames = require('classnames');

var ExplorerHeader = React.createClass({
	getInitialState: function() {
    return this.props;
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps);
  },
  render: function() {
    return (
      <div className="row explorer-header">
        <div className="col-md-12">
          <div className="bread-crumbs">
            <p>{this.state.selectedTable.databaseName}</p> <i className="fa fa-arrow-right"></i> <p>{this.state.selectedTable.tableName}</p>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ExplorerHeader;