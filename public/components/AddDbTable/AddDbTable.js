import React from 'react';
import { connect } from 'react-redux';


var AddDbTable = React.createClass({
  // getInitialState: function() {
  //   return this.context.store;
  // },
  addDatabase: function(e) {
    this.state.toggleEntityForm('Table', 'Add');
  },
  render: function() {
    console.log('AddDbTable Component props', this.props)
    return (
      <div onClick={this.props.onAddDatabase} className="db-table">
        <div><i className="fa fa-plus"></i> Add Table</div>
      </div>
    );
  }
});
// AddDbTable.contextTypes = {
//   store: React.PropTypes.object


// const AddDbTable = ({
//   addTable
// }) => {
//   return (
//     <div onClick={addTable} className="db-table">
//       <div><i className="fa fa-plus"></i> Add Table</div>
//     </div>
//   );
// };

// function mapStateToProps(state) {
//   return {};
// }
// const mapDispatchToProps = (dispatch) => {
//   return {
//     addTable: function () {
//       dispatch({
//         type: 'TOGGLE_TABLE_FORM',
//         showTableForm: true
//       });
//     }
//   };
// };

// const AddDbTableContainer = connect(mapStateToProps, mapDispatchToProps)(AddDbTable);

module.exports = AddDbTable;
