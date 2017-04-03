import UUID from './uuid.service';

describe('UUIDService Tests', function() {

  describe('UUID.generate', function() {

    it('should be a function', function(done) {
      expect(UUID.generate).to.be.a('function');
      done();
    });

    it('should return a string with length of 36', function(done) {
      expect(UUID.generate()).to.be.a('string');
      expect(UUID.generate().length).to.equal(36);
      done();
    });

    it('should not return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"', function(done) {
      expect(UUID.generate()).to.not.equal('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx');
      done();
    });

  });
});
