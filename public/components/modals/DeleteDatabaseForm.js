import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { deleteDatabase } from '../../actions';
import Segment from '../../services/segment.service.js';

const DeleteDatabaseForm = ({
  showDeleteDatabaseForm,
  dbConnection,
  dbToDelete,
  onClose,
  onDelete,
  deleteDatabaseError,
  dropDatabaseError
}) => {
  let nameInput;
  return (
    <Modal show={showDeleteDatabaseForm} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Database</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="alert alert-warning">Deleting the database will delete all the tables in it. This action cannot be undone. Please type the name of the database to confirm.</div>
        <form onSubmit={(e) => {
          e.preventDefault();
          onDelete(dbConnection, dbToDelete, nameInput.value)
        }}>
          <div>
            <label>Type in the name of the database ({dbToDelete}) to permanently delete it. This action cannot be
              undone.</label>
            <input className="form-control" id="name" type="text" ref={(input) => {
              nameInput = input;
              if (input) {
                nameInput.focus();
              }
            }}/>
          </div>
          <div className="text-danger" style={{marginTop:16}}>{dropDatabaseError ? dropDatabaseError.msg : ' '}
          {deleteDatabaseError ? <p className="text-danger" style={{marginTop:16}}>The name you typed does not match the name of the database you are trying to delete.</p> : ''}
        </div>
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
    deleteDatabaseError: state.main.deleteDatabaseError,
    dropDatabaseError: state.main.dropDatabaseError
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClose: () => {
      dispatch({
        type: "TOGGLE_DELETE_DATABASE_FORM",
        showDeleteDatabaseForm: false
      });
      dispatch({
        type:"SET_DELETE_DATABASE_ERROR",
        deleteDatabaseError: false
      });
      dispatch({
        type:'SET_DATABASE_DROP_ERROR',
        dropDatabaseError: ' '
      });

    },
    onDelete: (dbConnection, dbName, confirmName) => {
      if (dbName == confirmName) {
        console.log('deleeeeeeting', dbConnection, dbName, confirmName)
        dispatch(deleteDatabase(dbConnection, dbName));
        dispatch({
          type: "TOGGLE_DELETE_DATABASE_FORM",
          showDeleteDatabaseForm: false
        });
        Segment.track({
          event: 'database.delete'
        });
      } else {
        dispatch({
          type:"SET_DELETE_DATABASE_ERROR",
          deleteDatabaseError: true
        });
      }
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteDatabaseForm);
