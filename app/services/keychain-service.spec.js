import freeze from 'deep-freeze-node';
import * as types from '../action-types';

let keytar;
const SERVICE_NAME = 'ReQLPro';

describe('keychain', () => {

  afterEach(function() {
    mockery.deregisterAll();
    mockery.resetCache();
  });


  beforeEach(function() {

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    // Mock the rethinkdb service
    keytar = sinon.stub();
    keytar.setPassword = sinon.stub().returns(Promise.resolve());
    keytar.deletePassword = sinon.stub().returns(Promise.resolve());
    keytar.getPassword = sinon.stub().returns(Promise.resolve('testKey'));
    mockery.registerMock('keytar', keytar);
    mockery.registerMock('keytar.node', keytar);
  });

  describe('SERVICE_NAME', () => {
    it('should be ReQLPro', () => {
      const { SERVICE_NAME } = require('./keychain.service');
      expect(SERVICE_NAME).to.equal('ReQLPro');
    });
  });

  describe('getAccountNameForPassword', () => {
    it('should throw an error if host is missing', () => {
      const { getAccountNameForPassword } = require('./keychain.service');
      const host = '';
      const port = '28015';
      const user = 'bob';

      const test = () => getAccountNameForPassword(host, port, user);
      expect(test).to.throw('host is required');
    });
    it('should throw an error if port is missing', () => {
      const { getAccountNameForPassword } = require('./keychain.service');
      const host = 'localhost';
      const port = '';
      const user = 'bob';

      const test = () => getAccountNameForPassword(host, port, user);
      expect(test).to.throw('port is required');
    });
    it('should throw an error if user is missing', () => {
      const { getAccountNameForPassword } = require('./keychain.service');
      const host = 'localhost';
      const port = '28015';
      const user = '';

      const test = () => getAccountNameForPassword(host, port, user);
      expect(test).to.throw('user is required');
    });
    it('should properly format the keychain account name for storing a connection password', () => {
      const { getAccountNameForPassword } = require('./keychain.service');
      const host = 'localhost';
      const port = '28015';
      const user = 'bob';

      const actual = getAccountNameForPassword(host, port, user);
      const expected = 'bob@localhost:28015';
      expect(actual).to.equal(expected);
    });
  });

  describe('getAccountNameForCert', () => {
    it('should throw an error if host is missing', () => {
      const { getAccountNameForCert } = require('./keychain.service');
      const host = '';
      const port = '28015';

      const test = () => getAccountNameForCert(host, port);
      expect(test).to.throw('host is required');
    });
    it('should throw an error if port is missing', () => {
      const { getAccountNameForCert } = require('./keychain.service');
      const host = 'localhost';
      const port = '';

      const test = () => getAccountNameForCert(host, port);
      expect(test).to.throw('port is required');
    });
    it('should properly format the keychain account name for storing a connection cert', () => {
      const { getAccountNameForCert } = require('./keychain.service');
      const host = 'localhost';
      const port = '28015';

      const actual = getAccountNameForCert(host, port);
      const expected = 'localhost:28015_cert';
      expect(actual).to.equal(expected);
    });
  });

  describe('updatePassword', () => {
    it('should add a connection password to the keychain if password is given', (done) => {
      const { updatePassword } = require('./keychain.service');

      const host = 'localhost';
      const port = '28015';
      const user = 'bob';
      const pass = 'secret';

      updatePassword(host, port, user, pass).then(() => {
        expect(keytar.setPassword.callCount).to.equal(1);

        const account = 'bob@localhost:28015';
        expect(keytar.setPassword.calledWith(
          SERVICE_NAME, account, pass
        )).to.equal(true);

        done();
      });
    });

    it('should delete a connection password to the keychain if password is not given', (done) => {
      const { updatePassword } = require('./keychain.service');

      const host = 'localhost';
      const port = '28015';
      const user = 'bob';
      const pass = '';

      updatePassword(host, port, user, pass).then(() => {
        expect(keytar.deletePassword.callCount).to.equal(1);

        const account = 'bob@localhost:28015';
        expect(keytar.deletePassword.calledWith(
          SERVICE_NAME, account
        )).to.equal(true);

        done();
      });
    });
  });

  describe('updateCert', () => {
    it('should add a connection cert to the keychain if cert is given', (done) => {
      const { updateCert } = require('./keychain.service');

      const host = 'localhost';
      const port = '28015';
      const cert = 'random-cert-string';

      updateCert(host, port, cert).then(() => {
        expect(keytar.setPassword.callCount).to.equal(1);

        const account = 'localhost:28015_cert';
        expect(keytar.setPassword.calledWith(
          SERVICE_NAME, account, cert
        )).to.equal(true);

        done();
      });
    });

    it('should delete a connection cert to the keychain if cert is not given', (done) => {
      const { updateCert } = require('./keychain.service');

      const host = 'localhost';
      const port = '28015';
      const cert = '';

      updateCert(host, port, cert).then(() => {
        expect(keytar.deletePassword.callCount).to.equal(1);

        const account = 'localhost:28015_cert';
        expect(keytar.deletePassword.calledWith(
          SERVICE_NAME, account
        )).to.equal(true);

        done();
      });
    });
  });

  describe('updateKeysForConnection', () => {
    it('should add a connection password and cert to the keychain if given', (done) => {
      const { updateKeysForConnection } = require('./keychain.service');

      const connection = {
        host: 'localhost',
        port: '28015',
        user: 'bob',
        pass: 'secret',
        ca: 'random-cert-string'
      };

      updateKeysForConnection(connection).then(() => {
        expect(keytar.setPassword.callCount).to.equal(2);

        const accountForPass = 'bob@localhost:28015';
        expect(keytar.setPassword.calledWith(
          SERVICE_NAME, accountForPass, connection.pass
        )).to.equal(true);

        const accountForCert = 'localhost:28015_cert';
        expect(keytar.setPassword.calledWith(
          SERVICE_NAME, accountForCert, connection.ca
        )).to.equal(true);

        done();
      });
    });
  });

  describe('getKeysForConnection', () => {
    it('should add a connection password and cert to the keychain if given', (done) => {
      const { getKeysForConnection } = require('./keychain.service');

      const connection = {
        host: 'localhost',
        port: '28015',
        user: 'bob'
      };

      getKeysForConnection(connection).then((keys) => {
        expect(keytar.getPassword.callCount).to.equal(2);

        const accountForPass = 'bob@localhost:28015';
        expect(keytar.getPassword.calledWith(
          SERVICE_NAME, accountForPass
        )).to.equal(true);

        const accountForCert = 'localhost:28015_cert';
        expect(keytar.getPassword.calledWith(
          SERVICE_NAME, accountForCert
        )).to.equal(true);

        expect(keys).to.deep.equal({
          pass: 'testKey',
          ca: 'testKey'
        });

        done();
      });
    });
  });
});
