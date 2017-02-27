import React from 'react';
import { connect } from 'react-redux';
import Sidebar from '../Sidebar/Sidebar';
import ExplorerContainer from '../Explorer/Explorer';
import ConnectionFormContainer from '../modals/ConnectionForm';
import ConfirmRowDelete from '../modals/ConfirmRowDelete';
import EmailIntroContainer from '../modals/EmailIntro';
import DatabaseForm from '../modals/DatabaseForm';
import DeleteDatabaseForm from '../modals/DeleteDatabaseForm';
import DeleteTableForm from '../modals/DeleteTableForm';
import TableForm from '../modals/TableForm';
import DevTools from '../DevTools';

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
    console.log('explorer connection', this.props.connection)
    return (
      <div className="content-wrapper">
        <EmailIntroContainer />
        <Sidebar />
        {this.props.connection && this.props.connection.showForm ? <ConnectionFormContainer /> : ''}
        <DatabaseForm />
        <DeleteDatabaseForm />
        <TableForm />
        <DeleteTableForm />
        <ConfirmRowDelete />
        <ExplorerContainer connection={this.props.connection}/>
        <DevTools />
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
