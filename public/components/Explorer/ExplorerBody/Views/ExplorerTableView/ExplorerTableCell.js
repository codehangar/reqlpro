const React = require('react');
import { RIEInput, RIENumber } from 'riek'
import _ from 'lodash';

var ExplorerTableCell = React.createClass({
  dataChanged: function(data) {
    // {fieldName: value}
    this.props.rowChanged(_.merge({}, this.props.row, data), this.props.fieldName);
  },
  composeCellBody: function(row, fieldName) {

    const data = row[fieldName];

    if (typeof data === 'string') {
      return <RIEInput value={data} change={this.dataChanged} propName={fieldName} shouldBlockWhileLoading={true}
                       classLoading="loading-cell" classEditing="form-control"/>;
    } else if (typeof data === 'number') {
      return <RIENumber value={data} change={this.dataChanged} propName={fieldName} shouldBlockWhileLoading={true}
                        classLoading="loading-cell" classEditing="form-control"/>;
    } else {
      if (data) {

        if (Object.keys(data).length) {
          return '{Object ...}';
        } else {
          return JSON.stringify(data);
        }
      } else {
        return JSON.stringify(data);
      }
    }
  }
  ,
  render: function() {
    if (this.props.row.id === '11698a1f-f9db-4f9c-9fb8-4c27d75e1990' && this.props.fieldName === 'name') {
      console.log("    --> ExplorerTableCell render")
    }

    return (
      <div>
        {this.composeCellBody(this.props.row, this.props.fieldName)}
      </div>
    );
  }
});
module.exports = ExplorerTableCell;
