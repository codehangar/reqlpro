var React = require('react');
var classNames = require('classnames');

var DatabasesHeader = React.createClass({
	getInitialState: function() {
    return {};
  },
  render: function() {
    return (
      <div>
        {this.props.selectedFavorite.name}
      </div>
    );
  }
});

module.exports = DatabasesHeader;