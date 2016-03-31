var React = require('react');
var classNames = require('classnames');

var Database = React.createClass({
	getInitialState: function() {
    return {};
  },
  render: function() {
    return (
      <div className="database">
        {this.props.database.name}
      </div>
    );
  }
});

module.exports = Database;