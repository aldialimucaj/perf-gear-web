"use strict";

var netUtils = new NetUtils();

// ============================================================================
var MeasurementNode = React.createClass({
  displayName: "MeasurementNode",

  mixins: [Reflux.connect(collectionStore, "collection")],

  render: function render() {
    var shortId = this.props.data.id.substr(-7);
    var itemHref = "/measurements/" + this.state.collection.current + "/" + this.props.data.id;
    return React.createElement(
      "tr",
      null,
      React.createElement(
        "td",
        null,
        React.createElement(
          "a",
          { href: itemHref },
          shortId
        )
      ),
      React.createElement(
        "td",
        null,
        this.props.data.path
      )
    );
  }
});

// ============================================================================
var MeasurementTable = React.createClass({
  displayName: "MeasurementTable",

  mixins: [Reflux.connect(measurementsStore, "measurements")],
  measurementNodes: [],

  render: function render() {
    if (this.state.measurements.data) {
      this.measurementNodes = this.state.measurements.data.map(function (measurement) {
        return React.createElement(MeasurementNode, { key: measurement.id, data: measurement });
      });
    }

    return React.createElement(
      "div",
      { className: "measurementTable" },
      React.createElement(
        "table",
        { className: "ui celled striped table" },
        React.createElement(
          "thead",
          null,
          React.createElement(
            "tr",
            null,
            React.createElement(
              "th",
              null,
              "#ID"
            ),
            React.createElement(
              "th",
              null,
              "Path"
            )
          )
        ),
        React.createElement(
          "tbody",
          null,
          this.measurementNodes
        )
      ),
      React.createElement(TablePagination, { actionStore: MeasurementsActions, config: this.state.measurements })
    );
  }
});

// ============================================================================
var MeasurementBox = React.createClass({
  displayName: "MeasurementBox",

  mixins: [Reflux.connect(collectionStore, "collection"), Reflux.connect(measurementsStore, "measurements")],

  componentDidMount: function componentDidMount() {
    MeasurementsActions.getMeasurements(this.state.collection.current, 0, this.state.measurements.limit);
    MeasurementsActions.getMeasurementsCount(this.state.collection.current);
  },

  render: function render() {
    return React.createElement(
      "div",
      { className: "measurementBox" },
      React.createElement(MeasurementTable, null)
    );
  }
});

// Render
React.render(React.createElement(MeasurementBox, null), document.getElementById('content'));