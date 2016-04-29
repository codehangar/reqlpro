var React = require('react');
var classNames = require('classnames');
var ExplorerPagination = require('../ExplorerPagination/ExplorerPagination');
const ace = require('brace');

var ExplorerFooter = React.createClass({
  prevPage: function() {
    const index = this.props.table.query.index;
    const limit = this.props.table.query.limit;
    const page = this.props.table.query.page - 1;
    this.props.store.query({index, limit, page});
  },
  nextPage: function() {
    const index = this.props.table.query.index;
    const limit = this.props.table.query.limit;
    const page = this.props.table.query.page + 1;
    this.props.store.query({index, limit, page});
  },
  prevPageBetween: function() {
    const index = this.props.table.query.index;
    const end = this.props.table.data[0].name;
    this.props.store.query({index, end});
  },
  nextPageBetween: function() {
    const index = this.props.table.query.index;
    const start = this.props.table.data[this.props.table.data.length - 1].name;
    this.props.store.query({index, start});
  },
  save: function() {
    const editor = ace.edit("editor");
    const string = editor.getValue();
    this.props.store.saveRow(string);
  },
  render: function() {
    let footerBody = (
      <div className="text-center">
        <ExplorerPagination
          prevPage={this.prevPage}
          nextPage={this.nextPage}
          table={this.props.table} />
      </div>
    );

    if (this.props.table.type === 'code') {
      footerBody = (
        <div className="not-text-center pull-right">
          <span className="btn btn-primary" onClick={this.save}>Save</span>
        </div>
      );
    }

    if (this.props.table.type !== 'code' && !this.props.table.data.length) {
      footerBody = '';
    }

    return (
      <div className="explorer-footer">
        {footerBody}
      </div>
    );
  }
});

module.exports = ExplorerFooter;
