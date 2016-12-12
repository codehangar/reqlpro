import React from 'react';
import ExplorerTreeView from '../ExplorerTreeView/ExplorerTreeView';
import ExplorerTableView from '../ExplorerTableView/ExplorerTableView';
import ExplorerCodeView from '../ExplorerCodeView/ExplorerCodeView';

const ExplorerBody = ({
  width,
  table
}) => {
    let explorerBody;
    if (table.loading) {
      explorerBody = (
        <div className="explorer-loading">
           <span className="fa fa-refresh fa-spin"></span>
        </div>
      );
    } else {
      if (table.data.length || table.type === 'code') {
        if (table.type === 'tree') {
          explorerBody = (
            <div>
              <ExplorerTreeView table={table} />
            </div>
          );
        } else if (table.type === 'table') {
          explorerBody = (
            <div style={{position:'relative'}}>
              <div className="table-view-container">
                <ExplorerTableView table={table} className="data-table-main"/>
              </div>
            </div>
          );
        } else if(table.type === 'code') {
          explorerBody = (
            <div>
              <ExplorerCodeView table={table} />
            </div>
          )
        }
      } else {
        explorerBody = (
          <div className="explorer-container">
            <div className="explorer-full-message">
              <p className="super-large-text">Empty!</p>
              <p className="">Your table has no data. Try adding a new record.</p>
              <p className="small-text">Having trouble? Visit our <a href="http://utils.codehangar.io/rethink/support" target="_blank">Help Center</a> or <a onClick={function() { HS.beacon.open(); }}>send us a message</a>.</p>
              {/* <p className="text-danger small-text">{this.state.selectedFavorite.dbConnection.msg}</p> */}
            </div>
          </div>
        );
      }
    }
  return (
    <div className="explorer-body" style={{width: width}}>{explorerBody}</div>
  );
};

module.exports = ExplorerBody;
