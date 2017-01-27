import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { deleteTable } from '../../components/Sidebar/Databases/Database/DbTables/tables.actions';

const DeleteTableForm = ({
  showDeleteTableForm,
  selectedDatabase,
  dbConnection,
  tableToDelete,
  onClose,
  onDelete
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
            <label>Type in the name of the table to permanently delete it. This action cannot be undone.</label>
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
    tableToDelete: state.main.tableToDelete
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onClose: () => {
      dispatch({
        type: "TOGGLE_DELETE_TABLE_FORM",
        showDeleteTableForm: false
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
        //show error
      }
    }
  }
};

const DeleteTableFormContainer = connect(mapStateToProps, mapDispatchToProps)(DeleteTableForm);

export default DeleteTableFormContainer;
