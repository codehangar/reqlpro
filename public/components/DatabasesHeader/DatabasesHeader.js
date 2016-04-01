var React = require('react');
var classNames = require('classnames');

var DatabasesHeader = React.createClass({
	getInitialState: function() {
    return {};
  },
  render: function() {
    return (
      <div>
        <p className="databases-header">{this.props.selectedFavorite.name}</p>
      </div>
    );
  }
});

module.exports = DatabasesHeader;