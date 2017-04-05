let UUID, electron, fs, remote, global;

describe('configService Tests', function() {

  describe('config', function() {

    beforeEach(function(){

      mockery.enable({
        warnOnReplace: false,
        warnOnUnregistered: false,
        useCleanCache: true
      });

      // UUID = sinon.stub();
      // mockery.registerMock('./uuid.service', UUID);

      // electron = sinon.stub();
      electron = {
        remote: {getGlobal: sinon.stub().returns('/')}
      };
      mockery.registerMock('electron', electron);

      fs = sinon.stub();
      mockery.registerMock('fs', fs);


    });

    it('should be an object', function(done) {
      const config = require('./config.service');
      expect(config).to.be.a('object');
      done();
    });

  });
});
