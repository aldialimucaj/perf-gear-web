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

  getInitialState: function() {
    return {};
  },

  handleChange: function (arg) {
    MeasurementActions.selectAxis(this.props.optionId, arg.target.value)
  },

  render: function(){
    var keys = [];
    if(this.props.measurement) {
      var index = 0;
      keys = Object.keys(this.props.measurement).map(function(key){
        return(<option value={key} key={index++}>{key}</option>)
      });
    }

    return (
      <div className="field">
        <label>{this.props.label}</label>
        <select onChange={this.handleChange} className="ui select dropdown">
          <option></option>
          {keys}
        </select>
      </div>
    );
  }
});

var GraphType = React.createClass({

  getInitialState: function() {
    return {graphType: null};
  },

  handleTypeChange: function(arg) {
    MeasurementActions.selectChart(arg.target.value);
  },

  render: function(){
    var types = ['bar', 'line'];
    var index = 0;
    var _selectTypes = types.map(function(type){
      return (<option value={type} key={index++}>{type}</option>)
    });

    return (
      <div className="field">
        <label>{this.props.label}</label>
        <select className="ui select dropdown" onChange={this.handleTypeChange}>
          <option></option>
          {_selectTypes}
        </select>
      </div>
    );
  }
});

var GraphConfiguration = React.createClass({
  mixins: [Reflux.connect(measurementStore,"options")],

  buildGraph: function (argument) {
    pgUtils.buildGraphFromSingle(this.props.data, this.state.options);
  },

  render: function() {
    return (
      <div className="graphConfiguration">
        <div className="ui form">
          <div className="three fields">
            <GraphType label="Graph Type"/>
            <GraphKey measurement={this.props.data} optionId="xAxis" label="X Axis"/>
            <GraphKey measurement={this.props.data} optionId="yAxis" label="Y Axis"/>
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
  },

  render: function() {
    return (
      <div className="measurementBox">
        <GraphConfiguration data={this.state.measurement} options={this.state.options} />
        <GraphPreview data={this.state.measurement} options={this.state.options}/>
        <MeasurementPreview data={this.state.measurement} options={this.state.options}/>
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
