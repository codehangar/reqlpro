describe('DateTypeService Tests', function() {

  var dateTypeService;

  beforeEach(function() {

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    // Mock the postmark service
    // postmark = sinon.stub();
    // postmark.Client = sinon.stub();

    // replace the require() module `postmark` with a stub object
    // mockery.registerMock('postmark', postmark);

    dateTypeService = require('../../../../public/services/date-type.service');
  });

  describe('convertStringsToDates', function() {

    it('should be a function', function(done) {
      expect(dateTypeService.convertStringsToDates).to.be.a('function');
      done();
    });

    it('should preserve date types', function(done) {
      const prev = {
        notTime: 'This is a string',
        time: new Date()
      };

      const next = {
        notTime: 'This is a string',
        time: 'Wed Jun 22 2016 00:21:03 GMT+00:00'
      };

      const expected = {
        notTime: 'This is a string',
        time: new Date('Wed Jun 22 2016 00:21:03 GMT+00:00')
      }

      expect(dateTypeService.convertStringsToDates(prev, next)).to.deep.equal(expected);
      done();
    });

    it('should preserve nested date types', function(done) {
      const prev = {
        notTime: 'This is a string',
        nestedA: {
          time: new Date(),
          nestedB: {
            time: new Date()
          }
        }
      };

      const next = {
        notTime: 'This is a string',
        nestedA: {
          time: 'Wed Jun 22 2016 00:21:03 GMT+00:00',
          nestedB: {
            time: 'Wed Jun 22 2016 00:21:03 GMT+00:00'
          }
        }
      };

      const expected = {
        notTime: 'This is a string',
        nestedA: {
          time: new Date('Wed Jun 22 2016 00:21:03 GMT+00:00'),
          nestedB: {
            time: new Date('Wed Jun 22 2016 00:21:03 GMT+00:00')
          }
        }
      }

      expect(dateTypeService.convertStringsToDates(prev, next)).to.deep.equal(expected);
      done();
    });

  });
});
