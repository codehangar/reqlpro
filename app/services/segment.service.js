import { remote } from 'electron';
import {getAnonId} from './anon-id.service';
import ConfigService from './config.service';
import analytics from './segment.config';

const context = {
  userAgent: navigator.userAgent,
  platform: navigator.platform,
  appVersion: remote.getGlobal('appVersion')
};

let anonIdConfigPath;
if (global.configPath) {
  anonIdConfigPath = `${global.configPath}/anon-id.json`;
} else {
  anonIdConfigPath = `${remote.getGlobal('configPath')}/anon-id.json`;
}

function Segment() {

  this.track = async function(payload) {
    const userConfig = await ConfigService.readConfigFile();
    const email = userConfig.email || null;
    const anonId = await getAnonId(anonIdConfigPath);
    const properties = Object.assign({}, payload.properties, context);
    const finalPayload = Object.assign({}, payload, {
      anonymousId: anonId,
      userId: email,
      context,
      properties
    });
    console.log('[Segment] track', finalPayload);
    analytics.track(finalPayload);
    analytics.track({
      event: "User Interaction",
      anonymousId: anonId,
      userId: email,
      context,
      properties: {
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        appVersion: remote.getGlobal('appVersion')
      }
    });

  };

  this.identify = async function(payload) {
    const anonId = await getAnonId(anonIdConfigPath);
    const traits = Object.assign(payload.traits, context, { anonId });
    const finalPayload = Object.assign({}, payload, {
      anonymousId: anonId,
      context,
      traits
    });
    console.log("[Segment] identify", finalPayload)
    analytics.identify(finalPayload);
  };

  this.alias = async function(userId) {
    const anonId = await etAnonId(anonIdConfigPath);
    const payload = {
      previousId: anonId,
      userId: userId
    };
    console.log("[Segment] alias", payload)
    analytics.alias(payload);
    analytics.flush(); // flush the alias
  };

  return this;
}

export default new Segment();
