export function setConnections(state, connections) {
  return state.set('connections', List(connections));
}

export function setEmail(state, email) {
  if (email) {
    return state
      .set('email', email)
      .set('EmailIntro', false);
  }
}