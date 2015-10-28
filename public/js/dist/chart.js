"use strict";

var pgUtils = new PGUtils();

// ============================================================================
var ChartBox = React.createClass({
  displayName: "ChartBox",

  getInitialState: function getInitialState() {
    return { chartId: 0 };
  },

  componentDidMount: function componentDidMount() {
    var self = this;
    self.setState({ chartId: params.id });
    pgUtils.fetchChartOptionsById(params.id, localStorage.current, function (err, data) {
      self.setState({ graphTypes: data.graphTypes, options: data.options });
    });

    this.init();
  },
  componentDidUpdate: function componentDidUpdate() {
    if (this.state.graphTypes && this.state.options) {
      pgUtils.buildGraph(this.state.graphTypes, this.state.options);
    }
  },

  init: function init() {},

  render: function render() {
    return React.createElement(
      "div",
      { className: "chartBox" },
      React.createElement(GraphPreview, null)
    );
  }
});

function setMeasurementId(id) {
  ChartBox.setState({ chartId: id });
}

// ============================================================================
React.render(React.createElement(ChartBox, null), document.getElementById('content'));