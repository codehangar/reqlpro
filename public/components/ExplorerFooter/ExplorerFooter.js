var React = require('react');
var classNames = require('classnames');
var RethinkDbClient = window.rethinkDbClient;

var ExplorerFooter = React.createClass({
  prevPage: function () {
    // const end = this.props.table.data[0].id;
    // console.log("end", end)
    // RethinkDbClient.getTableDataBetween(this.props.table.name, 'id', null, end);

    const limit = this.props.table.limit;
    const page = this.props.table.page - 1;
    RethinkDbClient.getTableData(this.props.table.name, 'id', limit, page);
  },
  nextPage: function () {
    // const start = this.props.table.data[this.props.table.data.length-1].id;
    // console.log("start", start)
    // RethinkDbClient.getTableDataBetween(this.props.table.name, 'id', start);

    const limit = this.props.table.limit;
    const page = this.props.table.page + 1;
    RethinkDbClient.getTableData(this.props.table.name, 'id', limit, page);
  },
  addItem: function () {

  },
  render: function() {
    return (
      <div className="row">
        <div className="col-md-12">
          <footer className="footer explorer-footer">
            <div className="not-text-center">
              <button>
                <i onClick={this.prevPage} className="fa fa-arrow-left"></i>
              </button>
              Displaying {this.props.table.data.length} rows of {this.props.table.size} (Page {this.props.table.page} of {this.props.table.size / this.props.table.limit})
              <button>
                <i onClick={this.nextPage} className="fa fa-arrow-right"></i>
              </button>
            </div>
          </footer>
        </div>
      </div>
    );
  }
});

module.exports = ExplorerFooter;