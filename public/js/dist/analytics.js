"use strict";

var QueryEditor = React.createClass({
  displayName: "QueryEditor",

  render: function render(argument) {
    return React.createElement("div", { id: "queryEditor" });
  }
});

var AnalyricsContainer = React.createClass({
  displayName: "AnalyricsContainer",

  componentDidMount: function componentDidMount() {
    var myCodeMirror = CodeMirror(document.getElementById('queryEditor'), {
      value: "{\n  $groupBy: ''\n}",
      mode: "javascript",
      json: true,
      lineNumbers: true
    });
  },

  render: function render(argument) {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "h2",
        null,
        "AnalyricsContainer"
      ),
      React.createElement(QueryEditor, null)
    );
  }
});

React.render(React.createElement(AnalyricsContainer, null), document.getElementById('content'));