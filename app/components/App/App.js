import React from 'react';
import { connect } from 'react-redux';
import Sidebar from '../Sidebar/Sidebar';
import ExplorerContainer from '../ExplorerContainer/ExplorerContainer';
import ConnectionFormContainer from '../modals/ConnectionForm';
import ConfirmRowDelete from '../ConfirmRowDelete/ConfirmRowDelete';
import DatabaseForm from '../modals/DatabaseForm';
import DeleteDatabaseForm from '../DeleteDatabaseForm/DeleteDatabaseForm';
import DeleteTableForm from '../DeleteTableForm/DeleteTableForm';
import TableForm from '../TableForm/TableForm';
import DevTools from '../DevTools';

let devTools = '';
if (process.env.NODE_ENV === 'development') {
  devTools = <DevTools/>;
}

const App = React.createClass({
  componentDidMount: function() {
    this.resizeTimeoutFunction = () => {
      this.resizeTimeout = setTimeout(() => {
        this.forceUpdate();
      }, 100);
    };
    window.onresize = () => {
      clearTimeout(this.resizeTimeout)
      this.resizeTimeoutFunction();
    }
  },
  componentWillUnmount: function() {
    window.onresize = null;
  },
  render: function() {
    return (
      <div className="content-wrapper">
        <Sidebar />
        {this.props.connection && this.props.connection.showForm ? <ConnectionFormContainer /> : ''}
        <DatabaseForm />
        <DeleteDatabaseForm />
        <TableForm />
        <DeleteTableForm />
        <ConfirmRowDelete />
        <ExplorerContainer />
        {devTools}
      </div>
    );
  }
});


function mapStateToProps(state) {
  return {
    connection: state.connection
  };
}

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
