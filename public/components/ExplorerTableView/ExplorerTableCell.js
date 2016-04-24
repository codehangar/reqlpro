const React = require('react');
import InlineEdit from 'react-edit-inline';
import JSONTree from 'react-json-tree';
import _ from 'lodash';

console.log("heeeyyyyy")

var ExplorerTableCell = React.createClass({
  dataChanged: function(data) {
    console.log("dataChanged", this.props.row)
    this.props.rowChanged('', _.merge({}, this.props.row, data), this.props.fieldName);
  },
  composeCellBody: function(row, fieldName) {
    // const data = JSON.parse(JSON.stringify(row[fieldName]));
    const data = row[fieldName];
    if (this.props.row.id === '965c8bd9-ba13-4448-a4c9-be258bdc182d' && this.props.fieldName === 'name') {
      console.log("data", data)
    }
    // data = new Date().getSeconds();
    if (typeof data !== 'object') {
      return <InlineEdit text={data} change={this.dataChanged} paramName={fieldName} />;
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
      console.log("render TableCell")
      console.log("this.props.row", this.props.row)
    }
    return (
      <div>
        {this.composeCellBody(this.props.row, this.props.fieldName)}
      </div>
    );
  }
});
module.exports = ExplorerTableCell;
