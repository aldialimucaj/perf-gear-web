var QueryEditor = React.createClass({
  render : function (argument) {
    return (<div id="queryEditor"></div>)
  }
});

var AnalyricsContainer = React.createClass({
  componentDidMount: function() {
    var myCodeMirror = CodeMirror(document.getElementById('queryEditor'), {
      value: "{\n  $groupBy: ''\n}",
      mode:  "javascript",
      json: true,
      lineNumbers: true
    });
  },
    
  render : function (argument) {
    return (<div>
      <h2>AnalyricsContainer</h2>
      <QueryEditor/>
    </div>);
  }
});

React.render(
  <AnalyricsContainer />,
  document.getElementById('content')
);
