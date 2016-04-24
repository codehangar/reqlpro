var React = require('react');
var classNames = require('classnames');
var RethinkDbClient = window.rethinkDbClient;

var ExplorerFooter = React.createClass({
  prevPage: function () {
    const limit = this.props.table.limit;
    const page = this.props.table.page - 1;
    RethinkDbClient.getTableData(this.props.table.name, 'id', limit, page);
  },
  nextPage: function () {
    const limit = this.props.table.limit;
    const page = this.props.table.page + 1;
    RethinkDbClient.getTableData(this.props.table.name, 'id', limit, page);
  },
  prevPageBetween: function () {
    const end = this.props.table.data[0].name;
    RethinkDbClient.getTableDataBetween(this.props.table.name, 'name', null, end);
  },
  nextPageBetween: function () {
    const start = this.props.table.data[this.props.table.data.length-1].name;
    RethinkDbClient.getTableDataBetween(this.props.table.name, 'name', start);
  },
  addItem: function () {
    RethinkDbClient.insert(this.props.table.name, {
      name: 'Johnny ' + (new Date()).getSeconds()
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