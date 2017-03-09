import React from 'react';
import Connections from './Connections/Connections';
import Databases from './Databases/Databases';

const Sidebar = ({}) => {
  return (
    <div className="sidebar">
      <Connections />
      <Databases />
    </div>
  );
};

export default Sidebar;
