import React from 'react';
import classNames from 'classnames';
import ExplorerPagination from '../ExplorerPagination/ExplorerPagination';
import Segment from '../../services/segment.service';
import ace from 'brace';
import {connect} from "react-redux";

const ExplorerFooter = ({
  selectedTable,
  onCancelClick,
  prevPage,
  nextPage,
  prevPageBetween,
  nextPageBetween,
  save
}) => {

  let footerBody = (
    <div className="text-center">
      <ExplorerPagination
        prevPage={prevPage}
        nextPage={nextPage}
        table={selectedTable}/>
    </div>
  );

  if (selectedTable.type === 'code') {
    footerBody = (
      <div className="not-text-center pull-right">
        <span className="btn btn-default" onClick={onCancelClick} style={{marginRight: '10px'}}>Cancel</span>
        <span className="btn btn-primary" onClick={save}>Save</span>
      </div>
    );
  }

  if (selectedTable.type !== 'code' && !selectedTable.data.length) {
    footerBody = '';
  }

  return (
    <div className="explorer-footer">
      {footerBody}
    </div>
  );
};


const mapStateToProps = (state) => {
  return {
    selectedTable: state.main.selectedTable
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCancelClick: () => {
      dispatch({
        type: 'CANCEL_ROW_EDIT'
      });

      Segment.track({
        event: 'explorer.cancelEdit',
        properties: {}
      });
    },
    prevPage: function() {
      const index = this.props.table.query.index;
      const limit = this.props.table.query.limit;
      const page = this.props.table.query.page - 1;
      this.props.store.query({index, limit, page});

      Segment.track({
        event: 'explorer.paginationClick',
        properties: {
          'type': 'prevPage',
          'page': page,
          'limit': limit
        }
      });
    },
    nextPage: function() {
      const index = this.props.table.query.index;
      const limit = this.props.table.query.limit;
      const page = this.props.table.query.page + 1;
      this.props.store.query({index, limit, page});

      Segment.track({
        event: 'explorer.paginationClick',
        properties: {
          'type': 'nextPage',
          'page': page,
          'limit': limit
        }
      });
    },
    prevPageBetween: function() {
      const index = this.props.table.query.index;
      const end = this.props.table.data[0].name;
      this.props.store.query({index, end});
    },
    nextPageBetween: function() {
      const index = this.props.table.query.index;
      const start = this.props.table.data[this.props.table.data.length - 1].name;
      this.props.store.query({index, start});
    },
    save: function() {
      const editor = ace.edit("editor");
      let string = editor.getValue();

      // Allows new Date() to be entered on edit view
      // string = string.replace('new Date()', '"' + new Date() + '"');
      this.props.store.saveRow(string);

      Segment.track({
        event: 'explorer.saveRow',
        properties: {}
      });
    }
  };
};

const ExplorerFooterContainer = connect(mapStateToProps, mapDispatchToProps)(ExplorerFooter);

module.exports = ExplorerFooterContainer;
