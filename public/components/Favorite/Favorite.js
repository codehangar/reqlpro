var React = require('react');
var classNames = require('classnames');
var RethinkDbClient = window.rethinkDbClient;

var Favorite = React.createClass({
  render: function() {
    const createMarkup = () => {
      return {
        __html: this.props.favorite.identicon
      };
    };

    const favoriteClasses = {
      name: classNames({
        'favorite': true,
        'active': this.props.selectedFavorite.index === this.props.favorite.index,
      })
    };

    return (
      <div className={favoriteClasses.name} onClick={() => {
        this.props.connectFavorite(this.props.favorite)
      }}>
        <div className="favorite-identicon"><div dangerouslySetInnerHTML={createMarkup()} /></div>
        <p className="text-center">{this.props.favorite.name}</p>
      </div>
    );
  }
});

module.exports = Favorite;
