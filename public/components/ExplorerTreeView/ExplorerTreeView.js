var React = require('react');
var classNames = require('classnames');
import JSONTree from 'react-json-tree';

var ExplorerTreeView = React.createClass({
	getInitialState: function() {
    return this.props;
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps);
  },  
  render: function() {
    return (
      <div className="explorer-tree-view">
        <JSONTree data={this.state.data} />
      </div>
    );
  }
});

module.exports = ExplorerTreeView;