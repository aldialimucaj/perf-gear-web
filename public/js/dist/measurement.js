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
        { className: "title" },
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
    MeasurementActions.selectAxis(this.props.keyId, this.props.optionId, arg.target.value);
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

  handleTypeChange: function handleTypeChange(arg) {
    MeasurementActions.selectChart(this.props.keyId, arg.target.value);
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

  willBuildGraph: function willBuildGraph() {
    // add class to set element height needed by echarts
    $("#chart").addClass("graph-content");
  },

  buildGraph: function buildGraph(argument) {
    this.willBuildGraph();
    pgUtils.buildGraphFromSingle(this.props.data, this.state.options);
  },

  addElement: function addElement(argument) {
    this.setState({ graphElements: this.state.graphElements.concat({}) });
  },

  getInitialState: function getInitialState() {
    return { graphElements: [{ keyId: 0 }] };
  },

  render: function render() {
    var measurement = this.props.data;
    var elements = this.state.graphElements.map(function (element, idx) {
      return React.createElement(
        "div",
        { className: "three fields", key: idx },
        React.createElement(GraphType, { keyId: idx, label: "Presentation Form" }),
        React.createElement(GraphKey, { measurement: measurement, keyId: idx, optionId: "xAxis", label: "X Axis" }),
        React.createElement(GraphKey, { measurement: measurement, keyId: idx, optionId: "yAxis", label: "Y Axis" })
      );
    });

    return React.createElement(
      "div",
      { className: "graphConfiguration" },
      React.createElement(
        "div",
        { className: "ui form" },
        elements,
        React.createElement(
          "div",
          { className: "field" },
          React.createElement(
            "button",
            { className: "tiny ui icon button circular", onClick: this.addElement },
            React.createElement("i", { className: "icon plus" })
          )
        ),
        React.createElement(
          "div",
          { className: "field" },
          React.createElement(
            "button",
            { className: "ui primary button centered", onClick: this.buildGraph },
            "Build Graph"
          )
        )
      )
    );
  }
});

var GraphPreview = React.createClass({
  displayName: "GraphPreview",

  render: function render() {
    return React.createElement("div", { id: "chart", className: "" });
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
      React.createElement(MeasurementPreview, { data: this.state.measurement, options: this.state.options }),
      React.createElement(GraphConfiguration, { data: this.state.measurement, options: this.state.options }),
      React.createElement(GraphPreview, { data: this.state.measurement, options: this.state.options })
    );
  }
});

function setMeasurementId(id) {
  MeasurementBox.setState({ measurementId: id });
}

React.render(React.createElement(MeasurementBox, null), document.getElementById("content"));
/*JSON.stringify(this.state)*/