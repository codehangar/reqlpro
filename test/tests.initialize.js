import chai from 'chai';

beforeEach(function() {

  // const window = {};

  global.expect = chai.expect;
  global.sinon = require('sinon');
  global.mockery = require('mockery');

  // global.window.nodeRequire = require;
});
