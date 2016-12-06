import React from 'react';
import { connect } from 'react-redux';
import { Field } from 'react-redux-form';
import { Modal, Button } from 'react-bootstrap';

const DatabaseForm = ({
  showDatabaseForm,
  selectedDatabase,
  onClose,
  onSave
}) => {
  return (
    <Modal show={showDatabaseForm} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Database</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Text in a modal</h4>
        <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
        <form>
          <div>
            <Field model="main.selectedDatabase.name">
              <label>Name</label>
              <input className="form-control" id="name" type="text" />
            </Field>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} bsStyle="default" className="pull-left">Cancel</Button>
        <Button onClick={() => onSave(selectedDatabase)} bsStyle="primary" className="pull-right">Save</Button>
      </Modal.Footer>
    </Modal>
  );
};


function mapStateToProps(state) {
  console.log('DatabaseForm  mapStateToProps', state.main);
  return {
    showDatabaseForm: state.main.showDatabaseForm,
    selectedDatabase: state.main.selectedDatabase
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
    onSave: (database) => {
      console.log('database form', database);
      dispatch({
        type: "ADD_DATABASE",
        database
      });
    }
  }
};

const DatabaseFormContainer = connect(mapStateToProps, mapDispatchToProps)(DatabaseForm);

export default DatabaseFormContainer;