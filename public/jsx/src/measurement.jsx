var netUtils = new NetUtils();

// ============================================================================
var MeasurementBox = React.createClass({
  mixins: [Reflux.connect(measurementStore,"options"), Reflux.connect(collectionStore,"collection")],

  getInitialState: function() {
    return {measurementId: 0};
  },

  componentDidMount: function() {
    var self = this;
    self.setState({measurementId: params.id});
    netUtils.fetchOneMeasurementById(this.state.collection.current, params.id, function (err, data) {
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
        <GraphConfiguration data={this.state.measurement} plotFunc={"buildGraphFromSingle"} />
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
