import React from 'react';
import { connect } from 'react-redux';

const AddDbTable = ({
  onAddTable
}) => {
    return (
      <div onClick={onAddTable} className="db-table">
        <div><i className="fa fa-plus"></i> Add Table</div>
      </div>
    );
};

module.exports = AddDbTable;
