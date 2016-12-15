import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import ExplorerContainer from '../Explorer/Explorer';
import ConnectionFormContainer from '../modals/ConnectionForm';
import EntityForm from '../modals/EntityForm';
import ConfirmRowDelete from '../modals/ConfirmRowDelete';
import EmailIntroContainer from '../modals/EmailIntro';
import DatabaseForm from '../modals/DatabaseForm';
import DeleteDatabaseForm from '../modals/DeleteDatabaseForm';
import TableForm from '../modals/TableForm';

const App = React.createClass({
  getInitialState: function () {
    return this.context.store;
  },
  componentDidMount: function () {
    // this.setupEvents();
    this.resizeTimeoutFunction = () => {
      this.resizeTimeout = setTimeout(() => {
        this.forceUpdate();
      }, 100);
    }
    window.onresize = () => {
      clearTimeout(this.resizeTimeout)
      this.resizeTimeoutFunction();
    }
  },
  componentWillUnmount: function () {
    window.onresize = null;
  },
  setupEvents: function () {

    // Event for toggling connection form
    this.state.on('showConnectionForm', () => {
      this.forceUpdate();
    });
    this.state.on('hideConnectionForm', () => {
      this.forceUpdate();
    });

    this.state.on('toggleEntityForm', () => {
      this.forceUpdate();
    });

    // Event for updating selected favorite
    this.state.on('updateRehinkDbClient', () => {
      this.forceUpdate();
    });
  },
  render: function () {

    // 
    // <EntityForm />
    // <ConfirmRowDelete />
    return (
      <div className="content-wrapper">
        <EmailIntroContainer />
        <Sidebar />
        <ConnectionFormContainer />
        <DatabaseForm />
        <DeleteDatabaseForm />
        <TableForm />
        <ExplorerContainer />
      </div>
    );
  }
});
App.contextTypes = {
  store: React.PropTypes.object
};

module.exports = App;
