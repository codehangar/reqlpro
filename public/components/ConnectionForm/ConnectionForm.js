const React = require('react');
const classNames = require('classnames');
const Segment = require('../../services/segment.service');
import {connect} from 'react-redux';

const ConnectionForm = ({
  showAddConnectionForm, 
  showEditConnectionForm
}) => {
  // getInitialState: function() {
  //   return {
  //     store: this.context.store,
  //     connection: this.context.store.connection,
  //     show: this.context.store.router.ConnectionForm.show,
  //     action: this.context.store.router.ConnectionForm.action
  //   };
  // },
  // componentDidMount: function() {
  //   this.setupEvents();
  // },
  // setupEvents: function() {
  //   const updateState = () => {
  //     this.setState({
  //       connection: this.context.store.connection,
  //       show: this.context.store.router.ConnectionForm.show,
  //       action: this.context.store.router.ConnectionForm.action
  //     });
  //   }

  //   this.state.store.on('updateRehinkDbClient', () => {
  //     updateState();
  //   });
  //   this.state.store.on('showConnectionForm', () => {
  //     updateState();
  //   });
  //   this.state.store.on('hideConnectionForm', () => {
  //     updateState();
  //   });
  // },
  // handleTextChange: function(key, e) {
  //   var attribute = this.state.connection;
  //   attribute[key].value = e.target.value;
  //   this.setState(attribute);
  // },
  // handleValidation: function() {
  //   var attributes = this.state.connection;
  //   attributes.name.valid = this.state.connection.name.value ? true : false;
  //   attributes.host.valid = this.state.connection.host.value ? true : false;
  //   attributes.port.valid = this.state.connection.port.value ? true : false;
  //   this.setState(attributes);
  // },
  // handleSubmit: function(e) {
  //   this.handleValidation();
  //   if (this.state.connection.name.valid && this.state.connection.host.valid && this.state.connection.port.valid) {
  //     // Save new favorite and turn off form
  //     if (this.state.action === 'Add') {
  //       this.state.store.addFavorite(this.state.connection);
  //       Segment.track({
  //         event: 'connection.add',
  //         properties: {}
  //       });
  //     } else {
  //       this.state.store.editFavorite(this.state.connection);
  //     }
  //     this.state.store.hideConnectionForm();
  //   }
  // },
  // handleCancel: function(e) {
  //   this.state.store.hideConnectionForm();
  // },
  // handleDelete: function(e) {
  //   this.state.store.deleteFavorite(this.state.connection);
  //   this.state.store.hideConnectionForm();
  // },
  // render: function() {
    // const {showAddConnectionForm, showEditConnectionForm} = this.props;
    console.log('render showAddConnectionForm props', showAddConnectionForm);
    var containerStyles = {
      display: showAddConnectionForm ? 'block' : 'none'
    };

    // Validation Classes
    // const inputValidationClasses = {
    //   name: classNames({
    //     'form-group': true,
    //     'has-error': !this.state.connection.name.valid
    //   }),
    //   host: classNames({
    //     'form-group': true,
    //     'has-error': !this.state.connection.host.valid
    //   }),
    //   port: classNames({
    //     'form-group': true,
    //     'has-error': !this.state.connection.port.valid
    //   }),
    //   database: classNames({
    //     'form-group': true
    //   }),
    //   authKey: classNames({
    //     'form-group': true
    //   })
    // };

    let deleteButton = '';
    if (showEditConnectionForm) {
      deleteButton = <button type="delete" className="btn btn-default" onClick={this.handleDelete}>Delete</button>
    }

    return (
      <div className="ConnectionForm" style={containerStyles}>
        <div className="panel panel-default">
          <div className="panel-heading">
            <strong>{ () => { if(showAddConnectionForm) return 'Add New' } } RethinkDB Connection</strong>
          </div>
          <div className="panel-body">
            <div className="row">
              <div className="col-sm-12">
                <form>
                  <div >
                    <label htmlFor="name">Connection Name</label>
                    <input type="text" className="form-control" id="name" placeholder="i.e. TodoApp-local" />
                  </div>
                  <div>
                    <label htmlFor="host">Host</label>
                    <input type="text" className="form-control" id="host" placeholder="i.e. localhost" />
                  </div>
                  <div >
                    <label htmlFor="port">Port</label>
                    <input type="text" className="form-control" id="port" placeholder="i.e. 28015" />
                  </div>
                  {/*<div className={inputValidationClasses.database}>
                    <label htmlFor="database">Database</label>
                    <input type="text" className="form-control" id="database" placeholder="Database" value={this.state.connection.database.value} onChange={this.handleTextChange.bind(this, 'database')} />
                  </div>
                  <div className={inputValidationClasses.authKey}>
                    <label htmlFor="authKey">Auth Key</label>
                    <input type="text" className="form-control" id="authKey" placeholder="Auth Key" value={this.state.connection.authKey.value} onChange={this.handleTextChange.bind(this, 'authKey')} />
                  </div>*/}
                </form>
              </div>
            </div>
          </div>
          <div className="panel-footer">
            <button type="submit" className="btn btn-primary pull-right">Save</button>
            <button type="cancel" className="btn btn-default pull-left">Cancel</button>
            {deleteButton}
            <div className="clearfix"/>
          </div>
        </div>
      </div>
    );
  // }
};
// ConnectionForm.contextTypes = {
//   store: React.PropTypes.object
// };

function mapStateToProps(state) {
  console.log('ConnectionForm', state);
  return {
    showAddConnectionForm: state.showAddConnectionForm
  };
}
// const mapDispatchToProps = (dispatch) => {
//   return {
//     onEmailSubmit: (email) =>{
//       dispatch({
//         type: "SET_EMAIL",
//         email
//       })
//     }
//   }
// };

const ConnectionFormContainer = connect(mapStateToProps)(ConnectionForm);

module.exports = ConnectionFormContainer;
