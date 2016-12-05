import React from 'react';
import DatabasesHeader from '../DatabasesHeader/DatabasesHeader';
import Database from '../Database/Database';

import {connect} from 'react-redux';

const Databases = React.createClass({
  // getInitialState: function() {
  //   return this.context.store;
  // },
  // componentDidMount: function() {
  //   this.setupEvents();
  // },
  // setupEvents: function() {
  //   this.state.on('updateRehinkDbClient', () => {
  //     this.forceUpdate();
  //   });
  // },
  selectDatabase: function(database) {
    this.state.updateDbTables(database);
  },

  render: function() {
    const {connections, selectedConnection} = this.props;
    console.log('Databases props', selectedConnection);
    let databaseNodes;

    if(selectedConnection && selectedConnection.databases){
      databaseNodes = selectedConnection.databases.map((database) => {
        return (
          <Database
            key={database.name}
            database={database}
            selectedDatabase={selectedConnection.databases[0]}
            selectDatabase={this.selectDatabase}
          />
        );
      });
    }


    const content = () => {
      if (connections && connections.length > 0) {
        return (
          <div>
            <DatabasesHeader selectedFavorite={selectedConnection} store={this.state} />
          </div>
        );
      } else {
        return (<div></div>);
      }
    }

    return (
      <div className="db-content-col">
        {content()}
        {databaseNodes}
      </div>
    );

  }
});
// Databases.contextTypes = {
//   store: React.PropTypes.object
// };

function mapStateToProps(state) {
  console.log('Databases', state)
  return {
    connections: state.main.connections,
    selectedConnection: state.main.selectedConnection
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    onEmailSubmit: (email) =>{
      dispatch({
        type: "SET_EMAIL",
        email
      })
    }
  }
};

const DatabasesContainer = connect(mapStateToProps, mapDispatchToProps)(Databases);

module.exports = DatabasesContainer;
