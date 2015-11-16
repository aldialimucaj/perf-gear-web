"use strict";

var netUtils = new NetUtils();

// ============================================================================
var QueryEditor = React.createClass({
  displayName: "QueryEditor",

  handleChange: function handleChange(event) {
    console.log("queryJson changed");
  },

  render: function render(argument) {
    return React.createElement(
      "div",
      { className: "field" },
      React.createElement("textarea", { id: "queryEditor", name: "queryEditor", value: "m.group(\"path\").limit(10);", onChange: this.handleChange })
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
      { className: "field" },
      React.createElement(
        "button",
        { type: "button", onClick: this.sendQuery, className: "ui olive button" },
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
      { className: "field pg-center" },
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
      theme: "neo",
      extraKeys: {
        "Ctrl-Enter": function CtrlEnter(cm) {
          AnalyticsActions.sendQuery(cm.getValue());
        }
      }
    });

    this.state.configuration.editor.on('keyup', function (cm) {
      AnalyticsActions.updateAnalyticsQuery(cm.getValue());
      $('#queryEditor').val(cm.getValue());
    });

    this.state.configuration.editor.setSize('100%', 'auto');

    // set the initial value to chart configuration
    AnalyticsActions.updateAnalyticsQuery(this.state.configuration.editor.getValue());
    // also set the value to the underlying textarea in order for form validation to be able to check it
    $('#queryEditor').val(this.state.configuration.editor.getValue());

    this.init();

    this.initFormValidation();
  },

  initFormValidation: function initFormValidation() {
    $('#query-from').form({
      fields: {
        queryEditor: {
          identifier: 'queryEditor',
          rules: [{
            type: 'empty',
            prompt: 'Please enter a query.'
          }]
        }
      }
    });
  },

  render: function render(argument) {
    return React.createElement(
      "div",
      { className: "ui grid" },
      React.createElement(
        "div",
        { className: "centered row" },
        React.createElement(
          "div",
          { className: "right floated right aligned sixteen wide column" },
          React.createElement(GraphPersistence, { type: "analytics" })
        )
      ),
      React.createElement(
        "div",
        { className: "row" },
        React.createElement(
          "div",
          { className: "sixteen column" },
          React.createElement(
            "form",
            { id: "query-from", className: "ui form" },
            React.createElement(QueryEditor, null),
            React.createElement("div", { className: "ui error message" }),
            React.createElement(BottomActions, { configuration: this.state.configuration })
          )
        )
      ),
      React.createElement(
        "div",
        { className: "row" },
        React.createElement(
          "div",
          { className: "column sixteen wide" },
          React.createElement(
            "div",
            { className: "content" },
            React.createElement(GraphConfiguration, { data: this.state.configuration.mockMeasurement, results: this.state.configuration.result, plotFunc: "buildGraphFromMultiple" }),
            React.createElement(GraphPreview, null)
          )
        )
      ),
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