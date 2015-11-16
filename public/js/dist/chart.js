
// ============================================================================
'use strict';

var ChartBox = React.createClass({
  displayName: 'ChartBox',

  graphUtils: new GraphUtils(),

  getInitialState: function getInitialState() {
    return { chartId: 0 };
  },

  componentDidMount: function componentDidMount() {
    var self = this;
    self.setState({ chartId: params.id });
    // fetch graph options ready for plot
    netUtils.fetchChartOptionsById(params.id, localStorage.current, function (err, data) {
      self.setState({ graphTypes: data.graphTypes, options: data.options });
    });

    this.init();
  },

  plot: function plot(graphTypes, options, element) {
    var chartHolder = document.getElementById(element) || document.getElementById('chart');
    var chartType = ['echarts'].concat(graphTypes);

    // checking options
    if (!options.legend) options.legend = {
      data: ['#Add legend']
    };

    console.log(JSON.stringify(options));

    require(chartType, function (ec) {
      // Initialize after dom ready
      var myChart = ec.init(chartHolder);

      // Load data into the ECharts instance
      myChart.setOption(options);
    });
  },

  buildGraph: function buildGraph(argument) {
    $('#chart-container').removeClass('pg-hidden');
    if (this.state.graphTypes && this.state.options) {
      var config = this.plot(this.state.graphTypes, this.state.options);
    }
  },

  componentDidUpdate: function componentDidUpdate() {
    if (this.state.graphTypes && this.state.options) {
      $('#chart-container').removeClass('pg-hidden');
      $('#chart').addClass('graph-content');
      this.buildGraph(this.state.graphTypes, this.state.options);
    }
  },

  init: function init() {},

  render: function render() {
    return React.createElement(
      'div',
      { className: 'chartBox' },
      React.createElement(GraphPreview, null)
    );
  }
});

function setMeasurementId(id) {
  ChartBox.setState({ chartId: id });
}

// ============================================================================
React.render(React.createElement(ChartBox, null), document.getElementById('content'));