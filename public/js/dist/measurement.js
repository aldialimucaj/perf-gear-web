"use strict";

var pgUtils = new PGUtils();

// ============================================================================
var MeasurementBox = React.createClass({
  displayName: "MeasurementBox",

  mixins: [Reflux.connect(measurementStore, "options"), Reflux.connect(collectionStore, "collection")],

  getInitialState: function getInitialState() {
    return { measurementId: 0 };
  },

  componentDidMount: function componentDidMount() {
    var self = this;
    self.setState({ measurementId: params.id });
    pgUtils.fetchOneMeasurementById(this.state.collection.currentCollection, params.id, function (err, data) {
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
      React.createElement(JsonPreview, { data: this.state.measurement, options: this.state.options }),
      React.createElement(GraphConfiguration, { data: this.state.measurement, plotFunc: "buildGraphFromSingle" }),
      React.createElement(GraphPreview, null)
    );
  }
});

function setMeasurementId(id) {
  MeasurementBox.setState({ measurementId: id });
}

// ============================================================================
React.render(React.createElement(MeasurementBox, null), document.getElementById('content'));