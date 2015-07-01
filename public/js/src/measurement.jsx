var pgUtils = new PGUtils();

var MeasurementPreview = React.createClass({
  render: function() {
    var preview = JSON.stringify(this.props.data, null, 2);
    return (
      <div className="measurementPreview">
        <pre>{preview}</pre>
      </div>
    );
  }

});

var MeasurementBox = React.createClass({
  getInitialState: function() {
    return {measurementId: 0};
  },

  componentDidMount: function() {
    var self = this;
    self.setState({measurementId: params.measurement.id});
    pgUtils.fetchOneMeasurementById(params.measurement.id, function (err, data) {
      self.setState({measurement: data});
    });
  },

  render: function() {
    return (
      <div className="measurementBox">
        Single Measurement {this.state.measurementId}
        <MeasurementPreview data={this.state.measurement} />
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
