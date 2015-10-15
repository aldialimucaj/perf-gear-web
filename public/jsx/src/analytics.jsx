var pgUtils = new PGUtils();

// ============================================================================
var QueryEditor = React.createClass({
  handleChange: function(event) {
    console.log("queryJson changed");
  },
  
  render : function (argument) {
    return (<div className="row">
      <div className="column sixteen wide">
        <textarea id="queryEditor" value='m.group("path");' onChange={this.handleChange}></textarea>
        </div>
      </div>)
  }
});

// ============================================================================
var SendQueryButton = React.createClass({
  sendQuery: function() {
    let jsonQuery = this.props.configuration.editor.getValue();
    console.log(jsonQuery);
    AnalyticsActions.sendQuery(jsonQuery);
  },

  render: function(argument) {
    return (<div className="right aligned column"><button onClick={this.sendQuery} className="ui olive button">Query</button></div>);
  }
});

// ============================================================================
var BottomActions = React.createClass({
  render: function(argument) {
    return (<div className="row"><SendQueryButton configuration={this.props.configuration}/></div>);
  }
});

// ============================================================================
var AnalyticsContainer = React.createClass({
  mixins: [Reflux.connect(analyticsStore,"configuration")],
  
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
  
  componentDidMount: function() {
    this.state.configuration.editor = CodeMirror.fromTextArea(document.getElementById('queryEditor'), {
      mode:  "text/javascript",
      matchBrackets: true,
      lineNumbers: true,
      theme: "neo",
      extraKeys: {
        "Ctrl-Enter" : function(cm){ AnalyticsActions.sendQuery(cm.getValue());}
      }
    });
    
    this.state.configuration.editor.setSize('100%', 'auto')
    
    this.init();
  },
    
  render : function (argument) {
    return (<div className="ui grid">
      <div className="pg-block-center">
        <h3>Analytics Container</h3>
      </div>
      <QueryEditor/>
      <BottomActions configuration={this.state.configuration}/>
      <div className="row">
        <div className="column sixteen wide">
        <div className="content">
          <GraphConfiguration data={this.state.configuration.mockMeasurement} results={this.state.configuration.result} plotFunc={"buildGraphFromMultiple"} />
          <GraphPreview />
        </div>
        </div>
      </div>
      <div className="row">
        <div className="column sixteen wide">
          <JsonPreview data={this.state.configuration.result}/>
        </div>
      </div>
    </div>);
  }
});

// ============================================================================
React.render(
  <AnalyticsContainer />,
  document.getElementById('content')
);
