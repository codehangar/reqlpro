var React = require('react');
var DatabasesHeader = require('../DatabasesHeader/DatabasesHeader');
var Database = require('../Database/Database');

var Databases = React.createClass({
  getInitialState: function() {
    return this.context.store;
  },
  componentDidMount: function() {
    this.setupEvents();
  },
  setupEvents: function() {
    this.state.on('updateRehinkDbClient', () => {
      this.forceUpdate();
    });
  },
  selectDatabase: function(database) {
    this.state.updateDbTables(database);
  },
  render: function() {

    const databaseNodes = this.state.selectedFavorite.databases.map((database) => {
      return (
        <Database
          key={database.name}
          database={database}
          selectedDatabase={this.state.selectedDatabase}
          selectDatabase={this.selectDatabase}
        />
      );
    });

    const content = () => {
      if (this.state.favorites.length > 0) {
        return (
          <div>
            <DatabasesHeader selectedFavorite={this.state.selectedFavorite} store={this.state} />
            {databaseNodes}
          </div>
        );
      } else {
        return (<div></div>);
      }
    }

    return (
      <div className="db-content-col">
        {content()}
      </div>
    );

  }
});
Databases.contextTypes = {
  store: React.PropTypes.object
};

module.exports = Databases;
