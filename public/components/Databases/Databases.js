var React = require('react');
var classNames = require('classnames');
var DatabasesHeader = require('../DatabasesHeader/DatabasesHeader');
var Database = require('../Database/Database');
var RethinkDbClient = window.rethinkDbClient;

var Databases = React.createClass({
	getInitialState: function() {
    return this.props;
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps);
  },
  render: function() {
    var _this = this;
    var content = function(){
      if(RethinkDbClient.favorites.length > 0){
        return (
          <span>
            <DatabasesHeader selectedFavorite={_this.props.selectedFavorite} />
            {databaseNodes}
          </span>
        )
      }else{
        return (<div></div>)
      }
    }
    var databaseNodes = this.props.selectedFavorite.databases.map(function(database) {
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