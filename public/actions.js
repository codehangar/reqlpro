import RethinkDbService from '../main/services/rethinkdb.service';

export function getDbConnection(connection) {
  return dispatch => {
    new Promise((resolve, reject) => {
      // console.log('connection', connection);
      RethinkDbService.getConnection(connection.host, connection.port, connection.authKey).then((conn) => {
        console.log('getConnection conn', conn);

        dispatch({
          type: 'SET_DB_CONNECTION',
          dbConnection: conn
        });

        dispatch(getDbList(conn));

        resolve(conn);
      }).catch(error => {
        dispatch({
          type: 'SET_DB_CONNECTION',
          dbConnection: error
        });
      });
    });
  }
};

export function getDbList(dbConnection) {
  return dispatch => {
    new Promise((resolve, reject) => {
      RethinkDbService.getDbList(dbConnection).then(function(dblist) {
        var databases = [];
        for (var i = 0; i < dblist.length; i++) {
          databases.push({
            name: dblist[i],
            tables: []
          });
        }
        console.log('getDbList success, databases', databases)
        dispatch({
          type: 'SET_DB_LIST',
          databases: databases
        });
        resolve(dblist);
      }).catch(function(err) {
        console.log('getDbList error', err)
        dispatch({
          type: 'SET_DB_LIST',
          databases: err
        });
      });
    });
  }
}
