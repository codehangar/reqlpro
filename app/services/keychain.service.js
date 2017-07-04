import keytar from 'keytar';

export const SERVICE_NAME = 'ReQLPro';

export function getAccountNameForPassword(host, port, user) {
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

export function getAccountNameForCert(host, port) {
  if (!host) {
    throw new Error('host is required');
  }
  if (!port) {
    throw new Error('port is required');
  }
  return host + ':' + port + '_cert';
}

export function updatePassword(host, port, user, password) {
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

export function updateCert(host, port, cert) {
  const account = getAccountNameForCert(host, port);
  if (cert) {
    return keytar.setPassword(SERVICE_NAME, account, cert);
  } else {
    return keytar.deletePassword(SERVICE_NAME, account);
  }
}

export function updateKeysForConnection(connection) {
  if (!connection) {
    throw new Error('connection is required');
  }
  return new Promise(async (resolve, reject) => {
    // Set default host and port if not supplied
    const host = connection.host || 'localhost';
    const port = connection.port || '28015';
    resolve({
      pass: await updatePassword(host, port, connection.user, connection.pass),
      ca: await updateCert(host, port, connection.ca)
    });
  });
}

export function getPassword(host, port, user) {
  if (!user) {
    return Promise.resolve('');
  }
  const account = getAccountNameForPassword(host, port, user);
  return keytar.getPassword(SERVICE_NAME, account);
}

export function getCert(host, port) {
  const account = getAccountNameForCert(host, port);
  return keytar.getPassword(SERVICE_NAME, account);
}

export function getKeysForConnection(connection) {
  if (!connection) {
    throw new Error('connection is required');
  }
  return new Promise(async (resolve, reject) => {
    // Set default host and port if not supplied
    const host = connection.host || 'localhost';
    const port = connection.port || '28015';

    const pass = await getPassword(host, port, connection.user);
    const ca = await getCert(host, port);
    resolve({
      pass: pass || '',
      ca: ca || ''
    });
  });
}
