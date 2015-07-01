var pgUtils = new PGUtils();

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
    var itemHref = "/measurements/"+this.props.data.id;
    return (
      React.createElement("tr", null, 
        React.createElement("td", null, React.createElement("a", {href: itemHref}, this.props.data.id)), 
        React.createElement("td", null, this.props.data.path)
      )
    );
  }
});


var MeasurementTable = React.createClass({displayName: "MeasurementTable",
  render: function() {
    if(this.props.data) {
      var measurementNodes = this.props.data.map(function (measurement) {
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
      React.createElement("div", {className: "measurementBox"}, 
        "Measurements go here", 
        React.createElement(MeasurementTable, {data: this.state.data, skip: this.state.skip, limit: this.state.limit})
      )
    );
  }
});

// Render
React.render(
  React.createElement(MeasurementBox, {url: "/api/measurements"}),
  document.getElementById('content')
);
