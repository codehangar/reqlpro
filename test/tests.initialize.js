import chai from 'chai';
import chaiImmutable from 'chai-immutable';
beforeEach(function() {

    chai.use(chaiImmutable);
    global.expect = require('chai').expect;
    global.List = require('immutable').List;
    global.Map = require('immutable').Map;
    global.sinon = require('sinon');
    global.mockery = require('mockery');
});
