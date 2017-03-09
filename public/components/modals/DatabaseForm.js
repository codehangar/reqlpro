import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { createDatabase } from '../Sidebar/Databases/databases.actions';
import Segment from '../../services/segment.service.js';
import * as types from '../../action-types';

const DatabaseForm = ({
  showDatabaseForm,
  dbConnection,
  onClose,
  onSave,
  databaseFormError
}) => {
  let nameInput;
  return (
    <Modal show={showDatabaseForm} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Database</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSave(dbConnection, nameInput.value)
        }}>
          <div>
            <label>Database Name</label>
            <input className="form-control" id="name" type="text" ref={(input) => {
              nameInput = input;
              if (input) {
                nameInput.focus();
              }
            }}/>
          </div>
          <span className="errors">{databaseFormError ? databaseFormError.msg : ' '}</span>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} bsStyle="default" className="pull-left">Cancel</Button>
        <Button onClick={() => {
          onSave(dbConnection, nameInput.value)
        }} bsStyle="primary" className="pull-right">Save</Button>
      </Modal.Footer>
    </Modal>
  );
};


const mapStateToProps = (state) => {
  return {
    showDatabaseForm: state.main.showDatabaseForm,
    dbConnection: state.main.dbConnection,
    databaseFormError: state.main.databaseFormError
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClose: () => {
      dispatch({
        type: types.TOGGLE_DATABASE_FORM,
        showDatabaseForm: false
      });
      dispatch({
        type: types.SET_DATABASE_FORM_ERROR,
        databaseFormError: ''
      });
    },
    onSave: (dbConnection, database) => {
      dispatch(createDatabase(dbConnection, database));
  
      //gets rid of error, if validation error ocurred in a previous attempt to create a database
      dispatch({
        type: types.SET_DATABASE_FORM_ERROR,
        databaseFormError: ''
      });
      Segment.track({ event: 'database.save' });
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(DatabaseForm);
