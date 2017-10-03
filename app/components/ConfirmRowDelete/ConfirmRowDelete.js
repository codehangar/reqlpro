import React from'react';
import ReactDOM from'react-dom';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {Modal, Button} from 'react-bootstrap';
import {deleteRow} from '../../actions';


const ConfirmRowDelete = ({
  showConfirmRowDelete,
  rowToDelete,
  handleCancel,
  rowDeleteError,
  handleDelete
}) => {

  let deleteBtn;

  const errorClass = classNames(
    'alert',
    'alert-danger', {
      'show': rowDeleteError,
      'hidden': !rowDeleteError
    });

  const onModalOpen = () => {
    ReactDOM.findDOMNode(deleteBtn).focus();
  };

  const recordId = rowToDelete ? rowToDelete.id : '';

  return (
    <Modal show={showConfirmRowDelete} onHide={handleCancel} onEnter={onModalOpen}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Record - {recordId}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this record?</p>
        <p className={errorClass}>{rowDeleteError}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleCancel} bsStyle="default" className="pull-left">Cancel</Button>
        <Button ref={btn => deleteBtn = btn} onClick={() => handleDelete(rowToDelete)} bsStyle="primary" className="pull-right">Delete</Button>
      </Modal.Footer>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return {
    showConfirmRowDelete: state.main.showConfirmRowDelete,
    rowToDelete: state.main.rowToDelete,
    rowDeleteError: state.main.rowDeleteError
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleCancel: function() {
      dispatch({
        type: 'TOGGLE_CONFIRM_ROW_DELETE'
      });
    },
    handleDelete: function(rowToDelete) {
      dispatch(deleteRow(rowToDelete));
    }
  };
};

const ConfirmRowDeleteContainer = connect(mapStateToProps, mapDispatchToProps)(ConfirmRowDelete);

export default ConfirmRowDeleteContainer;
