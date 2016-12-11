import React from 'react';
import { connect } from 'react-redux';
import { Field } from 'react-redux-form';
import { Modal, Button } from 'react-bootstrap';
import {createDatabase} from '../../actions';

const DatabaseForm = ({
  showDatabaseForm,
  selectedDatabase,
  dbConnection,
  onClose,
  onSave
}) => {
  return (
    <Modal show={showDatabaseForm} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Database</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div>
            <Field model="main.selectedDatabase.name">
              <label>Database Name</label>
              <input className="form-control" id="name" type="text" />
            </Field>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} bsStyle="default" className="pull-left">Cancel</Button>
        <Button onClick={() => onSave(dbConnection, selectedDatabase)} bsStyle="primary" className="pull-right">Save</Button>
      </Modal.Footer>
    </Modal>
  );
};


function mapStateToProps(state) {
  return {
    showDatabaseForm: state.main.showDatabaseForm,
    selectedDatabase: state.main.selectedDatabase,
    dbConnection: state.main.dbConnection,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onClose: () => {
      dispatch({
        type: "TOGGLE_DATABASE_FORM",
        showDatabaseForm: false
      });
    },
    onSave: (dbConnection, database) => {
      dispatch(createDatabase(dbConnection, database));
    }
  }
};

const DatabaseFormContainer = connect(mapStateToProps, mapDispatchToProps)(DatabaseForm);

export default DatabaseFormContainer;