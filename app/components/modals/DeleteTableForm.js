import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { deleteTable } from '../../data/tables.actions';
import Segment from '../../services/segment.service.js';
import * as types from '../../action-types';

const DeleteTableForm = ({
  showDeleteTableForm,
  selectedDatabase,
  dbConnection,
  tableToDelete,
  onClose,
  onDelete,
  deleteTableConfirmError,
  tableFormError
}) => {
  let nameInput;
  const submit = (e) => {
    e.preventDefault();
    onDelete(dbConnection, selectedDatabase, tableToDelete, nameInput.value);
  };
  const confirmationErrMsg = 'The name you typed does not match the name of the table you are trying to delete.';
  return (
    <Modal show={showDeleteTableForm} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Table</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={submit}>
          <div>
            <div className="alert alert-warning">Deleting the table will delete all the records in it. This action <strong>cannot</strong> be undone.</div>
            <p>Type in the name of the table <strong>{tableToDelete}</strong> to permanently delete it.</p>
            <input className="form-control" id="name" type="text" ref={(input) => {
              nameInput = input;
              if (nameInput) {
                nameInput.focus();
              }
            }}/>
          </div>
          <div className="errors">{deleteTableConfirmError ? confirmationErrMsg : ''}</div>
          <div className="errors">{tableFormError ? tableFormError.msg : ''}</div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} bsStyle="default" className="pull-left">Cancel</Button>
        <Button onClick={submit} bsStyle="primary" className="pull-right">Delete</Button>
      </Modal.Footer>
    </Modal>
  );
};


function mapStateToProps(state) {
  return {
    showDeleteTableForm: state.main.showDeleteTableForm,
    selectedDatabase: state.main.selectedDatabase,
    dbConnection: state.main.dbConnection,
    tableToDelete: state.main.tableToDelete,
    deleteTableConfirmError: state.main.deleteTableConfirmError,
    tableFormError: state.main.tableFormError
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onClose: () => {
      dispatch({
        type: types.TOGGLE_DELETE_TABLE_FORM,
        showDeleteTableForm: false
      });
      dispatch({
        type: types.SET_DELETE_TABLE_CONFIRM_ERROR,
        deleteTableConfirmError: false
      });
      dispatch({
        type: types.SET_TABLE_FORM_ERROR,
        tableFormError: ''
      });
    },
    onDelete: (dbConnection, selectedDatabase, tableName, confirmName) => {
      if (tableName == confirmName) {
        dispatch(deleteTable(dbConnection, selectedDatabase.name, tableName));
        dispatch({
          type: types.TOGGLE_DELETE_TABLE_FORM,
          showDeleteTableForm: false,
          database: selectedDatabase,
          tableToDelete: tableName
        });
        dispatch({
          type: types.SET_DELETE_TABLE_CONFIRM_ERROR,
          deleteTableConfirmError: false
        });

        Segment.track({
          event: 'table.delete'
        });
      } else {
        dispatch({
          type: types.SET_DELETE_TABLE_CONFIRM_ERROR,
          deleteTableConfirmError: true
        });
      }
    }
  }
};

const DeleteTableFormContainer = connect(mapStateToProps, mapDispatchToProps)(DeleteTableForm);

export default DeleteTableFormContainer;
