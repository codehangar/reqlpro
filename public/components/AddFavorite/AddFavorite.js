var React = require('react');

var AddFavorite = React.createClass({
  render: function() {
    return (
      <div className="add-favorite">
        <i onClick={this.props.addFavorite} className="fa fa-plus add-favorites-icon"></i>
      </div>
    );
  }
});

module.exports = AddFavorite;
