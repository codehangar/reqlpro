import React, { Component } from'react';
import Segment from'../../services/segment.service.js';
import { Control, Form, Field, actions } from 'react-redux-form';
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
      isAdd,
      onCancel,
      onDelete,
      onSave,
      onUpdate
    } = this.props;

    console.log('isAdd', isAdd); // eslint-disable-line no-console
    return (
      <div className="ConnectionForm">
        <div className="panel panel-default">
          <div className="panel-heading">
            <strong>{ isAdd ? 'Add New' : 'Edit' } RethinkDB Connection</strong>
          </div>
          <Form model="forms.connection" onSubmit={(data) => isAdd ? onSave(data) : onUpdate(data)}>
            <div className="panel-body">
              <div className="row">
                <div className="col-sm-12">
                  <div>
                    <label>Connection Name</label>
                    <Field model=".name">
                      <input className="form-control" type="text" id="name"
                             ref={(input) => {
                               this.nameInput = input;
                             }}
                             placeholder="i.e. TodoApp-local"/>
                    </Field>
                  </div>
                  <div>
                    <label>Host</label>
                    <Field model=".host">
                      <input className="form-control" type="text" id="host"
                             placeholder="i.e. localhost"/>
                    </Field>
                  </div>
                  <div>
                    <label>Port</label>
                    <Field model=".port">
                      <input className="form-control" type="text" id="host"
                             placeholder="i.e. 28015"/>
                    </Field>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <label>User</label>
                      <Field model=".user">
                        <input className="form-control" type="text" id="user"/>
                      </Field>
                    </div>
                    <div className="col-sm-6">
                      <label>Pass</label>
                      <Field model=".pass">
                        <input className="form-control" type="password" id="pass"/>
                      </Field>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="panel-footer">
              <button type="submit" className="btn btn-primary pull-right">Save</button>
              <button type="button" onClick={onCancel} className="btn btn-default pull-left">Cancel</button>
              {!isAdd ?
                <button type="button" className="btn btn-default" onClick={() => onDelete(selectedConnection)}>
                  Delete</button> : ''}
              <div className="clearfix"/>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAdd: typeof state.forms.connection.index === 'undefined',
    selectedConnection: state.connection.selected
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onCancel: () => {
      dispatch({
        type: "HIDE_CONNECTION_FORM"
      })
    },
    onSave: (data) => {
      console.log('onSave data', data);
      dispatch(addConnection(data));
    },
    onUpdate: (data) => {
      console.log('onUpdate data', data);
      dispatch(updateConnection(data));
    },
    onDelete: (connection) => {
      if (confirm("Are you sure you want to delete the connection named " + connection.name)) {
        dispatch(deleteConnection(connection));
      }
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionForm);
