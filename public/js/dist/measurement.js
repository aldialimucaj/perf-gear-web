var pgUtils = new PGUtils();

var MeasurementPreview = React.createClass({displayName: "MeasurementPreview",
  render: function() {
    var preview = JSON.stringify(this.props.data, null, 2);
    return (
      React.createElement("div", {className: "measurementPreview"}, 
        React.createElement("pre", null, preview)
      )
    );
  }

});

var MeasurementBox = React.createClass({displayName: "MeasurementBox",
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
      React.createElement("div", {className: "measurementBox"}, 
        "Single Measurement ", this.state.measurementId, 
        React.createElement(MeasurementPreview, {data: this.state.measurement})
      )
    );
  }
});

function setMeasurementId(id) {
  MeasurementBox.setState({measurementId: id})
}

React.render(
  React.createElement(MeasurementBox, null),
  document.getElementById('content')
);
