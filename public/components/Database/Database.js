const React = require('react');
const DbTables = require('../DbTables/DbTables');

const Database = React.createClass({
  render: function() {

    let dbTables = '';
    if (this.props.selectedDatabase === this.props.database) {
      dbTables = <DbTables database={this.props.database} />;
    }

    return (
      <div className="database">
        <div className="db" onClick={() => {
          this.props.selectDatabase(this.props.database)
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
