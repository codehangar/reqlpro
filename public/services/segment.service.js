// var Analytics = require("analytics-node");
var _ = require('lodash');
var AnonId = require('./anon-id.service');

var analytics = new Analytics('78RGOCvUxccFFdR2EIj9wEUGt8qLSPqS', {
  flushAt: 1
});

function Segment() {

  this.track = function(payload) {
    AnonId.get(function(anonId) {
      _.extend(payload, {
        anonymousId: anonId,
        context: {
          userAgent: navigator.userAgent
        }
      });
      analytics.track(payload);
      console.log('payload', payload, analytics);
    });
  };

  this.identify = function(payload) {
    AnonId.get(function(anonId) {
      angular.extend(payload, {
        anonymousId: anonId,
        context: {
          userAgent: navigator.userAgent
        }
      });
      analytics.identify(payload);
    });
  };

  this.getUserId = function(user, cfg) {
    if (user && user.email) {
      return user.email;
    } else if (cfg && cfg.bitlyConfig && cfg.bitlyConfig.email) {
      return cfg.bitlyConfig.email;
    } else {
      return void 0;
    }
  }

  return this;

}
module.exports = new Segment();
