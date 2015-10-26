var GraphType = React.createClass({
  render: function(){
    var classes = ['ui', 'label'];
    var labelColor;
    switch (this.props.arg.type) {
      case 'bar':
        classes.push('olive');
        break;
      case 'line':
        classes.push('orange');
          break;
      case 'seq':
        classes.push('violet');
          break;
      default:
        classes.push('black');
    }

    return (
      <div className="ui field two wide">
        <label>{this.props.label}</label>
        <div className={classes.join(' ')}>{this.props.arg.type.toUpperFirst()}</div>
      </div>
    );
  }
});

var GraphKey = React.createClass({

  getInitialState: function() {
    return {};
  },

  handleChange: function (arg, id) {
    MeasurementActions.selectAxis(this.props.keyId, this.props.optionId, arg)
  },

  componentDidMount: function (argument) {
    var self = this;
    setTimeout(function(){
      self.init();
    }, 500);
  },

  init: function (argument) {
    var self = this;
    var id = this.props.optionId + this.props.keyId;
    $('#'+id+'.ui.dropdown.axis')
    .dropdown({
      onChange: function(text, value) {
        self.handleChange(value, self.props.optionId);
      }
    });
  },

  render: function(){
    var self = this;
    var keys = [];
    if(this.props.measurement) {
      var keyList = pgUtils.getAxisItems(self.props.type, self.props.optionId, this.props.measurement);
      var index = 0;
      keys = keyList.map(function(key) {
        return(<option value={key} key={index++}>{key}</option>)
      });
    }

    return (
      <div className="field">
        <label>{this.props.label}</label>
        <select id={this.props.optionId + this.props.keyId} className="ui select dropdown axis">
          <option></option>
          {keys}
        </select>
      </div>
    );
  }
});

var GraphLabel = React.createClass({
  handleChange: function (arg) {
    MeasurementActions.editLabel(this.props.keyId, this.props.optionId, arg.target.value)
  },

  render: function(){
    return (
      <div className="field">
        <label>{this.props.label}</label>
        <input name="graphLabel" onChange={this.handleChange}/>
      </div>
    );
  }
});

var GraphConfiguration = React.createClass({
  mixins: [Reflux.connect(measurementStore,"keyList")],

  willBuildGraph: function() {
    // add class to set element height needed by echarts
    $('#chart').addClass('graph-content');
  },

  buildGraph: function (argument) {
    $('#chart-container').removeClass('pg-hidden');
    this.willBuildGraph();
    var results = this.props.results? this.props.results:this.props.data;
    
    var config = pgUtils[this.props.plotFunc](results, this.state.keyList);
    pgUtils.buildGraph(config.graphTypes, config. options);
  },

  addElement: function (argument) {
    this.setState({graphElements: this.state.graphElements.concat(argument)})
    MeasurementActions.selectChart(this.state.graphElements.length - 1, argument.type);
  },

  getInitialState: function() {
    return {graphElements: []};
  },

  componentDidMount: function (argument) {
    var self = this;
    setTimeout(function(){
      self.init();
    }, 500);
  },

  init: function (argument) {
    var self = this;
    var dropdown = $('.ui.dropdown.adder')
    .dropdown({
      action: function(text, value) {
        self.addElement({type: value});
        dropdown.dropdown("hide");
      }
    });
  },

  getGraphElement: function (measurement, argument, idx) {
    switch(argument.type) {
      case 'bar':
      case 'line': {
        return (
          <div className="three fields" key={idx}>
            <GraphType keyId={idx} arg={argument} label="Presentation"/>
            <GraphKey measurement={measurement} type={argument.type} keyId={idx} optionId="xAxis" label="X Axis"/>
            <GraphKey measurement={measurement} type={argument.type} keyId={idx} optionId="yAxis" label="Y Axis"/>
            <GraphLabel keyId={idx} optionId="name" label="Label"/>
          </div>
        );
      }
      case 'seq': {
        return (
          <div className="three fields" key={idx}>
            <GraphType keyId={idx} arg={argument} label="Presentation"/>
            <GraphKey measurement={measurement} type={argument.type} keyId={idx} optionId="yAxis" label="Value Axis"/>
            <GraphLabel keyId={idx} optionId="name" label="Label"/>
          </div>
        );
      }
      default:
        console.error("No graph type!");
        return (<div>Error</div>);
    }
  },

  render: function() {
    var self = this;
    var measurement = this.props.data;
    var elements = this.state.graphElements.map(function (element, idx) {
      return self.getGraphElement(measurement, element, idx);
    });
    
    var seqClasses = ["item"];
    
    // analytics dont get sequences
    if(this.props.plotFunc === "buildGraphFromMultiple") {
      seqClasses.push("pg-hidden");
    }
    
    return (
      <div className="graphConfiguration">
        <div className="ui form">
        {elements}
        <div className="field">
          <div className="ui circular black left pointing dropdown icon button adder">
            <i className="icon plus"></i>
            <div className="menu">
              <div className="item" data-value="bar">
                  Bar
              </div>
              <div className="item" data-value="line">
                  Line
              </div>
              <div className={seqClasses.join(" ")}  data-value="seq">
                  Sequence
              </div>
            </div>
          </div>
        </div>

        <div className="field pg-center">
          <button className="ui primary button" onClick={this.buildGraph}>Build Graph</button>
        </div>
        </div>
      </div>
    );
  }
});

// ============================================================================
var GraphPreview = React.createClass({
  render: function() {
    return (
        <div id="chart-container" className="ui segment pg-hidden">
          <div id="chart"></div>
        </div>
    );
  }
});
