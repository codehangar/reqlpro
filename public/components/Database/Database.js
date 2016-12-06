const React = require('react');
const DbTables = require('../DbTables/DbTables');

const Database = React.createClass({
  showDbTables: false,
  getInitialState: function() {
    return {
      store: this.context.store
    }
  },
  deleteDatabase: function(dbName, e) {
    e.stopPropagation();
    this.state.store.toggleEntityForm('Database', 'Delete', dbName);
  },
  editDatabase: function(dbName, e) {
    e.stopPropagation();
  },
  render: function() {
    let dbTables = '';
    if(this.showDbTables){
      dbTables = <DbTables database={this.props.database}/>;
    }else{
      dbTables = ''
    }

    return (
      <div className="database">
        <div className="db noselect" onClick={() => {
          this.props.onDatabaseClick(this.props.database)
          this.showDbTables = !this.showDbTables;
        }}>
          <i className="fa fa-database"></i>
            &nbsp;&nbsp;<span className="database-name">{this.props.database.name}</span>
            <div className="delete-db btn-group" role="group">
              <button onClick={this.deleteDatabase.bind(this, this.props.database.name)} className="btn btn-default fa fa-trash"></button>
              {/*<button onClick={this.editDatabase.bind(this, this.props.database.name)} className="btn btn-default fa fa-pencil"></button>*/}
            </div>
          </div>
        {dbTables}
      </div>
    );
  }
});

Database.contextTypes = {
  store: React.PropTypes.object
};

module.exports = Database;
