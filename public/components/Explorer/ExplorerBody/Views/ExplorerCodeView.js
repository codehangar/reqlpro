import React from 'react';
import classNames from 'classnames';
import ace from 'brace';
import {connect} from "react-redux";

// Looks weird, but this is necessary to apply the theme to ace editor
require('brace/mode/json');

const ExplorerCodeView = React.createClass({
  getInitialState: function() {
    return {
      topShadowStyle: {
        top: '0',
        display: 'none'
      },
      bottomShadowStyle: {
        bottom: '0',
        display: 'none'
      }
    }
  },
  componentDidMount: function() {
    this.editor = ace.edit("editor");
    this.editor.$blockScrolling = Infinity;
    this.editor.getSession().setMode("ace/mode/json");
    this.editor.getSession().setTabSize(2);
    this.editor.getSession().setUseSoftTabs(true);

    // Disables Syntax error highlighting
    // http://stackoverflow.com/questions/12886857/how-can-i-disable-the-syntax-checker-in-ace-editor
    this.editor.getSession().setUseWorker(false);

    this.editor.setShowInvisibles(true);
    this.editor.setHighlightActiveLine(false);
    this.editor.setValue(this.props.selectedTable.codeBody, -1);
    this.editor.gotoLine(2, 2);
    this.editor.focus();

    this.editor.getSession().on('change', () => {
      const string = ace.edit("editor").getValue();
      this.props.updateCodeBody(string);
    });

    this.editor.getSession().on('changeScrollTop', this.handleScroll);
    this.handleScroll(0);

  },
  handleScroll: function(scrollPos) {

    /*
     * Determine Height of Ace Editor Session
     * Sadly there is no helper method for this
     * Assuming a row height of 16px
     */
    const rowHeight = 16;
    const rowCount = this.editor.getSession().getScreenLength();
    const editorHeight = rowCount * rowHeight;

    const containerHeight = window.innerHeight - 105;
    const scrollPosBottom = containerHeight + scrollPos;

    if (scrollPos <= 0) {
      this.setState({
        topShadowStyle: {
          top: '0',
          display: 'none'
        },
        bottomShadowStyle: {
          bottom: '0',
          display: 'block'
        }
      })
    } else if (scrollPosBottom >= editorHeight) {
      this.setState({
        topShadowStyle: {
          top: '0',
          display: 'block'
        },
        bottomShadowStyle: {
          bottom: '0',
          display: 'none'
        }
      })
    } else {
      this.setState({
        topShadowStyle: {
          top: '0',
          display: 'block'
        },
        bottomShadowStyle: {
          bottom: '0',
          display: 'block'
        }
      })
    }
  },
  render: function() {
    const toastClasses = classNames({
      'toast-container': true,
      'bg-danger': true,
      'hide': this.props.selectedTable.codeBodyError === null
    });

    return (
      <div className="explorer-code-view" style={{
        'height': window.innerHeight - 105,
        'width': '100%'
      }}>
        <div className={toastClasses}>
          <div className="row">
            <i className="btn fa fa-close pull-right" onClick={this.props.clearCodeBodyError}/>
            <pre style={{margin: '5px'}}>{this.props.selectedTable.codeBodyError}</pre>
          </div>
        </div>
        <div id="editor"></div>
        <div className="fixedDataTableLayout_topShadow public_fixedDataTable_topShadow" style={this.state.topShadowStyle}></div>
        <div className="fixedDataTableLayout_bottomShadow public_fixedDataTable_bottomShadow" style={this.state.bottomShadowStyle}></div>
      </div>
    );
  }
});

const mapStateToProps = (state) => {
  return {
    selectedTable: state.main.selectedTable
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearCodeBodyError: () => {
      dispatch({
        type: 'SET_CODE_BODY_ERROR',
        codeBodyError: null
      });
    },
    updateCodeBody: (codeBody) => {
      dispatch({
        type: 'SET_CODE_BODY',
        codeBody
      });
    }
  };
};

const ExplorerCodeViewContainer = connect(mapStateToProps, mapDispatchToProps)(ExplorerCodeView);

module.exports = ExplorerCodeViewContainer;