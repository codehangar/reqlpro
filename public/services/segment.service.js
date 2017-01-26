// var Analytics = require("analytics-node");
const _ = require('lodash');
const AnonId = require('./anon-id.service');
const Analytics = window.nodeRequire('analytics-node');

let SegmentKey = 'lU0Oq54ABsjViXkKOcZe8YfeB18UbaNU';
if (process.env.NODE_ENV === 'dev') {
  SegmentKey = '';
}

const analytics = new Analytics(SegmentKey, {
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
      // console.log('[Segment] track', payload);
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
      const payload = {
        previousId: anonId,
        userId: userId
      };
      analytics.alias(payload);
      console.log("[Segment] alias", payload)
    });
  };

  return this;

}
export default new Segment();
