// var Analytics = require("analytics-node");
var _ = require('lodash');
var AnonId = require('./anon-id.service');

var analytics = new Analytics('lU0Oq54ABsjViXkKOcZe8YfeB18UbaNU', {
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
      console.log('[Segment] track', payload);
    });
  };

  this.identify = function(payload) {
    AnonId.get(function(anonId) {
      _.extend(payload, {
        anonymousId: anonId,
        context: {
          userAgent: navigator.userAgent
        }
      });
      analytics.identify(payload);
      console.log("[Segment] identify", payload)
    });
  };

  this.alias = function(userId) {
    AnonId.get(function(anonId) {
      var payload = {
        previousId: anonId,
        userId: userId
      };
      analytics.alias(payload);
      console.log("[Segment] alias", payload)
    });
  };

  return this;

}
module.exports = new Segment();
