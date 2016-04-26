const React = require('react');
const classNames = require('classnames');
const ace = require('brace');
require('brace/mode/json');

const ExplorerCodeView = React.createClass({
  componentDidMount: function() {
    this.editor = ace.edit("editor");
    this.editor.$blockScrolling = Infinity;
    this.editor.getSession().setMode("ace/mode/json");
    this.editor.getSession().setTabSize(2);
    this.editor.getSession().setUseSoftTabs(true);
    this.editor.setHighlightActiveLine(false);
    this.editor.gotoLine(2);
    this.editor.setValue(JSON.stringify(this.props.table.codeBody, null, '\t'), -1);
    this.editor.focus();
    window.onresize = () => this.forceUpdate();
  },
  componentWillReceiveProps: function() {
    this.editor.setValue(JSON.stringify(this.props.table.codeBody, null, '\t'), -1);
    this.editor.focus();
  },
  render: function() {
    return (
      <div className="explorer-code-view" style={{
        'height': window.innerHeight - 115,
        'width': document.getElementById('explorer-body').offsetWidth - 30
      }}>
        <div id="editor"></div>
      </div>
    );
  }
});

module.exports = ExplorerCodeView;
