import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { deleteTable } from '../../components/Sidebar/Databases/Database/DbTables/tables.actions';
import Segment from '../../services/segment.service.js';

const DeleteTableForm = ({
  showDeleteTableForm,
  selectedDatabase,
  dbConnection,
  tableToDelete,
  onClose,
  onDelete,
  deleteTableError,
  dropTableError
}) => {
  let nameInput;
  const submit = (e) => {
    e.preventDefault();
    onDelete(dbConnection, selectedDatabase, tableToDelete, nameInput.value);
  };
  return (
    <Modal show={showDeleteTableForm} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Table</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={submit}>
          <div>
            {dropTableError ? dropTableError.msg: " "}
          </div>
          <div>
            <div className="alert alert-warning">This action cannot be undone. Please type the name of the table to confirm.</div>
            <label>Type in the name of the table to permanently delete it. This action cannot be undone.</label>
            <input className="form-control" id="name" type="text" ref={(input) => {
              nameInput = input;
              if (nameInput) {
                nameInput.focus();
              }
            }}/>
          </div>
          {deleteTableError ? <p className="text-danger" style={{marginTop:16}}>The name you typed does not match the name of the table you are trying to delete.</p> : ''}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} bsStyle="default" className="pull-left">Cancel</Button>
        <Button onClick={submit} bsStyle="primary" className="pull-right">Delete</Button>
      </Modal.Footer>
    </Modal>
  );
};


function mapStateToProps(state) {
  return {
    showDeleteTableForm: state.main.showDeleteTableForm,
    selectedDatabase: state.main.selectedDatabase,
    dbConnection: state.main.dbConnection,
    tableToDelete: state.main.tableToDelete,
    deleteTableError: state.main.deleteTableError,
    dropTableError: state.main.dropTableError
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onClose: () => {
      dispatch({
        type: "TOGGLE_DELETE_TABLE_FORM",
        showDeleteTableForm: false
      });
      dispatch({
        type:"SET_DELETE_TABLE_ERROR",
        deleteTableError: false
      });
      dispatch({
        type: 'SET_DROP_TABLE_ERROR',
        error: ' '
      });
    },
    onDelete: (dbConnection, selectedDatabase, tableName, confirmName) => {
      if (tableName == confirmName) {
        dispatch(deleteTable(dbConnection, selectedDatabase.name, tableName));
        dispatch({
          type: "TOGGLE_DELETE_TABLE_FORM",
          showDeleteTableForm: false,
          database: selectedDatabase,
          tableToDelete: tableName
        });

        Segment.track({
          event: 'table.delete'
        });
      } else {
        dispatch({
          type:"SET_DELETE_TABLE_ERROR",
          deleteTableError: true
        });
      }
    }
  }
};

const DeleteTableFormContainer = connect(mapStateToProps, mapDispatchToProps)(DeleteTableForm);

export default DeleteTableFormContainer;
