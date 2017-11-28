import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { deleteDatabase } from '../../actions';
import * as types from '../../action-types';

const DeleteDatabaseForm = ({
  showDeleteDatabaseForm,
  dbConnection,
  dbToDelete,
  onClose,
  onDelete,
  deleteDatabaseConfirmError,
  databaseFormError
}) => {
  let nameInput;
  const confirmationErrMsg = 'The name you typed does not match the name of the database you are trying to delete.';
  return (
    <Modal show={showDeleteDatabaseForm} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Database</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="alert alert-warning">Deleting the database will delete all the tables in it. This action
          <strong>cannot</strong> be undone.
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          onDelete(dbConnection, dbToDelete, nameInput.value)
        }}>
          <div>
            <p>Type in the name of the database <strong>{dbToDelete}</strong> to permanently delete it.</p>
            <input className="form-control" id="name" type="text" ref={(input) => {
              nameInput = input;
              if (input) {
                nameInput.focus();
              }
            }}/>
          </div>
          <div className="errors">{deleteDatabaseConfirmError ? confirmationErrMsg : ''}</div>
          <div className="errors">{databaseFormError ? databaseFormError.msg : ''}</div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} bsStyle="default" className="pull-left">Cancel</Button>
        <Button onClick={() => onDelete(dbConnection, dbToDelete, nameInput.value)} bsStyle="primary"
                className="pull-right">Delete</Button>
      </Modal.Footer>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return {
    showDeleteDatabaseForm: state.main.showDeleteDatabaseForm,
    selectedDatabase: state.main.selectedDatabase,
    dbConnection: state.main.dbConnection,
    dbToDelete: state.main.dbToDelete,
    deleteDatabaseConfirmError: state.main.deleteDatabaseConfirmError,
    databaseFormError: state.main.databaseFormError
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClose: () => {
      dispatch({
        type: types.TOGGLE_DELETE_DATABASE_FORM,
        showDeleteDatabaseForm: false
      });
      dispatch({
        type: types.SET_DELETE_DATABASE_CONFIRM_ERROR,
        deleteDatabaseConfirmError: false
      });
      dispatch({
        type: types.SET_DATABASE_FORM_ERROR,
        databaseFormError: ''
      });
    },
    onDelete: (dbConnection, dbName, confirmName) => {
      if (dbName == confirmName) {
        dispatch(deleteDatabase(dbConnection, dbName));
        dispatch({
          type: types.TOGGLE_DELETE_DATABASE_FORM,
          showDeleteDatabaseForm: false
        });
        dispatch({
          type: types.SET_DELETE_DATABASE_CONFIRM_ERROR,
          deleteDatabaseConfirmError: false
        });
      } else {
        dispatch({
          type: types.SET_DELETE_DATABASE_CONFIRM_ERROR,
          deleteDatabaseConfirmError: true
        });
      }
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteDatabaseForm);
