var React = require('react');
var classNames = require('classnames');
var RethinkDbClient = window.rethinkDbClient;

var Favorite = React.createClass({
	getInitialState: function() {
    return this.props;
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps);
  },
  connectFavorite: function() {
    RethinkDbClient.updateSelectedFavorite(this.state.favorite);
  },
  createMarkup: function() {
    return {__html: this.state.favorite.identicon};
  },
  render: function() {
    var favoriteClasses = {
      name: classNames({
        'favorite': true,
        'active': RethinkDbClient.selectedFavorite.index === this.state.favorite.index,
      })
    };
    return (
      <div className={favoriteClasses.name} onClick={this.connectFavorite}>
        <div className="favorite-identicon"><div dangerouslySetInnerHTML={this.createMarkup()} /></div>
        <p className="text-center">{this.state.favorite.name}</p>
      </div>
    );
  }
});

module.exports = Favorite;