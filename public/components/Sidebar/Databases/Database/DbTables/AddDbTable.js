import React from 'react';

const AddDbTable = ({
  onAddTable
}) => {
  return (
    <div onClick={onAddTable} className="db-table">
      <div><i className="fa fa-plus"/> Add Table</div>
    </div>
  );
};

export default  AddDbTable;
