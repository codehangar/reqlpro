import React, { Component } from 'react';
import Segment from '../../services/segment.service.js';
import { Modal, Button, FormGroup } from 'react-bootstrap';
import { Control, Form, Field, actions, Errors } from 'react-redux-form';
import { connect } from 'react-redux';
import store from '../../store';
import { addConnection, updateConnection, deleteConnection } from '../Sidebar/Connections/connections.actions';

class ConnectionForm extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // For some reason this will put the cursor at the end of the text
    this.nameInput.value = this.nameInput.value;
    // Focus the name input
    store.dispatch(actions.focus('forms.connection.name'));
  }

  render() {
    const {
      selectedConnection,
      showConnectionForm = true,
      isAdd,
      onCancel,
      onDelete,
      onSave,
      connectionError,
      onUpdate
    } = this.props;

    const isRequired = (val) => val && val.length > 0;
    let valStateUser = null;
    let valStatePass = null;

    if (connectionError) {
      if (connectionError.error.msg === 'Wrong password') {
        valStatePass = "error";
      } else if (connectionError.error.msg === 'Unknown user') {
        valStateUser = "error"
      }
    }

    return (
      <Modal show={showConnectionForm} onHide={onCancel}>
        <Form model="forms.connection" validators={{ name: { isRequired } }}
              onSubmit={(data) => isAdd ? onSave(data) : onUpdate(data)}>
          <Modal.Header closeButton>
            <Modal.Title>{isAdd ? 'Add New' : 'Edit'} RethinkDB Connection</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="panel-body">
              <div className="connection-row">
                <label>Connection Name</label>
                <Field model=".name" type="name">
                  <input className="form-control" type="text" id="name"
                         ref={(input) => {
                           this.nameInput = input;
                         } }
                         placeholder="i.e. TodoApp-local"/>
                  <Errors
                    className="errors"
                    wrapper="span"
                    show="touched"
                    model=".name"
                    messages={{
                      isRequired: 'Please provide a connection name.',
                    }}
                  />
                </Field>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <label>Host</label>
                  <Field model=".host">
                    <input className="form-control" type="text" id="host"
                           placeholder="i.e. localhost"/>
                    <small className="text-muted">
                      By default, RethinkDB binds to <strong>localhost</strong> if host is not specified.
                    </small>
                  </Field>
                </div>
                <div className="col-sm-6">
                  <label>Port</label>
                  <Field model=".port">
                    <input className="form-control" type="text" id="host"
                           placeholder="i.e. 28015"/>
                    <small className="text-muted">
                      By default, RethinkDB binds to port <strong>28015</strong> if port is not specified.
                    </small>
                  </Field>
                </div>
              </div>
              <hr/>
              <div className="row">
                <div className="col-sm-6">
                  <label>User</label>
                  <Field model=".user">
                    <FormGroup validationState={valStateUser}>
                      <input className="form-control" type="text" id="user"/>
                    </FormGroup>
                  </Field>
                </div>
                <div className="col-sm-6">
                  <label>Pass</label>
                  <Field model=".pass">
                    <FormGroup validationState={valStatePass}>
                      <input className="form-control" type="password" id="pass"/>
                    </FormGroup>
                  </Field>
                </div>
              </div>
              <hr/>
              <div className="connection-row">
                <label>SSL Certificate</label>
                <Field model=".ca">
                  <FormGroup validationState={valStateUser}>
                    <textarea className="form-control" id="ca"/>
                  </FormGroup>
                </Field>
              </div>
              <div className="connection-row">
                <Field model=".rejectUnauthorized">
                  <FormGroup validationState={valStatePass}>
                    <input type="checkbox" id="rejectUnauthorized"/>
                    <label htmlFor="rejectUnauthorized" style={{ marginLeft: '10px' }}>SSL Reject Unauthorized</label>
                  </FormGroup>
                </Field>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" className="btn btn-primary pull-right">Save</button>
            <span onClick={onCancel} className="btn btn-default pull-left">Cancel</span>
            {!isAdd ?
              <button type="button" className="btn btn-default" onClick={() => onDelete(selectedConnection)}>
                Delete</button> : ''}
            <div className="clearfix"/>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    showConnectionForm: state.connection.showConnectionForm,
    isAdd: typeof state.forms.connection.index === 'undefined',
    selectedConnection: state.connection.selected,
    connectionError: state.main.connectionError
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onCancel: () => {
      dispatch({
        type: "HIDE_CONNECTION_FORM",
        showConnectionForm: false
      })
    },
    onSave: (data) => {
      dispatch(addConnection(data));
      Segment.track({
        event: 'Add Connection',
        properties: {
          'Uses Permissions': !!data.user,
          'Uses SSL': !!data.ca
        }
      });
    },
    onUpdate: (data) => {
      dispatch(updateConnection(data));
      Segment.track({
        event: 'Update Connection',
        properties: {
          'Uses Permissions': !!data.user,
          'Uses SSL': !!data.ca
        }
      });
    },
    onDelete: (connection) => {
      if (confirm("Are you sure you want to delete the connection named " + connection.name)) {
        dispatch(deleteConnection(connection));
      }
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionForm);
