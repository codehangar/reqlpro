import _ from 'lodash';
import AnonId from './anon-id.service';
import { remote } from 'electron';

// Special import because it must run in Electron's "Main" process, not the "Renderer" process
const analytics = remote.require('./public/services/segment.config');

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
