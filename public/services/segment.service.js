import _ from 'lodash';
import AnonId from './anon-id.service';
import { remote } from 'electron';
// import reduxStore from '../store';
import ConfigService from './config.service';
// Special import because it must run in Electron's "Main" process, not the "Renderer" process
const analytics = remote.require('./public/services/segment.config');

function Segment() {

  // console.log('segment service store',reduxStore.getState());

  this.track = function(payload) {
    ConfigService.readConfigFile()
      .then((userConfig) => {
        const properties = Object.assign(payload.properties || {}, {
          platform: navigator.platform,
        });
        console.log('userConfig', userConfig); // eslint-disable-line no-console
        let email;
        if (userConfig) {
          email = userConfig.email || null;
        }
        AnonId.get(function(anonId) {
          _.extend(payload, {
            anonymousId: anonId,
            userId: email,
            context: {
              userAgent: navigator.userAgent,
              platform: navigator.platform
            },
            properties: properties
          });
          analytics.track(payload);
          console.log('[Segment] track', payload);
        });
      });
  };

  this.identify = function(payload) {
    AnonId.get(function(anonId) {

      const traits = Object.assign(payload.traits, {
        anonId: anonId,
        platform: navigator.platform
      });

      _.extend(payload, {
        anonymousId: anonId,
        context: {
          userAgent: navigator.userAgent
        },
        traits: traits
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
      analytics.flush(); // flush the alias
      console.log("[Segment] alias", payload)
    });
  };

  return this;

}
export default new Segment();
