const React = require('react');
const classNames = require('classnames');
const ace = require('brace');
require('brace/mode/json');

const ExplorerCodeView = React.createClass({
  getInitialState: function() {
    return {
      store: this.context.store
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
    this.editor.gotoLine(2);
    this.editor.setValue(this.state.store.selectedTable.codeBody, -1);
    this.editor.focus();
    this.editor.getSession().on('change', () => {
      const string = ace.edit("editor").getValue();
      this.state.store.updateCodeBody(string);
    });
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
        'height': window.innerHeight - 115,
        'width': '100%'
      }}>
        <div className={toastClasses}>
          <div className="row">
            <i className="btn fa fa-close pull-right" onClick={() => this.state.store.clearCodeBodyError()}></i>
          </div>
          <div className="row">
            <p>{this.state.store.selectedTable.codeBodyError}</p>
          </div>
        </div>
        <div id="editor"></div>
      </div>
    );
  }
});
ExplorerCodeView.contextTypes = {
  store: React.PropTypes.object
};

module.exports = ExplorerCodeView;
