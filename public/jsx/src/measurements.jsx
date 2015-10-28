var pgUtils = new PGUtils();

var MeasurementNode = React.createClass({
  mixins: [Reflux.connect(collectionStore,"collection")],
  
  render: function() {
    let shortId = this.props.data.id.substr(-7);
    let itemHref = "/measurements/"+this.state.collection.current+"/"+this.props.data.id;
    return (
      <tr>
        <td><a href={itemHref}>{shortId}</a></td>
        <td>{this.props.data.path}</td>
      </tr>
    );
  }
});


var MeasurementTable = React.createClass({
  mixins: [Reflux.connect(measurementsStore,"measurements")],
  measurementNodes: [],
  
  render: function() {
    if(this.state.measurements.data) {
      this.measurementNodes = this.state.measurements.data.map(function (measurement) {
        return (
          <MeasurementNode  key={measurement.id} data={measurement}/>
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
          {this.measurementNodes}
        </tbody>
        </table>
        <TablePagination  actionStore={MeasurementsActions}  config={this.state.measurements} />
      </div>
    );
  }
});


var MeasurementBox = React.createClass({
  mixins: [Reflux.connect(collectionStore,"collection"), Reflux.connect(measurementsStore,"measurements")],

  componentDidMount: function() {
    MeasurementsActions.getMeasurements(this.state.collection.current, 0, this.state.measurements.limit);
    MeasurementsActions.getMeasurementsCount(this.state.collection.current);
  },

  render: function() {
    return (
      <div className="measurementBox">
        <MeasurementTable />
      </div>
    );
  }
});

// Render
React.render(
  <MeasurementBox />,
  document.getElementById('content')
);
