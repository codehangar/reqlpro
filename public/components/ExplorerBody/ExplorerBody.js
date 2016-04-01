var React = require('react');
var classNames = require('classnames');
var ExplorerTreeView = require('../ExplorerTreeView/ExplorerTreeView')

var ExplorerBody = React.createClass({
	getInitialState: function() {
    return this.props;
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps);
  },
  render: function() {
    var explorerBody;
    if(this.state.selectedTable.type === 'tree') {
      explorerBody = <ExplorerTreeView data={this.state.selectedTable.data} />
    }
    return (
      <div className="row explorer-body">
        <div className="col-md-12">
          {explorerBody}
        </div>
      </div>
    );
  }
});

module.exports = ExplorerBody;