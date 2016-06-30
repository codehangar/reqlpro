const React = require('react');
const classNames = require('classnames');
const ace = require('brace');
require('brace/mode/json');

const ExplorerCodeView = React.createClass({
  getInitialState: function() {
    return {
      store: this.context.store,
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
    console.log(this.state.store.selectedTable);
    this.editor = ace.edit("editor");
    this.editor.$blockScrolling = Infinity;
    this.editor.getSession().setMode("ace/mode/json");
    this.editor.getSession().setTabSize(2);
    this.editor.getSession().setUseSoftTabs(true);
    this.editor.setHighlightActiveLine(false);
    this.editor.setValue(this.state.store.selectedTable.codeBody, -1);
    this.editor.gotoLine(2);
    this.editor.focus();

    this.editor.getSession().on('change', () => {
      const string = ace.edit("editor").getValue();
      this.state.store.updateCodeBody(string);
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
  componentWillReceiveProps: function() {
    this.editor.setValue(this.state.store.selectedTable.codeBody, -1);
    this.editor.focus();
  },
  render: function() {
    const toastClasses = classNames({
      'toast-container': true,
      'bg-danger': true,
      'hide': this.state.store.selectedTable.codeBodyError === null
    });

    return (
      <div className="explorer-code-view" style={{
        'height': window.innerHeight - 105,
        'width': '100%'
      }}>
        <div className={toastClasses}>
          <div className="row">
            <i className="btn fa fa-close pull-right" onClick={() => this.state.store.clearCodeBodyError()}></i>
            <pre style={{margin: '5px'}}>{this.state.store.selectedTable.codeBodyError}</pre>
          </div>
        </div>
        <div id="editor"></div>
        <div className="fixedDataTableLayout_topShadow public_fixedDataTable_topShadow" style={this.state.topShadowStyle}></div>
        <div className="fixedDataTableLayout_bottomShadow public_fixedDataTable_bottomShadow" style={this.state.bottomShadowStyle}></div>
      </div>
    );
  }
});
ExplorerCodeView.contextTypes = {
  store: React.PropTypes.object
};

module.exports = ExplorerCodeView;
