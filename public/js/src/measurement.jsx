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

var GraphKey = React.createClass({
  render: function(){
    var keys = [];
    if(this.props.measurement) {
      var index = 0;
      keys = Object.keys(this.props.measurement).map(function(key){
        return(<option key={index++}>{key}</option>)
      });
    }

    return (
      <div className="field">
        <label>{this.props.axisTitle}</label>
        <select className="ui select dropdown">{keys}</select>
      </div>
    );
  }
});

var GraphConfiguration = React.createClass({
  buildGraph: function (argument) {
    pgUtils.buildTestGraph();
  },

  render: function() {
    return (
      <div className="graphConfiguration">
        GraphConfiguration
        <div className="ui form">
          <div className="two fields">
            <GraphKey measurement={this.props.data} axisTitle="X Axis"/>
            <GraphKey measurement={this.props.data} axisTitle="Y Axis"/>
          </div>
        </div>
        <button onClick={this.buildGraph}>TestGraph</button>
      </div>
    );
  }
});

var GraphPreview = React.createClass({
  render: function() {
    return (
      <div className="GraphPreview">
        GraphPreview
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
        <GraphConfiguration data={this.state.measurement} />
        <GraphPreview data={this.state.measurement} />
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
