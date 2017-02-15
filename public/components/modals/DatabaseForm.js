import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { createDatabase } from '../Sidebar/Databases/databases.actions';
import Segment from '../../services/segment.service.js';

const DatabaseForm = ({
  showDatabaseForm,
  dbConnection,
  onClose,
  onSave,
  dropDatabaseError
}) => {
  let nameInput;
  return (
    <Modal show={showDatabaseForm} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Database</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSave(dbConnection, nameInput.value)
        }}>
          <div>
            <label>Database Name</label>
            <input className="form-control" id="name" type="text" ref={(input) => {
              nameInput = input;
              if (input) {
                nameInput.focus();
              }
            }}/>
          </div>
          <div className="text-danger" style={{marginTop:16}}>
            {dropDatabaseError ? dropDatabaseError.msg : ' '}
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} bsStyle="default" className="pull-left">Cancel</Button>
        <Button onClick={() => {
          onSave(dbConnection, nameInput.value)
        }} bsStyle="primary" className="pull-right">Save</Button>
      </Modal.Footer>
    </Modal>
  );
};


const mapStateToProps = (state) => {
  return {
    showDatabaseForm: state.main.showDatabaseForm,
    dbConnection: state.main.dbConnection,
    dropDatabaseError: state.main.dropDatabaseError
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClose: () => {
      dispatch({
        type: "TOGGLE_DATABASE_FORM",
        showDatabaseForm: false
      });
      dispatch({
        type:'SET_DATABASE_DROP_ERROR',
        dropDatabaseError: ' '
      });
    },
    onSave: (dbConnection, database) => {
      dispatch(createDatabase(dbConnection, database));
      Segment.track({
        event: 'database.save'
      });
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(DatabaseForm);
