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

var GraphKey = React.createClass({

  getInitialState: function() {
    return {};
  },

  handleChange: function (arg) {
    MeasurementActions.selectAxis(this.props.keyId, this.props.optionId, arg.target.value)
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
  handleTypeChange: function(arg) {
    MeasurementActions.selectChart(this.props.keyId, arg.target.value);
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

  willBuildGraph: function() {
    // add class to set element height needed by echarts
    $('#chart').addClass('graph-content');
  },

  buildGraph: function (argument) {
    this.willBuildGraph();
    pgUtils.buildGraphFromSingle(this.props.data, this.state.options);
  },

  addElement: function (argument) {
    this.setState({graphElements: this.state.graphElements.concat({})})
  },

  getInitialState: function() {
    return {graphElements: [{keyId: 0}]};
  },

  render: function() {
    var measurement = this.props.data;
    var elements = this.state.graphElements.map(function (element, idx) {
      return (
        <div className="three fields" key={idx}>
          <GraphType keyId={idx} label="Presentation Form"/>
          <GraphKey measurement={measurement} keyId={idx} optionId="xAxis" label="X Axis"/>
          <GraphKey measurement={measurement} keyId={idx} optionId="yAxis" label="Y Axis"/>
        </div>
      );
    });

    return (
      <div className="graphConfiguration">
        <div className="ui form">
        {elements}
        <div className="field">
          <button className="tiny ui icon button circular" onClick={this.addElement}>
            <i className="icon plus"></i>
          </button>
        </div>
        <div className="field">
          <button className="ui primary button centered" onClick={this.buildGraph}>Build Graph</button>
        </div>
        </div>
      </div>
    );
  }
});

var GraphPreview = React.createClass({
  render: function() {
    return (
      <div id="chart" className="">

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
