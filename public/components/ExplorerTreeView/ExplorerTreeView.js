var React = require('react');
var classNames = require('classnames');

var ExplorerTreeView = React.createClass({
	getInitialState: function() {
    return this.props;
  },
  render: function() {
    return (
      <div className="explorer-tree-view">
        treeview
      </div>
    );
  }
});

module.exports = ExplorerTreeView;