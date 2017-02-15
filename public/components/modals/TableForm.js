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
  onSave,
  addTableError
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
          <div className="text-danger" style={{marginBottom:16}}>
            {addTableError ? addTableError.msg : " " }
          </div>
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
    addTableError: state.main.addTableError,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClose: () => {
      dispatch({
      type: 'SET_ADD_TABLE_ERROR',
      error: ' '
      });
      dispatch({
        type: "TOGGLE_TABLE_FORM",
        showTableForm: false
      });

    },
    onSave: (dbConnection, database, table) => {
      dispatch(createTable(dbConnection, database.name, table));

      Segment.track({
        event: 'table.save'
      });
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(TableForm);
