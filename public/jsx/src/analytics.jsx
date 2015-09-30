var pgUtils = new PGUtils();

var QueryEditor = React.createClass({
  render : function (argument) {
    return (<div className="row"><div className="column sixteen wide" id="queryEditor"></div></div>)
  }
});

var SendQueryButton = React.createClass({
  sendQuery: function() {
    let queryResults = pgUtils.sendAnalyticsQuery();
    console.log(queryResults);
  },

  render: function(argument) {
    return (<div className="right aligned column"><button onClick={this.sendQuery} className="ui olive button">Query</button></div>);
  }
});


var BottomActions = React.createClass({
  render: function(argument) {
    return (<div className="row"><SendQueryButton/></div>);
  }
});

var AnalyticsContainer = React.createClass({
  mixins: [Reflux.connect(analyticsStore,"configuration")],
  
  componentDidMount: function() {
    var myCodeMirror = CodeMirror(document.getElementById('queryEditor'), {
      value: "{\n  $groupBy: ''\n}",
      mode:  "application/json",
      json: true,
      matchBrackets: true,
      lineNumbers: true
    });
  },
    
  render : function (argument) {
    return (<div className="ui grid">
      <h2>AnalyticsContainer</h2>
      <QueryEditor/>
      <BottomActions/>
    </div>);
  }
});

React.render(
  <AnalyticsContainer />,
  document.getElementById('content')
);
