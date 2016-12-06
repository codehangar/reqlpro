import React from 'react';
import { connect } from 'react-redux';
import { Field } from 'react-redux-form';
import { Modal, Button } from 'react-bootstrap';

const TableForm = ({
  showTableForm,
  selectedTable,
  onClose,
  onSave
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
        <Button onClick={() => onSave(selectedTable)} bsStyle="primary" className="pull-right">Save</Button>
      </Modal.Footer>
    </Modal>
  );
};


function mapStateToProps(state) {
  console.log('TableForm  mapStateToProps', state.main);
  return {
    showTableForm: state.main.showTableForm,
    selectedTable: state.main.selectedTable
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
    onSave: (table) => {
      console.log('table form', table);
      dispatch({
        type: "ADD_TABLE",
        table
      });
    }
  }
};

const TableFormContainer = connect(mapStateToProps, mapDispatchToProps)(TableForm);

export default TableFormContainer;