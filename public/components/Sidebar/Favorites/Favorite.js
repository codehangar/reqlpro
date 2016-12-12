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

const Favorite = ({
  name,
  identicon,
  onConnectionClick,
  active
}) => {
  const classes = favoriteClasses(active).name;
  return (
    <div className={classes} onClick={onConnectionClick}>
      <div className="favorite-identicon">
        <div dangerouslySetInnerHTML={createMarkup(identicon)}/>
      </div>
      <p className="text-center">{name}</p>
    </div>
  );
};

export default Favorite;
