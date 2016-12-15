import React from 'react';
import { connect } from 'react-redux';
import { Field } from 'react-redux-form';
import { Modal, Button } from 'react-bootstrap';
import {deleteDatabase} from '../../actions';

const DeleteDatabaseForm = ({
  showDeleteDatabaseForm,
  selectedDatabase,
  dbConnection,
  dbToDelete,
  onClose,
  onDelete
}) => {
  // const dbCopy = Object.assign({}, selectedDatabase);
  // const dbName = dbCopy.name;
  if(selectedDatabase)
    console.log('the same?',dbToDelete === selectedDatabase.name, dbToDelete, selectedDatabase.name)
  return (
    <Modal show={showDeleteDatabaseForm} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Database</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div>
            <Field model="main.selectedDatabase.name">
              <label>Type in the name of the database to permanently delete it. This action cannot be undone.</label>
              <input className="form-control" id="name" type="text" />
            </Field>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} bsStyle="default" className="pull-left">Cancel</Button>
        <Button onClick={() => onDelete(dbConnection, dbToDelete, selectedDatabase.name)} bsStyle="primary" className="pull-right">Delete</Button>
      </Modal.Footer>
    </Modal>
  );
};


function mapStateToProps(state) {
  return {
    showDeleteDatabaseForm: state.main.showDeleteDatabaseForm,
    selectedDatabase: state.main.selectedDatabase,
    dbConnection: state.main.dbConnection,
    dbToDelete: state.main.dbToDelete
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onClose: () => {
      dispatch({
        type: "TOGGLE_DELETE_DATABASE_FORM",
        showDeleteDatabaseForm: false
      });
    },
    onDelete: (dbConnection, dbName, confirmName) => {
      if (dbName == confirmName){
        console.log('deleeeeeeting',dbConnection, dbName, confirmName)
        dispatch(deleteDatabase(dbConnection, dbName));
        dispatch({
          type: "TOGGLE_DELETE_DATABASE_FORM",
          showDeleteDatabaseForm: false
        });
      }else{
        //show error
      }
    }
  }
};

const DeleteDatabaseFormContainer = connect(mapStateToProps, mapDispatchToProps)(DeleteDatabaseForm);

export default DeleteDatabaseFormContainer;