const React = require('react');
const classNames = require('classnames');
const ace = require('brace');
require('brace/mode/json');

const ExplorerCodeView = React.createClass({
  componentDidMount: function() {
    const editor = ace.edit("editor");
    editor.getSession().setMode("ace/mode/json");

    if (this.props.table.editItem) {
      editor.setValue(JSON.stringify(this.props.table.editItem)); // or session.setValue
    } else {
      editor.setValue("{\n  \n}"); // or session.setValue
    }

    editor.getSession().setTabSize(2);
    editor.getSession().setUseSoftTabs(true);
    editor.setHighlightActiveLine(false);
    editor.gotoLine(2);
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
