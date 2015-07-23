var pgUtils = new PGUtils();

var MeasurementPreview = React.createClass({
  render: function() {
    var preview = JSON.stringify(this.props.data, null, 2);
    return (
      <div className="ui styled accordion full-width">
        <div className="title">
          <i className="dropdown icon"></i>
          JSON content
        </div>
        <div className="content">
          <pre><code className="json">{preview}</code></pre>
        </div>
      </div>
    );
  }
});


var GraphPreview = React.createClass({
  render: function() {
    return (
        <div id="chart-container" className="ui segment pg-hidden">
          <div id="chart"></div>
        </div>
    );
  }
});


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
        <MeasurementPreview data={this.state.measurement} options={this.state.options}/>
        <GraphConfiguration data={this.state.measurement} options={this.state.options} />
        <GraphPreview data={this.state.measurement} options={this.state.options}/>
         {/*JSON.stringify(this.state)*/}
      </div>
    );
  }
});

function setMeasurementId(id) {
  MeasurementBox.setState({measurementId: id})
}

React.render(
  <MeasurementBox />,
  document.getElementById('content')
);
