var pgUtils = new PGUtils();

// ============================================================================
var MeasurementBox = React.createClass({
  mixins: [Reflux.connect(measurementStore,"options")],

  getInitialState: function() {
    return {measurementId: 0};
  },

  componentDidMount: function() {
    var self = this;
    self.setState({measurementId: params.id});
    pgUtils.fetchOneMeasurementById(params.id, function (err, data) {
      self.setState({measurement: data});
    });

    this.init();
  },
  componentDidUpdate: function() {
    this.init();
  },

  init: function() {
    // semantic-ui
    $('.accordion')
    .accordion({
      selector: {
        trigger: '.title .icon'
      }
    });

    //highlightjs
    $(document).ready(function() {
    $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
      });
    });
  },

  render: function() {
    return (
      <div className="measurementBox">
        <JsonPreview data={this.state.measurement} options={this.state.options}/>
        <GraphConfiguration data={this.state.measurement} options={this.state.options} />
        <GraphPreview />
      </div>
    );
  }
});

function setMeasurementId(id) {
  MeasurementBox.setState({measurementId: id})
}

// ============================================================================
React.render(
  <MeasurementBox />,
  document.getElementById('content')
);
