var React = require('react');

var AddDbTable = React.createClass({
  getInitialState: function() {
    return this.context.store;
  },
  addDatabase: function(e) {
    this.state.toggleEntityForm('Table', 'Add');
  },
  render: function() {
    return (
      <div onClick={this.addDatabase} className="db-table">
        <div><i className="fa fa-plus"></i> Add Table</div>
      </div>
    );
  }
});
AddDbTable.contextTypes = {
  store: React.PropTypes.object
};

module.exports = AddDbTable;
