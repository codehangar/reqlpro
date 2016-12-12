var React = require('react');
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

var AddFavorite = React.createClass({
  render: function() {
    const addFavoriteTooltip = (
      <Tooltip id="tt-add-favorite">
        Add New <br /> Connection
      </Tooltip>
    );
    return (

      <OverlayTrigger placement="top" overlay={addFavoriteTooltip}>
        <div className="add-favorite">
          <i onClick={this.props.addFavorite} className="fa fa-plus add-favorites-icon"></i>
        </div>
      </OverlayTrigger>
    );
  }
});

module.exports = AddFavorite;
