var React = require('react');
var classNames = require('classnames');
var DatabasesHeader = require('../DatabasesHeader/DatabasesHeader');
var Database = require('../Database/Database');
var RethinkDbClient = window.rethinkDbClient;

var Databases = React.createClass({
  render: function() {

    const content = () => {
      if (RethinkDbClient.favorites.length > 0) {
        return (
          <span>
            <DatabasesHeader selectedFavorite={this.props.selectedFavorite} />
            {databaseNodes}
          </span>
        );
      } else {
        return (<div></div>);
      }
    }

    var databaseNodes = this.props.selectedFavorite.databases.map((database) => {
      return (
        <Database key={database.name} database={database} />
      );
    });

    return (
      <div className="col-md-9 sidebar-content-col no-float">
        {content()}
      </div>
    );

  }
});

module.exports = Databases;
