"use strict";

var pgUtils = new PGUtils();

var MeasurementTablePagination = React.createClass({
  displayName: "MeasurementTablePagination",

  render: function render() {
    return React.createElement(
      "tfoot",
      null,
      React.createElement(
        "tr",
        null,
        React.createElement(
          "th",
          { colSpan: "2" },
          React.createElement(
            "div",
            { className: "ui right floated pagination menu" },
            React.createElement(
              "a",
              { className: "icon item" },
              React.createElement("i", { className: "left chevron icon" })
            ),
            React.createElement(
              "a",
              { className: "item" },
              "1"
            ),
            React.createElement(
              "a",
              { className: "icon item" },
              React.createElement("i", { className: "right chevron icon" })
            )
          )
        )
      )
    );
  }
});

var MeasurementNode = React.createClass({
  displayName: "MeasurementNode",

  render: function render() {
    var shortId = this.props.data.id.substr(-5);
    var itemHref = "/measurements/" + this.props.data.id;
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

var MeasurementTable = React.createClass({
  displayName: "MeasurementTable",

  render: function render() {
    if (this.props.data) {
      var measurementNodes = this.props.data.map(function (measurement) {
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
          measurementNodes
        )
      ),
      React.createElement(MeasurementTablePagination, null)
    );
  }
});

var MeasurementBox = React.createClass({
  displayName: "MeasurementBox",

  getInitialState: function getInitialState() {
    return { data: [], skip: 0, limit: 0 };
  },

  componentDidMount: function componentDidMount() {
    var self = this;
    pgUtils.fetchMeasurements(0, 0, function (err, data) {
      self.setState({ data: data, skip: self.state.skip, limit: self.state.limit });
    });
  },

  render: function render() {
    return React.createElement(
      "div",
      { className: "measurementBox" },
      React.createElement(MeasurementTable, { data: this.state.data, skip: this.state.skip, limit: this.state.limit })
    );
  }
});

// Render
React.render(React.createElement(MeasurementBox, { url: "/api/measurements" }), document.getElementById("content"));