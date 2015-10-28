"use strict";

var pgUtils = new PGUtils();

var ChartNode = React.createClass({
  displayName: "ChartNode",

  mixins: [Reflux.connect(collectionStore, "collection")],

  render: function render() {
    var shortId = this.props.data.id.substr(-7);
    var itemHref = "/charts/" + this.state.collection.current + "/" + this.props.data.id;
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
        this.props.data.title
      ),
      React.createElement(
        "td",
        null,
        this.props.data.query
      )
    );
  }
});

var ChartsTable = React.createClass({
  displayName: "ChartsTable",

  mixins: [Reflux.connect(chartsStore, "charts")],
  chartNodes: [],

  render: function render() {
    if (this.state.charts.data) {
      this.chartNodes = this.state.charts.data.map(function (chart) {
        return React.createElement(ChartNode, { key: chart.id, data: chart });
      });
    }

    return React.createElement(
      "div",
      { className: "chartsTable" },
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
              "Title"
            ),
            React.createElement(
              "th",
              null,
              "Query"
            )
          )
        ),
        React.createElement(
          "tbody",
          null,
          this.chartNodes
        )
      ),
      React.createElement(TablePagination, { actionStore: ChartsActions, config: this.state.charts })
    );
  }
});

var ChartsBox = React.createClass({
  displayName: "ChartsBox",

  mixins: [Reflux.connect(collectionStore, "collection"), Reflux.connect(chartsStore, "charts")],

  componentDidMount: function componentDidMount() {
    ChartsActions.getCharts(this.state.collection.current, 0, this.state.charts.limit);
    ChartsActions.getChartsCount(this.state.collection.current);
  },

  render: function render() {
    return React.createElement(
      "div",
      { className: "ChartsBox" },
      React.createElement(ChartsTable, null)
    );
  }
});

// Render
React.render(React.createElement(ChartsBox, null), document.getElementById('content'));