const React = require('react');
const DbTables = require('../DbTables/DbTables');

const Database = React.createClass({
  showDbTables: false,
  render: function() {

    let dbTables = '';
    if(this.showDbTables){
      dbTables = <DbTables database={this.props.database}/>;
    }else{
      dbTables = ''
    }

    return (
      <div className="database">
        <div className="db" onClick={() => {
          this.props.selectDatabase(this.props.database)
          this.showDbTables = !this.showDbTables;
        }}>
          <i className="fa fa-database"></i>
            &nbsp;&nbsp;{this.props.database.name}
          </div>
        {dbTables}
      </div>
    );
  }
});

module.exports = Database;
