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
    return {data: {content:[]}};
  },

  componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function() {
    return (
      <div className="measurementBox">
        Measurements go here
        <MeasurementTable data={this.state.data}/>
      </div>
    );
  }
});
React.render(

  <MeasurementBox url="/api/measurements"/>,
  document.getElementById('content')
);
