var pgUtils = new PGUtils();

// ============================================================================
var QueryEditor = React.createClass({
  handleChange: function(event) {
    console.log("queryJson changed");
  },
  
  render : function (argument) {
    return (<div className="row">
      <div className="column sixteen wide">
        <textarea id="queryEditor" value='m.count();' onChange={this.handleChange}></textarea>
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
      extraKeys: {
        "Ctrl-Enter" : function(cm){ AnalyticsActions.sendQuery(cm.getValue());}
      }
    });
    
    this.init();
  },
    
  render : function (argument) {
    return (<div className="ui grid">
      <h2>AnalyticsContainer</h2>
      <QueryEditor/>
      <BottomActions configuration={this.state.configuration}/>
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
