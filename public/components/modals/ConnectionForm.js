import React, {Component} from'react';
import classNames from'classnames';
import Segment from'../../services/segment.service.js';
import {Control, Form, Field, actions} from 'react-redux-form';
import {connect} from 'react-redux';
import store from '../../store';
import {getDbConnection, writeConfigFile} from '../../actions';


//
// const ConnectionForm = ({
//   showAddConnectionForm,
//   showEditConnectionForm,
//   selectedConnection,
//   onCancel,
//   onDelete,
//   onSave,
//   onUpdate,
//   cForm
// }) => {

class ConnectionForm extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // For some reason this will put the cursor at the end of the text
    this.nameInput.value = this.nameInput.value;
    // Focus the name input
    store.dispatch(actions.focus('connectionForm.name'));
  }

  render() {
    const {
      showAddConnectionForm,
      showEditConnectionForm,
      selectedConnection,
      onCancel,
      onDelete,
      onSave,
      onUpdate,
      cForm
    } = this.props;

    const containerStyles = {
      display: showAddConnectionForm || showEditConnectionForm ? 'block' : 'none'
    };

    const MyTextInput = (props) => <input className="form-control" type="text" {...props} />;

    let nameInput;

    return (
      <div className="ConnectionForm" style={containerStyles}>
        <div className="panel panel-default">
          <div className="panel-heading">
            <strong>{ showAddConnectionForm ? 'Add New' : 'Edit' } RethinkDB Connection</strong>
          </div>
          {/*<input type="text" />*/}
          {/*<Form model="connectionForm" onSubmit={(form) => {console.log('form',cForm)}}>*/}
          <Form model="connectionForm" onSubmit={() => showAddConnectionForm ? onSave(cForm) : onUpdate(cForm)}>
            <div className="panel-body">
              <div className="row">
                <div className="col-sm-12">
                  <div >
                    <label>Connection Name</label>
                    <Field model=".name">
                      <input className="form-control" type="text" value={cForm.connectionForm.name} id="name"
                             placeholder="i.e. TodoApp-local"/>
                    </Field>
                  </div>
                  <div >
                    <label>Host</label>
                    <Field model=".host">
                      <input className="form-control" type="text" value={cForm.connectionForm.host} id="host"
                             placeholder="i.e. localhost"/>
                    </Field>
                  </div>
                  <div >
                    <label>Port</label>
                    <Field model=".port">
                      <input className="form-control" type="text" value={cForm.connectionForm.port} id="host"
                             placeholder="i.e. 28015"/>
                    </Field>
                  </div>
                </div>
              </div>
            </div>
            <div className="panel-footer">
              <button className="btn btn-primary pull-right">Save</button>
              <button type="cancel" onClick={onCancel} className="btn btn-default pull-left">Cancel</button>
              {showEditConnectionForm ?
                <button type="delete" className="btn btn-default" onClick={() => onDelete(selectedConnection)}>
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
    showAddConnectionForm: state.main.showAddConnectionForm,
    showEditConnectionForm: state.main.showEditConnectionForm,
    selectedConnection: state.main.selectedConnection,
    cForm: state.cForm
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onCancel: () => {
      dispatch({
        type: "HIDE_CONNECTION_FORM"
      })
    },
    onSave: (form) => {
      console.log(form);
      dispatch({
        type: "ADD_CONNECTION",
        connection: form.connectionForm
      });
      dispatch(getDbConnection(form.connectionForm));
      dispatch(writeConfigFile());
    },
    onUpdate: (form) => {
      console.log(form);
      dispatch({
        type: "UPDATE_CONNECTION",
        connection: form.connectionForm
      });
      dispatch({
        type: "SET_CONNECTION",
        connection: form.connectionForm
      });
      dispatch(writeConfigFile());
    },
    onDelete: (connection) => {
      if (confirm("Are you sure you want to delete the connection named " + connection.name)) {
        dispatch({
          type: "DELETE_CONNECTION",
          id: connection.index
        });
        dispatch(writeConfigFile());
      }
    }
  }
};

const ConnectionFormContainer = connect(mapStateToProps, mapDispatchToProps)(ConnectionForm);

export default ConnectionFormContainer;
