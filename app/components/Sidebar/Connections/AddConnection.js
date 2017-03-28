const React = require('react');
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const AddConnection = ({ addConnection }) => {

  const addConnectionTooltip = (
    <Tooltip id="tt-add-favorite">
      Add New <br /> Connection
    </Tooltip>
  );
  return (

    <OverlayTrigger placement="top" overlay={addConnectionTooltip}>
      <div className="add-favorite">
        <i onClick={addConnection} className="fa fa-plus add-favorites-icon"/>
      </div>
    </OverlayTrigger>
  );
};

export default AddConnection;
