const React = require('react');
const Sidebar = require('../Sidebar/Sidebar');
const Explorer = require('../Explorer/Explorer');
const ConnectionForm = require('../ConnectionForm/ConnectionForm');
const EntityForm = require('../EntityForm/EntityForm');

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
  render: function() {
    return (
      <div className="row main-content-row">
        <Sidebar  />
        <Explorer />
        <ConnectionForm />
        <EntityForm />
      </div>
    );
  }
});
App.contextTypes = {
  store: React.PropTypes.object
};

module.exports = App;
