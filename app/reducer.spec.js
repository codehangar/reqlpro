import jdenticon from 'jdenticon';
import md5 from 'md5';
import reducer from './reducer';

describe('reducer', () => {

  it('handles SET_STATE', () => {
    const action = {
      type: 'SET_STATE',
      state: {
        main: {
          email: 'cassie@codehangar.io',
        },
        connections: [],
        connection: {}
      }
    };
    const nextState = reducer(void 0, action);

    expect(nextState).to.deep.equal({
      main: {
        email: 'cassie@codehangar.io',
      },
      connections: [],
      connection: {},
      databases: [],
      tables: {},
      forms: {
        connection: {},
        forms: {
          "$form": {
            "errors": {},
            "focus": false,
            "initialValue": {
              "connection": {},
            },
            "intents": [],
            "model": "forms",
            "pending": false,
            "pristine": true,
            "retouched": false,
            "submitFailed": false,
            "submitted": false,
            "touched": false,
            "valid": true,
            "validated": false,
            "validating": false,
            "validity": {},
            "value": {
              "connection": {},
            },
          },
          "connection": {
            "$form": {
              "errors": {},
              "focus": false,
              "initialValue": {},
              "intents": [],
              "model": "forms.connection",
              "pending": false,
              "pristine": true,
              "retouched": false,
              "submitFailed": false,
              "submitted": false,
              "touched": false,
              "valid": true,
              "validated": false,
              "validating": false,
              "validity": {},
              "value": {},
            }
          }
        }
      }
    });
  });
});
