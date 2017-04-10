let UUID, electron, fs, remote, global, ReQLEval;

describe('ReQLEval Tests', function() {

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

    ReQLEval = require('./reql-eval.service').default;
  });

  describe('ReQLEval', function() {
    it('should be an function', function() {
      expect(ReQLEval).to.be.a('function');
    });
    it('should return a promise', function() {
      const prom = ReQLEval("{ name: 'test' }");
      prom.catch((e) => {
        console.log('e', e); // eslint-disable-line no-console
      });
      expect(prom).to.be.a('promise');
    });
    it('should throw an error if script is not provided as a string', function() {
      expect(() => {
        ReQLEval({ name: 'test' })
      }).to.throw(Error);
    });
    it('should not throw an error if script is provided as a string', function() {
      expect(() => {
        ReQLEval("{ name: 'test' }")
      }).to.not.throw(Error);
    });
    it('should handle errors', function() {
      ReQLEval("undefinedThing").catch((err) => {
        expect(err instanceof ReferenceError).to.be.true;
        expect(err.message).to.equal('undefinedThing is not defined');
        done();
      });
    });
    it('should block "window" from being accessed', function(done) {
      ReQLEval("window").then((res) => {
        expect(res).to.be.undefined;
        done();
      });
    });
    it('should block "global" from being accessed', function(done) {
      ReQLEval("global").then((res) => {
        expect(res).to.be.undefined;
        done();
      });
    });
    it('should block "GLOBAL" from being accessed', function(done) {
      ReQLEval("GLOBAL").then((res) => {
        expect(res).to.be.undefined;
        done();
      });
    });
    it('should block "process" from being accessed', function(done) {
      ReQLEval("process").then((res) => {
        expect(res).to.be.undefined;
        done();
      });
    });
    it('should block "require" from being accessed', function(done) {
      ReQLEval("require").then((res) => {
        expect(res).to.be.undefined;
        done();
      });
    });

    it('should return a rethink date function', function(done) {
      ReQLEval("r.now()").then((res) => {
        expect(res).to.be.a('function');
        done();
      });
    });

    it('should return a rethink filter function', function(done) {
      ReQLEval("r.row('age').eq(30)").then((res) => {
        expect(res).to.be.a('function');
        done();
      });
    });

    it('should return a rethink orderBy function', function(done) {
      ReQLEval("r.asc('age')").then((res) => {
        expect(res).to.be.a('function');
        done();
      });
    });

    it('should return a JS object', function(done) {
      ReQLEval("{age: 30}").then((res) => {
        expect(res).to.be.a('object');
        expect(res.age).to.equal(30);
        done();
      });
    });

  });
});
