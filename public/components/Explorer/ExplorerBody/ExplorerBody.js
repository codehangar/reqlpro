import React from 'react';
import { connect } from 'react-redux';
import ExplorerTreeView from './Views/ExplorerTreeView';
import ExplorerTableView from './Views/ExplorerTableView/ExplorerTableView';
import ExplorerCodeView from './Views/ExplorerCodeView';
import { HelpCenter, SendMessage } from '../../generic/support-links';
import Segment from '../../../services/segment.service.js';

class ExplorerBody extends React.Component {

  // shouldComponentUpdate(nextProps) {
  //   console.log('nextProps.tableData ', nextProps.tableData); // eslint-disable-line no-console
  //   console.log('this.props.tableData', this.props.tableData); // eslint-disable-line no-console
  //   return nextProps.tableData !== this.props.tableData;
  // }
  //
  // componentWillReceiveProps(props) {
  //   if (props.tableData) {
  //     let isNested;
  //     console.log('props.table.type', props.tableType); // eslint-disable-line no-console
  //     console.log('props.codeAction', props.codeAction); // eslint-disable-line no-console
  //     if (props.tableType === 'table' || props.tableType === 'tree') {
  //       if (props.tableData.length > 0) {
  //         isNested = false;
  //       }
  //       props.tableData.forEach(row => {
  //         if (typeof row === 'object') {
  //           Object.keys(row).forEach(field => {
  //             if (typeof row[field] === 'object' && Object.keys(row[field]).length) {
  //               isNested = true;
  //               console.log('b'); // eslint-disable-line no-console
  //             }
  //           });
  //         }
  //       });
  //       console.log('------------------------'); // eslint-disable-line no-console
  //       console.log('isNested', isNested);
  //       console.log('------------------------'); // eslint-disable-line no-console
  //       Segment.track({
  //         event: 'View Data',
  //         properties: {
  //           view: props.tableType,
  //           isNested
  //         }
  //       });
  //     }
  //   }
  // }

  render() {
    const { width, tableData, tableType, queryError, loading } = this.props;

    const loadingElm = (
      <div className="explorer-loading">
        <span className="fa fa-refresh fa-spin"/>
      </div>
    );

    const emptyTable = (
      <div className="explorer-container">
        <div className="explorer-full-message">
          <p className="super-large-text">Empty!</p>
          <p className="">Your table has no data. Try adding a new record.</p>
          <p className="small-text">Having trouble? Visit our <HelpCenter/> or <SendMessage/>.</p>
        </div>
      </div>
    );

    const queryErrorElm = (
      <div className="explorer-container">
        <div className="explorer-full-message">
          <p className="super-large-text">Oh No!</p>
          <p className="">There was an error running your query</p>
          <pre className="text-danger">
          {queryError ? queryError.name + '\n' + queryError.msg : ''}
          </pre>
        </div>
      </div>
    );

    let explorerBody;

    if (loading) {
      explorerBody = loadingElm;
    } else if (queryError) {
      explorerBody = queryErrorElm;
    } else {
      if (tableData.length || tableType === 'code') {
        if (tableType === 'tree') {
          explorerBody = <ExplorerTreeView tableData={tableData}/>;
        } else if (tableType === 'table') {
          explorerBody = <ExplorerTableView className="data-table-main"/>;
        } else if (tableType === 'code') {
          explorerBody = <ExplorerCodeView />;
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


const mapStateToProps = (state) => {
  return {
    tableData: state.main.selectedTable.data,
    tableType: state.main.selectedTable.type,
    queryError: state.main.selectedTable.queryError,
    loading: state.main.selectedTable.loading,
    codeAction: state.main.selectedTable.codeAction
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};


export default connect(mapStateToProps, mapDispatchToProps)(ExplorerBody);
