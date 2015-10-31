var pgUtils = new PGUtils();

// ============================================================================
var QueryEditor = React.createClass({
  handleChange: function(event) {
    console.log("queryJson changed");
  },
  
  render : function (argument) {
    return (<div className="field">
      
        <textarea id="queryEditor" name="queryEditor" value='m.group("path").limit(10);' onChange={this.handleChange}></textarea>
        
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
    return (<div className="field"><button type="button" onClick={this.sendQuery} className="ui olive button">Query</button></div>);
  }
});

// ============================================================================
var BottomActions = React.createClass({
  render: function(argument) {
    return (<div className="field pg-center"><SendQueryButton configuration={this.props.configuration}/></div>);
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
    
    this.state.configuration.editor.on('keyup',function(cm){ 
      AnalyticsActions.updateAnalyticsQuery(cm.getValue());
      $('#queryEditor').val(cm.getValue())
    });
    
    this.state.configuration.editor.setSize('100%', 'auto')
    
    // set the initial value to chart configuration
    AnalyticsActions.updateAnalyticsQuery(this.state.configuration.editor.getValue());
    // also set the value to the underlying textarea in order for form validation to be able to check it
    $('#queryEditor').val(this.state.configuration.editor.getValue())
    
    this.init();
    
    this.initFormValidation();
  },
  
  initFormValidation: function() {
   $('#query-from').form({
    fields: {
      queryEditor : { 
        identifier: 'queryEditor',
        rules: [{
          type: 'empty',
          prompt: 'Please enter a query.'
        }]
      }
    }
   });
  },
    
  render : function (argument) {
    return (<div className="ui grid">
      <div className="centered row">
          <div className="right floated right aligned sixteen wide column">
            <GraphPersistence type="analytics"/>
          </div>
      </div>
      <div className="row">
        <div className="sixteen column">
          <form id="query-from" className="ui form">
            <QueryEditor/>
            <div className="ui error message"></div>
            <BottomActions configuration={this.state.configuration}/>
          </form>
        </div>
      </div>
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
