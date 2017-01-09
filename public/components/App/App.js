import React from 'react';
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
    return (
      <div className="content-wrapper">
        <EmailIntroContainer />
        <Sidebar />
        <ConnectionFormContainer />
        <DatabaseForm />
        <DeleteDatabaseForm />
        <TableForm />
        <DeleteTableForm />
        <ConfirmRowDelete />
        <ExplorerContainer />
        <DevTools />
      </div>
    );
  }
});

export default App;
