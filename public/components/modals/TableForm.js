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
  dbConnection,
  dbToEdit
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
        <Button onClick={() => onSave(dbConnection, dbToEdit, selectedTable)} bsStyle="primary" className="pull-right">Save</Button>
      </Modal.Footer>
    </Modal>
  );
};


function mapStateToProps(state) {
  return {
    showTableForm: state.main.showTableForm,
    selectedTable: state.main.selectedTable,
    dbToEdit: state.main.dbToEdit,
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
    onSave: (dbConnection, database, table) => {
      console.log('onSave ADDING TABLE dbConnection, database, table',dbConnection, database, table)
      dispatch(createTable(dbConnection, database, table));
      dispatch({
        type: "TOGGLE_TABLE_FORM",
        showTableForm: false
      });
    }
  }
};

const TableFormContainer = connect(mapStateToProps, mapDispatchToProps)(TableForm);

export default TableFormContainer;