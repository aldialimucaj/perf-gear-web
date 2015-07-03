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

var GraphKey = React.createClass({displayName: "GraphKey",
  render: function(){
    var keys = [];
    if(this.props.measurement) {
      var index = 0;
      keys = Object.keys(this.props.measurement).map(function(key){
        return(React.createElement("option", {key: index++}, key))
      });
    }

    return (
      React.createElement("div", null, this.props.axisTitle, 
      React.createElement("select", null, keys)
      )
    );
  }
});

var GraphConfiguration = React.createClass({displayName: "GraphConfiguration",
  buildGraph: function (argument) {
    pgUtils.buildTestGraph();
  },

  render: function() {
    return (
      React.createElement("div", {className: "graphConfiguration"}, 
        "GraphConfiguration", 
        React.createElement("div", null, 
        React.createElement(GraphKey, {measurement: this.props.data, axisTitle: "X Axis"}), 
        React.createElement(GraphKey, {measurement: this.props.data, axisTitle: "Y Axis"})
        ), 
        React.createElement("button", {onClick: this.buildGraph}, "TestGraph")
      )
    );
  }
});

var GraphPreview = React.createClass({displayName: "GraphPreview",
  render: function() {
    return (
      React.createElement("div", {className: "GraphPreview"}, 
        "GraphPreview"
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
        React.createElement(MeasurementPreview, {data: this.state.measurement}), 
        React.createElement(GraphConfiguration, {data: this.state.measurement}), 
        React.createElement(GraphPreview, {data: this.state.measurement})
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
