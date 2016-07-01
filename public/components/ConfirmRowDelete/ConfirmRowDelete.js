const React = require('react');
const classNames = require('classnames');
const Segment = require('../../services/segment.service');

const ConfirmRowDelete = React.createClass({
  getInitialState: function() {
    return {
      store: this.context.store
    };
  },
  handleCancel: function(e) {
    e.preventDefault();
    this.state.store.toggleConfirmRowDelete(null);
  },
  handleDelete: function(e) {
    e.preventDefault();
    this.state.store.deleteRow(this.state.store.router.ConfirmRowDelete.row);
    Segment.track({
      event: 'tableview.row.deleteBtn',
      properties: {}
    });
  },
  render: function() {
    const classes = {
      confirmRowDelete: classNames(
        'ConfirmRowDelete',
        {
          'show': this.state.store.router.ConfirmRowDelete.show,
          'hidden': !this.state.store.router.ConfirmRowDelete.show
        }
      )
    };
    var recordId = this.state.store.router.ConfirmRowDelete.row ? this.state.store.router.ConfirmRowDelete.row.id : '';
    return (
      <div className={classes.confirmRowDelete}>
        <div className="panel panel-danger">
          <div className="panel-heading">
            <strong>Delete Record - {recordId}</strong>
          </div>
          <div className="panel-body">
            <div className="row">
              <div className="col-sm-12">
                <form>
                  <p>Are you sure you want to delete this record?</p>
                </form>
              </div>
            </div>
          </div>
          <div className="panel-footer">
            <button type="delete" className="btn btn-danger pull-right" onClick={this.handleDelete}>Delete</button>
            <button type="cancel" className="btn btn-default pull-left" onClick={this.handleCancel}>Cancel</button>
            <div className="clearfix"/>
          </div>
        </div>
      </div>
    );
  }
});

ConfirmRowDelete.contextTypes = {
  store: React.PropTypes.object
};

module.exports = ConfirmRowDelete;
