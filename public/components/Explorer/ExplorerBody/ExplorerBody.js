import React from 'react';
import ExplorerTreeView from './Views/ExplorerTreeView';
import ExplorerTableView from './Views/ExplorerTableView/ExplorerTableView';
import ExplorerCodeView from './Views/ExplorerCodeView';
import Segment from '../../../services/segment.service.js';

class ExplorerBody extends React.Component {

  componentWillReceiveProps(props) {
    if (props.table.data) {
      let isNested;
      console.log('props.table.type', props.table.type); // eslint-disable-line no-console
      console.log('props.table.codeAction', props.table.codeAction); // eslint-disable-line no-console
      if (props.table.type === 'code') {
        if (props.table.codeAction === 'update') {
          if (typeof props.table.editingRecord === 'object' && Object.keys(props.table.editingRecord).length) {
            isNested = true;
          }
        }
      } else {
        if (props.table.data.length > 0) {
          isNested = false;
        }
        props.table.data.forEach(row => {
          if (typeof row === 'object') {
            Object.keys(row).forEach(field => {
              console.log('field', field); // eslint-disable-line no-console
              console.log('typeof field', typeof field); // eslint-disable-line no-console
              if (typeof row[field] === 'object' && Object.keys(row[field]).length) {
                isNested = true;
              }
            });
          }
        });
      }
      console.log('------------------------'); // eslint-disable-line no-console
      console.log('isNested', isNested);
      console.log('------------------------'); // eslint-disable-line no-console
      Segment.track({
        event: 'View Data',
        properties: {
          view: props.table.type,
          isNested
        }
      });
    }
  }

  render() {
    const { width, table } = this.props;

    const loading = (
      <div className="explorer-loading">
        <span className="fa fa-refresh fa-spin"/>
      </div>
    );

    const emptyTable = (
      <div className="explorer-container">
        <div className="explorer-full-message">
          <p className="super-large-text">Empty!</p>
          <p className="">Your table has no data. Try adding a new record.</p>
          <p className="small-text">Having trouble? Visit our <a href="http://utils.codehangar.io/rethink/support"
                                                                 target="_blank">Help Center</a> or <a
            onClick={function() {
              HS.beacon.open();
            }}>send us a message</a>.</p>
          {/* <p className="text-danger small-text">{this.state.selectedFavorite.dbConnection.msg}</p> */}
        </div>
      </div>
    );

    const queryError = (
      <div className="explorer-container">
        <div className="explorer-full-message">
          <p className="super-large-text">Oh No!</p>
          <p className="">There was an error running your query</p>
          <pre className="text-danger">
          {table.queryError ? table.queryError.name + '\n' + table.queryError.msg : ''}
          </pre>
        </div>
      </div>
    );

    let explorerBody;

    if (table.loading) {
      explorerBody = loading;
    } else if (table.queryError) {
      explorerBody = queryError;
    } else {
      if (table.data.length || table.type === 'code') {
        if (table.type === 'tree') {
          explorerBody = <ExplorerTreeView table={table}/>;
        } else if (table.type === 'table') {
          explorerBody = <ExplorerTableView table={table} className="data-table-main"/>;
        } else if (table.type === 'code') {
          explorerBody = <ExplorerCodeView table={table}/>;
        }
      } else {
        explorerBody = emptyTable;
      }
    }

    return (
      <div className="explorer-body" style={{ width: width }}>{explorerBody}</div>
    );
  }
}

export default ExplorerBody;
