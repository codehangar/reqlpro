var React = require('react');
var classNames = require('classnames');

var ExplorerCodeView = React.createClass({
  componentDidMount: function() {
    var editor = ace.edit("editor");
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
