import {
  setConnections,
  setEmail,
  addConnection
} from '../public/core';

describe('Aplication Logic', () => {

  describe('setConnections', () => {
    it('adds saved connections to the state', () => {
      const state = Map();
      const connections = ['connection1', 'connection2'];
      let nextState = setConnections(state, connections);
      expect(nextState).to.equal(Map({
        connections: List.of('connection1', 'connection2')
      }));
    });
  });

  describe('setEmail', () => {
    it('adds email to redux store', () => {
      const state = {};
      const email = 'cassie@codehangar.io';
      let nextState = setEmail(state, email);
      expect(nextState).to.deep.equal({
        email: 'cassie@codehangar.io'
      });
    });
  });

  describe('addConnection', () => {
    it('adds a new connection to the redux store', () =>{
      const state = {
        email: 'cassie@codehangar.io'
      }
      const connection = {
        authKey: "",
        database: "",
        host: "192.168.99.100",
        identicon: "",
        index: 0,
        name: "rethink-tut",
        port: "32769"
      }
      const nextState = addConnection(state, connection);
      expect(nextState).to.deep.equal({
        email: 'cassie@codehangar.io',
        connections:[{
          authKey: "",
          database: "",
          host: "192.168.99.100",
          identicon: "",
          index: 0,
          name: "rethink-tut",
          port: "32769"
        }]
      })
    });
  })

})
