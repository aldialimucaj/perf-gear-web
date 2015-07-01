var pgUtils = new PGUtils();

var MeasurementTablePagination = React.createClass({
  render: function() {
    return (
      <div className="measurementTablePagination">
        Pagination
      </div>
    );
  }
});

var MeasurementNode = React.createClass({
  render: function() {
    return (
      <tr>
        <td>{this.props.data.id}</td>
        <td>{this.props.data.path}</td>
      </tr>
    );
  }
});


var MeasurementTable = React.createClass({
  render: function() {
    if(this.props.data) {
      var measurementNodes = this.props.data.content.map(function (measurement) {
        return (
          <MeasurementNode key={measurement.id} data={measurement}/>
        );
      });
    }

    return (
      <div className="measurementTable">
        Measurement Table
        <table className="ui table">
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
    return {data: {content:[]}, skip: 0, limit: 0};
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
        Measurements go here
        <MeasurementTable data={this.state.data} skip={this.state.skip} limit={this.state.limit}/>
      </div>
    );
  }
});
React.render(

  <MeasurementBox url="/api/measurements"/>,
  document.getElementById('content')
);
