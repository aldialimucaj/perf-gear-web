var pgUtils = new PGUtils();

var MeasurementTablePagination = React.createClass({
  render: function() {
    return (
      <tfoot>
        <tr>
          <th colSpan="2">
          <div className="ui right floated pagination menu">
            <a className="icon item">
              <i className="left chevron icon"></i>
            </a>
            <a className="item">1</a>
            <a className="icon item">
              <i className="right chevron icon"></i>
            </a>
          </div>
          </th>
      </tr>
      </tfoot>
    );
  }
});

var MeasurementNode = React.createClass({
  render: function() {
    var shortId = this.props.data.id.substr(-5);
    var itemHref = "/measurements/"+this.props.data.id;
    return (
      <tr>
        <td><a href={itemHref}>{shortId}</a></td>
        <td>{this.props.data.path}</td>
      </tr>
    );
  }
});


var MeasurementTable = React.createClass({
  render: function() {
    if(this.props.data) {
      var measurementNodes = this.props.data.map(function (measurement) {
        return (
          <MeasurementNode key={measurement.id} data={measurement}/>
        );
      });
    }

    return (
      <div className="measurementTable">
        <table className="ui celled striped table">
          <thead>
            <tr>
              <th>#ID</th>
              <th>Path</th>
            </tr>
          </thead>
        <tbody>
          {measurementNodes}
        </tbody>
        </table>
        <MeasurementTablePagination />
      </div>
    );
  }
});


var MeasurementBox = React.createClass({
  getInitialState: function() {
    return {data: [], skip: 0, limit: 0};
  },

  componentDidMount: function() {
    var self = this;
    pgUtils.fetchMeasurements(0, 0, function (err, data) {
      self.setState({data: data, skip: self.state.skip, limit: self.state.limit});
    });
  },

  render: function() {
    return (
      <div className="measurementBox">
        <MeasurementTable data={this.state.data} skip={this.state.skip} limit={this.state.limit}/>
      </div>
    );
  }
});

// Render
React.render(
  <MeasurementBox url="/api/measurements"/>,
  document.getElementById('content')
);
