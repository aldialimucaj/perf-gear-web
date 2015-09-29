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

var GraphPreview = React.createClass({
  displayName: "GraphPreview",

  render: function render() {
    return React.createElement(
      "div",
      { id: "chart-container", className: "ui segment pg-hidden" },
      React.createElement("div", { id: "chart" })
    );
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

React.render(React.createElement(MeasurementBox, null), document.getElementById('content'));
/*JSON.stringify(this.state)*/