var pgUtils = new PGUtils();

// ============================================================================
var ChartNode = React.createClass({
  mixins: [Reflux.connect(collectionStore,"collection")],
  
  render: function() {
    let shortId = this.props.data.id.substr(-7);
    let itemHref = "/charts/"+this.state.collection.current+"/"+this.props.data.id;
    return (
      <tr>
        <td><a href={itemHref}>{shortId}</a></td>
        <td>{this.props.data.title}</td>
        <td>{this.props.data.query}</td>
      </tr>
    );
  }
});

// ============================================================================
var ChartsTable = React.createClass({
  mixins: [Reflux.connect(chartsStore,"charts")],
  chartNodes: [],
  
  render: function() {
    if(this.state.charts.data) {
      this.chartNodes = this.state.charts.data.map(function (chart) {
        return (
          <ChartNode key={chart.id} data={chart}/>
        );
      });
    }

    return (
      <div className="chartsTable">
        <table className="ui celled striped table">
          <thead>
            <tr>
              <th>#ID</th>
              <th>Title</th>
              <th>Query</th>
            </tr>
          </thead>
        <tbody>
          {this.chartNodes}
        </tbody>
        </table>
        <TablePagination actionStore={ChartsActions} config={this.state.charts} />
      </div>
    );
  }
});

// ============================================================================
var ChartsBox = React.createClass({
  mixins: [Reflux.connect(collectionStore,"collection"), Reflux.connect(chartsStore,"charts")],

  componentDidMount: function() {
    ChartsActions.getCharts(this.state.collection.current, 0, this.state.charts.limit);
    ChartsActions.getChartsCount(this.state.collection.current);
  },

  render: function() {
    return (
      <div className="ChartsBox">
        <ChartsTable />
      </div>
    );
  }
});

// Render
React.render(
  <ChartsBox />,
  document.getElementById('content')
);
