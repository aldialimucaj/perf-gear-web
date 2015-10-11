"use strict";

var pgUtils = new PGUtils();

// ============================================================================
var QueryEditor = React.createClass({
  displayName: "QueryEditor",

  handleChange: function handleChange(event) {
    console.log("queryJson changed");
  },

  render: function render(argument) {
    return React.createElement(
      "div",
      { className: "row" },
      React.createElement(
        "div",
        { className: "column sixteen wide" },
        React.createElement("textarea", { id: "queryEditor", value: "m.count();", onChange: this.handleChange })
      )
    );
  }
});

// ============================================================================
var SendQueryButton = React.createClass({
  displayName: "SendQueryButton",

  sendQuery: function sendQuery() {
    var jsonQuery = this.props.configuration.editor.getValue();
    console.log(jsonQuery);
    AnalyticsActions.sendQuery(jsonQuery);
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

// ============================================================================
var BottomActions = React.createClass({
  displayName: "BottomActions",

  render: function render(argument) {
    return React.createElement(
      "div",
      { className: "row" },
      React.createElement(SendQueryButton, { configuration: this.props.configuration })
    );
  }
});

// ============================================================================
var AnalyticsContainer = React.createClass({
  displayName: "AnalyticsContainer",

  mixins: [Reflux.connect(analyticsStore, "configuration")],

  componentDidUpdate: function componentDidUpdate() {
    this.init();
  },

  init: function init() {
    // semantic-ui
    $('.accordion').accordion({
      selector: {
        trigger: '.title .icon'
      }
    });

    //highlightjs
    $(document).ready(function () {
      $('pre code').each(function (i, block) {
        hljs.highlightBlock(block);
      });
    });
  },

  componentDidMount: function componentDidMount() {
    this.state.configuration.editor = CodeMirror.fromTextArea(document.getElementById('queryEditor'), {
      mode: "text/javascript",
      matchBrackets: true,
      lineNumbers: true,
      extraKeys: {
        "Ctrl-Enter": function CtrlEnter(cm) {
          AnalyticsActions.sendQuery(cm.getValue());
        }
      }
    });

    this.init();
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
      React.createElement(BottomActions, { configuration: this.state.configuration }),
      React.createElement(
        "div",
        { className: "row" },
        React.createElement(
          "div",
          { className: "column sixteen wide" },
          React.createElement(JsonPreview, { data: this.state.configuration.result })
        )
      )
    );
  }
});

// ============================================================================
React.render(React.createElement(AnalyticsContainer, null), document.getElementById('content'));