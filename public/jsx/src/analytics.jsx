var pgUtils = new PGUtils();

var QueryEditor = React.createClass({
  handleChange: function(event) {
    console.log("queryJson changed");
  },
  
  render : function (argument) {
    return (<div className="row">
      <div className="column sixteen wide">
        <textarea id="queryEditor" value="{ groupBy: '' }" onChange={this.handleChange}></textarea>
        </div>
      </div>)
  }
});

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


var BottomActions = React.createClass({
  render: function(argument) {
    return (<div className="row"><SendQueryButton configuration={this.props.configuration}/></div>);
  }
});

var AnalyticsContainer = React.createClass({
  mixins: [Reflux.connect(analyticsStore,"configuration")],
  
  componentDidMount: function() {
    this.state.configuration.editor = CodeMirror.fromTextArea(document.getElementById('queryEditor'), {
      mode:  "application/json",
      json: true,
      matchBrackets: true,
      lineNumbers: true,
      extraKeys: {
        "Ctrl-Enter" : function(cm){ AnalyticsActions.sendQuery(cm.getValue());}
      }
    });
  },
    
  render : function (argument) {
    return (<div className="ui grid">
      <h2>AnalyticsContainer</h2>
      <QueryEditor/>
      <BottomActions configuration={this.state.configuration}/>
    </div>);
  }
});

React.render(
  <AnalyticsContainer />,
  document.getElementById('content')
);
