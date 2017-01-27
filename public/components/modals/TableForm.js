import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { createTable } from '../../components/Sidebar/Databases/Database/DbTables/tables.actions';
import Segment from '../../services/segment.service.js';

const TableForm = ({
  showTableForm,
  dbConnection,
  dbToEdit,
  onClose,
  onSave
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClose: () => {
      dispatch({
        type: "TOGGLE_TABLE_FORM",
        showTableForm: false
      });
    },
    onSave: (dbConnection, database, table) => {
      dispatch(createTable(dbConnection, database.name, table));
      dispatch({
        type: "TOGGLE_TABLE_FORM",
        showTableForm: false
      });
      Segment.track({
        event: 'table.save'
      });
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(TableForm);
