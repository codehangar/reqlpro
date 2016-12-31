import React from'react';
import {connect} from "react-redux";
import classNames from'classnames';
import Segment from'../../services/segment.service.js';
import {Modal, Button} from 'react-bootstrap';

// import {deleteRow} from '../../../actions';


const ConfirmRowDelete = ({
  showConfirmRowDelete,
  rowToDelete,
  handleCancel,
  handleDelete
}) => {

  const classes = {
    confirmRowDelete: classNames(
      'ConfirmRowDelete',
      {
        'show': showConfirmRowDelete,
        'hidden': !showConfirmRowDelete
      }
    )
  };

  const recordId = rowToDelete ? rowToDelete.id : '';

  return (
    <Modal show={showConfirmRowDelete} onHide={handleCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Record - {recordId}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>Are you sure you want to delete this record?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleCancel} bsStyle="default" className="pull-left">Cancel</Button>
        <Button onClick={handleDelete} bsStyle="primary" className="pull-right">Delete</Button>
      </Modal.Footer>
    </Modal>
  );

};

const mapStateToProps = (state) => {
  console.log('state.main.showConfirmRowDelete', state.main.showConfirmRowDelete);
  return {
    showConfirmRowDelete: state.main.showConfirmRowDelete,
    rowToDelete: state.main.rowToDelete
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleCancel: function() {
      dispatch({
        type: 'TOGGLE_CONFIRM_ROW_DELETE'
      });

      Segment.track({
        event: 'tableview.row.deleteCancel',
        properties: {}
      });
    },
    handleDelete: function() {
      dispatch(deleteRow(this.props.rowToDelete));

      Segment.track({
        event: 'tableview.row.deleteConfirm',
        properties: {}
      });
    }
  };
};

const ConfirmRowDeleteContainer = connect(mapStateToProps, mapDispatchToProps)(ConfirmRowDelete);

export default ConfirmRowDeleteContainer;