var React = require('react');
var classNames = require('classnames');
var RethinkDbClient = window.rethinkDbClient;
var ExplorerPagination = require('../ExplorerPagination/ExplorerPagination');

var ExplorerFooter = React.createClass({
  prevPage: function() {
    const index = this.props.table.query.index;
    const limit = this.props.table.query.limit;
    const page = this.props.table.query.page - 1;
    RethinkDbClient.query({index, limit, page});
  },
  nextPage: function() {
    const index = this.props.table.query.index;
    const limit = this.props.table.query.limit;
    const page = this.props.table.query.page + 1;
    RethinkDbClient.query({index, limit, page});
  },
  prevPageBetween: function() {
    const index = this.props.table.query.index;
    const end = this.props.table.data[0].name;
    RethinkDbClient.query({index, end});
  },
  nextPageBetween: function() {
    const index = this.props.table.query.index;
    const start = this.props.table.data[this.props.table.data.length - 1].name;
    RethinkDbClient.query({index, start});
  },
  render: function() {
    return (
      <div className="row">
        <div className="col-md-12">
          <footer className="footer explorer-footer">
            <div className="not-text-center">
              <ExplorerPagination
                prevPage={this.prevPage}
                nextPage={this.nextPage}
                table={this.props.table} />
            </div>
          </footer>
        </div>
      </div>
    );
  }
});

module.exports = ExplorerFooter;
