const React = require('react');
import { RIEInput } from 'riek'
import JSONTree from 'react-json-tree';
import _ from 'lodash';

var ExplorerTableCell = React.createClass({
  dataChanged: function(data) {
    this.props.rowChanged(_.merge({}, this.props.row, data), this.props.fieldName);
  },
  composeCellBody: function(row, fieldName) {

    const data = row[fieldName];

    if (typeof data !== 'object') {
      return <RIEInput value={data} change={this.dataChanged} propName={fieldName} shouldBlockWhileLoading={true} classLoading="loading-cell" classEditing="form-control" />;
    } else {
      if (data) {
        if (Object.keys(data).length) {
          return <JSONTree data={data} />;
        } else {
          return JSON.stringify(data);
        }
      } else {
        return JSON.stringify(data);
      }
    }
  },
  render: function() {
    if (this.props.row.id === '965c8bd9-ba13-4448-a4c9-be258bdc182d' && this.props.fieldName === 'name') {
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
