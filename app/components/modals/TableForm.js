import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { createTable } from '../../data/tables.actions';
import * as types from '../../action-types';

const TableForm = ({
  showTableForm,
  dbConnection,
  dbToEdit,
  onClose,
  onSave,
  tableFormError
}) => {
  let nameInput;
  const submit = (e) => {
    e.preventDefault();
    onSave(dbConnection, dbToEdit, nameInput.value)
  };
  return (
    <Modal show={showTableForm} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Table</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={submit}>
          <div>
            <label>Name</label>
            <input className="form-control" id="name" type="text" ref={(input) => {
              nameInput = input;
              if (nameInput) {
                nameInput.focus();
              }
            }}/>
          </div>
          <div className="errors">{tableFormError ? tableFormError.msg : '' }</div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} bsStyle="default" className="pull-left">Cancel</Button>
        <Button onClick={submit} bsStyle="primary" className="pull-right">Save</Button>
      </Modal.Footer>
    </Modal>
  );
};


const mapStateToProps = (state) => {
  return {
    showTableForm: state.main.showTableForm,
    dbToEdit: state.main.dbToEdit,
    dbConnection: state.main.dbConnection,
    tableFormError: state.main.tableFormError,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClose: () => {
      dispatch({
        type: types.SET_TABLE_FORM_ERROR,
        tableFormError: ''
      });
      dispatch({
        type: types.TOGGLE_TABLE_FORM,
        showTableForm: false
      });

    },
    onSave: (dbConnection, database, table) => {
    dispatch(createTable(dbConnection, database.name, table));
    
    //gets rid of error, if validation error ocurred in a previous attempt to create a table
      dispatch({
        type: types.SET_TABLE_FORM_ERROR,
        tableFormError: ''
      });
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(TableForm);
