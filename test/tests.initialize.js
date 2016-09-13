import chai from 'chai';
import spies from 'chai-spies';
beforeEach(function() {

  // const window = {};

    global.expect = chai.expect;
    global.sinon = require('sinon');
    global.mockery = require('mockery');
    chai.use(spies);
    global.spy = chai.spy;
    // global.window.nodeRequire = require;
});
