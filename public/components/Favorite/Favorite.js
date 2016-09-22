import React from 'react';
import classNames from 'classnames';

const createMarkup = (html) => {
  return {
    __html: html
  };
};

const favoriteClasses = (active) => {
  return {
    name: classNames({
      'favorite': true,
      'active': active,
    })
  }
};

const Favorite = () => ({
  render: function() {
    const {name, identicon, onConnectionClick} = this.props;
    const classes = favoriteClasses(this.props.active).name;
    return (
      <div className={classes} onClick={onConnectionClick}>
         <div className="favorite-identicon"><div dangerouslySetInnerHTML={createMarkup(identicon)} /></div>
         <p className="text-center">{name}</p>
       </div>
    );
  }
});

module.exports = Favorite;
