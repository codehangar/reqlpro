import React from 'react';
import Favorites from './Favorites/Favorites';
import Databases from './Databases/Databases';

const Sidebar = ({}) => {
  return (
    <div className="sidebar">
      <Favorites />
      <Databases />
    </div>
  );
};

export default Sidebar;