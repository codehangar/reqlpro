import React from 'react';
import { connect } from 'react-redux';

const AddDbTable = ({
  addTable
}) => {
  return (
    <div onClick={addTable} className="db-table">
      <div><i className="fa fa-plus"></i> Add Table</div>
    </div>
  );
};

function mapStateToProps(state) {
  return {};
}
const mapDispatchToProps = (dispatch) => {
  return {
    addTable: function () {
      dispatch({
        type: 'TOGGLE_TABLE_FORM',
        showTableForm: true
      });
    }
  };
};

const AddDbTableContainer = connect(mapStateToProps, mapDispatchToProps)(AddDbTable);

module.exports = AddDbTableContainer;
