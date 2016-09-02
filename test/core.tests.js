import {
  setConnections,
  setEmail
} from '../public/core';

describe('Aplication Logic', () => {

  describe('setConnections', () => {
    it('adds connections to the state', () => {
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

})
