import React from 'react';
import { connect } from 'react-redux';
import { Field } from 'react-redux-form';
import { Modal, Button } from 'react-bootstrap';
import {createTable} from '../../actions';

const TableForm = ({
  showTableForm,
  selectedTable,
  onClose,
  onSave,
  selectedDatabase,
  dbConnection
}) => {
  return (
    <Modal show={showTableForm} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Table</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div>
            <Field model="main.selectedTable.name">
              <label>Name</label>
              <input className="form-control" id="name" type="text" />
            </Field>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} bsStyle="default" className="pull-left">Cancel</Button>
        <Button onClick={() => onSave(dbConnection, selectedDatabase, selectedTable)} bsStyle="primary" className="pull-right">Save</Button>
      </Modal.Footer>
    </Modal>
  );
};


function mapStateToProps(state) {
  console.log('TableForm  mapStateToProps', state.main);
  return {
    showTableForm: state.main.showTableForm,
    selectedDatabase: state.main.selectedDatabase,
    selectedTable: state.main.selectedTable,
    dbConnection: state.main.dbConnection,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onClose: () => {
      dispatch({
        type: "TOGGLE_TABLE_FORM",
        showTableForm: false
      });
    },
    onSave: (dbConnection, selectedDatabase, table) => {
      console.log('save table selectedDatabase ------>',selectedDatabase)
      dispatch(createTable(dbConnection, selectedDatabase, table));
      dispatch({
        type: "TOGGLE_TABLE_FORM",
        showTableForm: false
      });
    }
  }
};

const TableFormContainer = connect(mapStateToProps, mapDispatchToProps)(TableForm);

export default TableFormContainer;