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
    this.editor = ace.edit("editor");
    this.editor.$blockScrolling = Infinity;
    this.editor.getSession().setMode("ace/mode/json");
    this.editor.getSession().setTabSize(2);
    this.editor.getSession().setUseSoftTabs(true);
    this.editor.setHighlightActiveLine(false);
    this.editor.gotoLine(2);
    this.editor.setValue(JSON.stringify(this.state.store.selectedTable.codeBody, null, '\t'), -1);
    this.editor.focus();
    this.editor.getSession().on('change', () => {
      const string = ace.edit("editor").getValue();
      this.state.store.updateCodeBody(string);
    });
  },
  componentWillReceiveProps: function() {
    this.editor.setValue(JSON.stringify(this.state.store.selectedTable.codeBody, null, '\t'), -1);
    this.editor.focus();
  },
  render: function() {
    return (
      <div className="explorer-code-view" style={{
        'height': window.innerHeight - 115,
        'width': '100%'
      }}>
        <div id="editor"></div>
      </div>
    );
  }
});
ExplorerCodeView.contextTypes = {
  store: React.PropTypes.object
};

module.exports = ExplorerCodeView;
