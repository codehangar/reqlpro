let UUID, electron, fs, remote, global;

describe.only('anonIDService Tests', function() {

  beforeEach(function(){
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });
    UUID = {
      generate: function(){
        return 'random anon id';
      }
    }
    mockery.registerMock('./uuid.service', UUID);
    electron = {
      remote: {getGlobal: sinon.stub().returns('path')}
    };
    mockery.registerMock('electron', electron);
    fs = sinon.stub();
    mockery.registerMock('fs', fs);
  });

  // describe('anonID', function() {
  //   it('should be an function', function() {
  //     const AnonId = require('./anon-id.service').default;
  //     expect(AnonId).to.be.a('function');
  //   });
  //   it('should throw an error if no configPath provided', function() {
  //     const AnonId = require('./anon-id.service').default;
  //     expect(()=>{AnonId()}).to.throw(Error);
  //   });
  //   it('should not throw an error if configPath provided', function() {
  //     const AnonId = require('./anon-id.service').default;
  //     expect(()=>{AnonId('path')}).to.not.throw(Error);
  //   });
  // });
  describe('getAnonId', function() {
    it('should be an function', function() {
      const {getAnonId} = require('./anon-id.service');
      expect(getAnonId).to.be.a('function');
    });
    it('should throw an error if no configPath provided', function() {
      const {getAnonId} = require('./anon-id.service');
      expect(()=>{getAnonId()}).to.throw(Error);
    });
    it('should not throw an error if configPath is provided', function() {
      const {getAnonId} = require('./anon-id.service');
      expect(()=>{getAnonId('path')}).to.not.throw(Error);
    });
    it('should return existing anonID if one does exist', function() {
      const {getAnonId} = require('./anon-id.service');
      const readAnonIdFileFake = sinon.stub().returns(new Promise()).yields('existing anonId');
      const result = getAnonId('path');
      expect(result).to.equal('existing anonId');
    });
    it('should return a new anonID if one does not exist in the anonIdFile', function() {
      const {getAnonId} = require('./anon-id.service');
      const result = getAnonId('path');
      expect(result).to.equal('random anon id');
    });
    it('should return a string', function() {

    });
  });
  describe('anonID.set', function() {
    it('should not overwrite existing anonID', function() {

    });
  });
  describe('anonID.readAnonIdFile', function() {
    it('should return anonIDfile contents', function() {

    });
  });
  describe('anonID.writeAnonIdFile', function() {
    it('should return anonIDfile contents', function() {

    });
  });
});
