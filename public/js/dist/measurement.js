"use strict";

var pgUtils = new PGUtils();

var MeasurementPreview = React.createClass({
  displayName: "MeasurementPreview",

  render: function render() {
    var preview = JSON.stringify(this.props.data, null, 2);
    return React.createElement(
      "div",
      { className: "ui styled accordion full-width" },
      React.createElement(
        "div",
        { className: "active title" },
        React.createElement("i", { className: "dropdown icon" }),
        "JSON content"
      ),
      React.createElement(
        "div",
        { className: "content" },
        React.createElement(
          "pre",
          null,
          React.createElement(
            "code",
            { className: "json" },
            preview
          )
        )
      )
    );
  }
});

var GraphKey = React.createClass({
  displayName: "GraphKey",

  getInitialState: function getInitialState() {
    return {};
  },

  handleChange: function handleChange(arg) {
    MeasurementActions.selectAxis(this.props.optionId, arg.target.value);
  },

  render: function render() {
    var keys = [];
    if (this.props.measurement) {
      var index = 0;
      keys = Object.keys(this.props.measurement).map(function (key) {
        return React.createElement(
          "option",
          { value: key, key: index++ },
          key
        );
      });
    }

    return React.createElement(
      "div",
      { className: "field" },
      React.createElement(
        "label",
        null,
        this.props.label
      ),
      React.createElement(
        "select",
        { onChange: this.handleChange, className: "ui select dropdown" },
        React.createElement("option", null),
        keys
      )
    );
  }
});

var GraphType = React.createClass({
  displayName: "GraphType",

  getInitialState: function getInitialState() {
    return { graphType: null };
  },

  handleTypeChange: function handleTypeChange(arg) {
    MeasurementActions.selectChart(arg.target.value);
  },

  render: function render() {
    var types = ["bar", "line"];
    var index = 0;
    var _selectTypes = types.map(function (type) {
      return React.createElement(
        "option",
        { value: type, key: index++ },
        type
      );
    });

    return React.createElement(
      "div",
      { className: "field" },
      React.createElement(
        "label",
        null,
        this.props.label
      ),
      React.createElement(
        "select",
        { className: "ui select dropdown", onChange: this.handleTypeChange },
        React.createElement("option", null),
        _selectTypes
      )
    );
  }
});

var GraphConfiguration = React.createClass({
  displayName: "GraphConfiguration",

  mixins: [Reflux.connect(measurementStore, "options")],

  buildGraph: function buildGraph(argument) {
    pgUtils.buildGraphFromSingle(this.props.data, this.state.options);
  },

  render: function render() {
    return React.createElement(
      "div",
      { className: "graphConfiguration" },
      React.createElement(
        "div",
        { className: "ui form" },
        React.createElement(
          "div",
          { className: "three fields" },
          React.createElement(GraphType, { label: "Graph Type" }),
          React.createElement(GraphKey, { measurement: this.props.data, optionId: "xAxis", label: "X Axis" }),
          React.createElement(GraphKey, { measurement: this.props.data, optionId: "yAxis", label: "Y Axis" })
        ),
        React.createElement(
          "button",
          { className: "ui primary button centered", onClick: this.buildGraph },
          "Build Graph"
        )
      )
    );
  }
});

var GraphPreview = React.createClass({
  displayName: "GraphPreview",

  render: function render() {
    return React.createElement("div", { id: "chart", className: "graph-content" });
  }
});

var MeasurementBox = React.createClass({
  displayName: "MeasurementBox",

  mixins: [Reflux.connect(measurementStore, "options")],

  getInitialState: function getInitialState() {
    return { measurementId: 0 };
  },

  componentDidMount: function componentDidMount() {
    var self = this;
    self.setState({ measurementId: params.id });
    pgUtils.fetchOneMeasurementById(params.id, function (err, data) {
      self.setState({ measurement: data });
    });

    this.init();
  },
  componentDidUpdate: function componentDidUpdate() {
    this.init();
  },

  init: function init() {
    // semantic-ui
    $(".accordion").accordion({
      selector: {
        trigger: ".title .icon"
      }
    });

    //highlightjs
    $(document).ready(function () {
      $("pre code").each(function (i, block) {
        hljs.highlightBlock(block);
      });
    });
  },

  render: function render() {
    return React.createElement(
      "div",
      { className: "measurementBox" },
      React.createElement(GraphConfiguration, { data: this.state.measurement, options: this.state.options }),
      React.createElement(GraphPreview, { data: this.state.measurement, options: this.state.options }),
      React.createElement(MeasurementPreview, { data: this.state.measurement, options: this.state.options })
    );
  }
});

function setMeasurementId(id) {
  MeasurementBox.setState({ measurementId: id });
}

React.render(React.createElement(MeasurementBox, null), document.getElementById("content"));
/*JSON.stringify(this.state)*/