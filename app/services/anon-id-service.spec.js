let UUID, electron, fs, remote, global;

describe('anonIDService Tests', function() {

  beforeEach(function() {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });
    UUID = sinon.stub();
    UUID.generate = sinon.stub().returns('random anon id');
    mockery.registerMock('./uuid.service', UUID);
    electron = {
      remote: { getGlobal: sinon.stub().returns('path') }
    };
    mockery.registerMock('electron', electron);
    fs = sinon.stub();
    fs.readFile = sinon.stub().yields();
    fs.writeFile = sinon.stub().yields();
    mockery.registerMock('fs', fs);
  });

  describe('getAnonId', function() {
    it('should be an function', function() {
      const { getAnonId } = require('./anon-id.service');
      expect(getAnonId).to.be.a('function');
    });
    it('should throw an error if no configPath provided', function() {
      const { getAnonId } = require('./anon-id.service');
      expect(() => {
        getAnonId()
      }).to.throw(Error);
    });
    it('should not throw an error if configPath is provided', function() {
      const { getAnonId } = require('./anon-id.service');
      fs.readFile = sinon.stub().yields();
      expect(() => {
        getAnonId('path')
      }).to.not.throw(Error);
    });

    it('accepts anonId file path and returns existing anonId if one exists', function(done) {
      const { getAnonId } = require('./anon-id.service');
      fs.readFile = sinon.stub().yields('error', 'existing anonId');
       getAnonId('path').then((data) => {
        expect(data).to.equal('existing anonId');
        done();
      })
    });

    it('should accept path and return a new anonID if one does not exist', function(done) {
      const { getAnonId } = require('./anon-id.service');
      fs.readFile = sinon.stub().yields('error', undefined);
      getAnonId('path').then((data) => {
        expect(data).to.equal('random anon id');
        done();
      })
    });
    it('should return a string', function(done) {
      const { getAnonId } = require('./anon-id.service');
      fs.readFile = sinon.stub().yields('error', undefined);
      getAnonId('path').then((data) => {
        expect(data).to.be.a('string');
        done();
      })
    });
  });
  describe('setAnonId', function() {
    it('should be a function', function() {
      const { setAnonId } = require('./anon-id.service');
      fs.readFile = sinon.stub().yields('err', 'data');
      expect(setAnonId).to.be.a('function');
    });
    it('should call fs.writeFile if no file data', function(done) {
      const { setAnonId } = require('./anon-id.service');
      fs.readFile = sinon.stub().yields('err', undefined);
      setAnonId('path','UUID').then(data => {
        expect(fs.writeFile.called).to.be.true;
        done();
      })
    });
    it('should not overwrite existing anonID', function(done) {
      const { setAnonId } = require('./anon-id.service');
      fs.readFile = sinon.stub().yields('error', 'existing anon id');
      setAnonId('path','UUID').then(data => {
        expect(fs.readFile.called).to.be.true;
        done();
      })
    });
  });
  describe('anonID.readAnonIdFile', function() {
    it('should return anonIdFile contents', function() {

    });
  });
  describe('anonID.writeAnonIdFile', function() {
    it('should return anonIdFile contents', function() {

    });
  });
});
