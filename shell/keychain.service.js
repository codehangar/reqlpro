const keytar = require('keytar');

const SERVICE_NAME = 'ReQLPro';

function getAccountNameForPassword(host, port, user) {
  if (!host) {
    throw new Error('host is required');
  }
  if (!port) {
    throw new Error('port is required');
  }
  if (!user) {
    throw new Error('user is required');
  }
  return user + '@' + host + ':' + port;
}

function getAccountNameForCert(host, port) {
  if (!host) {
    throw new Error('host is required');
  }
  if (!port) {
    throw new Error('port is required');
  }
  return host + ':' + port + '_cert';
}

function updatePassword(host, port, user, password) {
  if (!user) {
    return Promise.resolve('');
  }
  const account = getAccountNameForPassword(host, port, user);
  if (password) {
    return keytar.setPassword(SERVICE_NAME, account, password);
  } else {
    return keytar.deletePassword(SERVICE_NAME, account);
  }
}

function updateCert(host, port, cert) {
  const account = getAccountNameForCert(host, port);
  if (cert) {
    return keytar.setPassword(SERVICE_NAME, account, cert);
  } else {
    return keytar.deletePassword(SERVICE_NAME, account);
  }
}

function updateKeysForConnection(connection) {
  if (!connection) {
    throw new Error('connection is required');
  }
  return new Promise((resolve, reject) => {
    // Set default host and port if not supplied
    const host = connection.host || 'localhost';
    const port = connection.port || '28015';

    updatePassword(host, port, connection.user, connection.pass).then((pass) => {
      updateCert(host, port, connection.ca).then((ca) => {
        resolve({
          pass: pass || '',
          ca: ca || ''
        });
      });
    });
  });
}

function getPassword(host, port, user) {
  if (!user) {
    return Promise.resolve('');
  }
  const account = getAccountNameForPassword(host, port, user);
  return keytar.getPassword(SERVICE_NAME, account);
}

function getCert(host, port) {
  const account = getAccountNameForCert(host, port);
  return keytar.getPassword(SERVICE_NAME, account);
}

function getKeysForConnection(connection) {
  if (!connection) {
    throw new Error('connection is required');
  }
  return new Promise((resolve, reject) => {
    // Set default host and port if not supplied
    const host = connection.host || 'localhost';
    const port = connection.port || '28015';

    getPassword(host, port, connection.user).then((pass) => {
      getCert(host, port).then((ca) => {
        resolve({
          pass: pass || '',
          ca: ca || ''
        });
      });
    });
  });
}

module.exports.SERVICE_NAME = SERVICE_NAME;
module.exports.getAccountNameForPassword = getAccountNameForPassword;
module.exports.getAccountNameForCert = getAccountNameForCert;
module.exports.updatePassword = updatePassword;
module.exports.updateCert = updateCert;
module.exports.updateKeysForConnection = updateKeysForConnection;
module.exports.getPassword = getPassword;
module.exports.getCert = getCert;
module.exports.getKeysForConnection = getKeysForConnection;
