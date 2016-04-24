var React = require('react');
var classNames = require('classnames');
var RethinkDbClient = window.rethinkDbClient;

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
  addItem: function() {
    RethinkDbClient.insert({
      name: 'Johnny ' + (new Date()).getSeconds(),
      age: (new Date()).getSeconds()
    });
  },
  render: function() {
    return (
      <div className="row">
        <div className="col-md-12">
          <footer className="footer explorer-footer">
            <div className="not-text-center">
              <button className="btn" onClick={this.prevPageBetween}>
                <i className="fa fa-arrow-left"></i>
              </button>
              Displaying {this.props.table.data.length} rows of {this.props.table.size} (Page {this.props.table.page} of {this.props.table.size / this.props.table.limit})
              <button className="btn" onClick={this.nextPageBetween}>
                <i className="fa fa-arrow-right"></i>
              </button>
              <button className="btn" onClick={this.addItem}>
                <i className="fa fa-plus"></i>
              </button>
            </div>
          </footer>
        </div>
      </div>
    );
  }
});

module.exports = ExplorerFooter;
