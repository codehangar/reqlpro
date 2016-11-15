import RethinkDbService from '../main/services/rethinkdb.service';

export function getDbConnection(connection) {
  return dispatch => {
    new Promise((resolve, reject) => {
      console.log('connection', connection);
      RethinkDbService.getConnection(connection.host, connection.port, connection.authKey).then((conn) => {
        console.log('getConnection conn', conn);
        dispatch({
          type: 'SET_DB_CONNECTION',
          dbConnection: conn
        });
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
