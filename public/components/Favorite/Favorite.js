import React from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux';


// const Favorite = () => {
//   render: function() {
//     console.log('Favorite', this);
//     // {index, name, indenticon, onClick} = this.props;
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

//     return (
//       <div>Hi</div>
//       // <div className={favoriteClasses.name} onClick={onClick}>
//       //   <div className="favorite-identicon"><div dangerouslySetInnerHTML={createMarkup()} /></div>
//       //   <p className="text-center">{name}</p>
//       // </div>
//     );
//   }
// };


const Favorite = ({
  onClick
}) => ({
  render: function() {
    console.log(' ********* this.props Favorite', this.props)
    const {name, identicon} = this.props;
    // console.log('Favorite', this.props);
    const classes = favoriteClasses(this.props.active).name;
    return (
      <div className={classes} onClick={onClick}>
         <div className="favorite-identicon"><div dangerouslySetInnerHTML={createMarkup(identicon)} /></div>
         <p className="text-center">{name}</p>
       </div>
    );
  }
});


const mapStateToProps = (state) => {
  // console.log('Favorite', state)
  return {

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClickAddConnection: (favorite) =>{
      dispatch({
        type: "SHOW_CONNECTION_FORM",
        mode: 'NEW'
      });
    },
    onConnectionClick: (connection) =>{
      getConnection(dispatch, connection);
    }
  }
};

const FavoriteContainer = connect(mapStateToProps, mapDispatchToProps)(Favorite);

module.exports = FavoriteContainer;
