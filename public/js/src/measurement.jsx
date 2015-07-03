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
        <label>{this.props.label}</label>
        <select className="ui select dropdown">
          <option></option>
          {keys}
        </select>
      </div>
    );
  }
});

var GraphType = React.createClass({
  render: function(){
    var types = ['bar'];
    var index = 0;
    var _selectTypes = types.map(function(type){
      return(<option key={index++}>{type}</option>)
    });

    return (
      <div className="field">
        <label>{this.props.label}</label>
        <select className="ui select dropdown">{_selectTypes}</select>
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
        <div className="ui form">
          <div className="three fields">
            <GraphType label="Graph Type"/>
            <GraphKey measurement={this.props.data} label="X Axis"/>
            <GraphKey measurement={this.props.data} label="Y Axis"/>
          </div>
        <button className="ui primary button centered" onClick={this.buildGraph}>Build Graph</button>
        </div>
      </div>
    );
  }
});

var GraphPreview = React.createClass({
  render: function() {
    return (
      <div className="GraphPreview">

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
        <GraphConfiguration data={this.state.measurement} />
        <GraphPreview data={this.state.measurement} />
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
