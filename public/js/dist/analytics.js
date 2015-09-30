"use strict";

var pgUtils = new PGUtils();

var QueryEditor = React.createClass({
  displayName: "QueryEditor",

  render: function render(argument) {
    return React.createElement(
      "div",
      { className: "row" },
      React.createElement("div", { className: "column sixteen wide", id: "queryEditor" })
    );
  }
});

var SendQueryButton = React.createClass({
  displayName: "SendQueryButton",

  sendQuery: function sendQuery() {
    var queryResults = pgUtils.sendAnalyticsQuery();
    console.log(queryResults);
  },

  render: function render(argument) {
    return React.createElement(
      "div",
      { className: "right aligned column" },
      React.createElement(
        "button",
        { onClick: this.sendQuery, className: "ui olive button" },
        "Query"
      )
    );
  }
});

var BottomActions = React.createClass({
  displayName: "BottomActions",

  render: function render(argument) {
    return React.createElement(
      "div",
      { className: "row" },
      React.createElement(SendQueryButton, null)
    );
  }
});

var AnalyticsContainer = React.createClass({
  displayName: "AnalyticsContainer",

  mixins: [Reflux.connect(analyticsStore, "configuration")],

  componentDidMount: function componentDidMount() {
    var myCodeMirror = CodeMirror(document.getElementById('queryEditor'), {
      value: "{\n  $groupBy: ''\n}",
      mode: "application/json",
      json: true,
      matchBrackets: true,
      lineNumbers: true
    });
  },

  render: function render(argument) {
    return React.createElement(
      "div",
      { className: "ui grid" },
      React.createElement(
        "h2",
        null,
        "AnalyticsContainer"
      ),
      React.createElement(QueryEditor, null),
      React.createElement(BottomActions, null)
    );
  }
});

React.render(React.createElement(AnalyticsContainer, null), document.getElementById('content'));