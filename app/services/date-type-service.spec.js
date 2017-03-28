import {convertStringsToDates} from './date-type.service';

describe('DateTypeService Tests', function() {

  beforeEach(function() {
    // dateTypeService = require('../../../../app/services/date-type.service');
  });

  describe('convertStringsToDates', function() {

    it('should be a function', function(done) {
      expect(convertStringsToDates).to.be.a('function');
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

      expect(convertStringsToDates(prev, next)).to.deep.equal(expected);
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
      };

      expect(convertStringsToDates(prev, next)).to.deep.equal(expected);
      done();
    });

  });
});
