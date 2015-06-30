var MeasurementTablePagination = React.createClass({displayName: "MeasurementTablePagination",
  render: function() {
    return (
      React.createElement("div", {className: "measurementTablePagination"}, 
        "Pagination"
      )
    );
  }
});

var MeasurementNode = React.createClass({displayName: "MeasurementNode",
  render: function() {
    return (
      React.createElement("tr", null, 
        React.createElement("td", null, this.props.data.id), 
        React.createElement("td", null, this.props.data.path)
      )
    );
  }
});


var MeasurementTable = React.createClass({displayName: "MeasurementTable",
  render: function() {
    if(this.props.data) {
      var measurementNodes = this.props.data.content.map(function (measurement) {
        return (
          React.createElement(MeasurementNode, {key: measurement.id, data: measurement})
        );
      });
    }

    return (
      React.createElement("div", {className: "measurementTable"}, 
        "Measurement Table", 
        React.createElement("table", {className: "ui table"}, 
        React.createElement("tbody", null, 
          measurementNodes
        )
        ), 
        React.createElement(MeasurementTablePagination, null)
      )
    );
  }
});


var MeasurementBox = React.createClass({displayName: "MeasurementBox",
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
      React.createElement("div", {className: "measurementBox"}, 
        "Measurements go here", 
        React.createElement(MeasurementTable, {data: this.state.data})
      )
    );
  }
});
React.render(

  React.createElement(MeasurementBox, {url: "/api/measurements"}),
  document.getElementById('content')
);
