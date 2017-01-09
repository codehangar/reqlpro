import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

beforeEach(function() {

  // const window = {};

  global.expect = chai.expect;
  global.sinon = require('sinon');
  global.mockery = require('mockery');

  global.remote = {
    require: require
  }
});
