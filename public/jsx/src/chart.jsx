
// ============================================================================
var ChartBox = React.createClass({
  graphUtils: new GraphUtils(),
  
  getInitialState: function() {
    return {chartId: 0};
  },

  componentDidMount: function() {
    var self = this;
    self.setState({chartId: params.id});
    pgUtils.fetchChartOptionsById(params.id, localStorage.current, function (err, data) {
      self.setState({graphTypes: data.graphTypes, options: data.options});
    });

    this.init();
  },
  
  componentDidUpdate: function() {
    if(this.state.graphTypes && this.state.options) {
      $('#chart-container').removeClass('pg-hidden');
      $('#chart').addClass('graph-content');
      this.graphUtils.buildGraph(this.state.graphTypes, this.state.options);
    }
  },

  init: function() {

  },

  render: function() {
    return (
      <div className="chartBox">
        <GraphPreview />
      </div>
    );
  }
});

function setMeasurementId(id) {
  ChartBox.setState({chartId: id})
}

// ============================================================================
React.render(
  <ChartBox />,
  document.getElementById('content')
);
