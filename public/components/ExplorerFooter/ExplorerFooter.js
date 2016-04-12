var React = require('react');
var classNames = require('classnames');

var ExplorerFooter = React.createClass({
  getInitialState: function() {
    return this.props;
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps);
  },
  render: function() {
    return (
      <div className="row">
        <div className="col-md-12">
          <footer className="footer explorer-footer">
            Displaying {this.state.selectedTable.data.length} rows
          </footer>
        </div>
      </div>
    );
  }
});

module.exports = ExplorerFooter;