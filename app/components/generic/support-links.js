import React from 'react';
const { shell } = require('electron');

export const HelpCenter = () => {
  return (
    <a className="clickable" onClick={() => {
      shell.openExternal('http://reqlpro.com/support');
    }}>Help Center</a>
  );
};

export const SendMessage = () => {
  return (
    <a className="clickable" onClick={() => {
      HS.beacon.open();
    }}>send us a message</a>
  );
};
