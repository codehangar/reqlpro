const React = require('react');
const classNames = require('classnames');
const RethinkDbClient = window.rethinkDbClient;

// const Favorite = () => {
//   render: function() {
//     console.log('Favorite', this);
//     // {index, name, indenticon, onClick} = this.props;
    const createMarkup = (html) => {
      return {
        __html: html
      };
    };

    const favoriteClasses = {
      name: classNames({
        'favorite': true,
        // 'active': this.propsactive,
      })
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

var Favorite = React.createClass({

  render: function() {
    console.log('this.props Favorite', this.props)
    const {onClick, identicon, name} = this.props;
    // console.log('Favorite', this.props);
    return (
      <div className={favoriteClasses.name} onClick={onClick}>
         <div className="favorite-identicon"><div dangerouslySetInnerHTML={createMarkup(identicon)} /></div>
         <p className="text-center">{name}</p>
       </div>
    );
  }
});

module.exports = Favorite;
