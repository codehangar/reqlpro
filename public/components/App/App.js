const React = require('react');
const Sidebar = require('../Sidebar/Sidebar');
const Explorer = require('../Explorer/Explorer');
const ConnectionForm = require('../ConnectionForm/ConnectionForm');
const DatabaseForm = require('../DatabaseForm/DatabaseForm');

const App = React.createClass({
  getInitialState: function() {
    return this.context.store;
  },
  componentDidMount: function() {
    this.setupEvents();
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
  componentWillUnmount: function() {
    window.onresize = null;
  },
  setupEvents: function() {

    // Event for toggling connection form
    this.state.on('toggleConnectionForm', () => {
      console.log("toggleConnectionForm")
      this.forceUpdate();
    });

    this.state.on('toggleDatabaseForm', () => {
      console.log("toggleDatabaseForm")
      this.forceUpdate();
    });

    // Event for updating selected favorite
    this.state.on('updateRehinkDbClient', () => {
      this.forceUpdate();
    });
  },
  render: function() {
    return (
      <div className="row main-content-row">
        <Sidebar  />
        <Explorer />
        <ConnectionForm />
        <DatabaseForm />
      </div>
    );
  }
});
App.contextTypes = {
  store: React.PropTypes.object
};

module.exports = App;
