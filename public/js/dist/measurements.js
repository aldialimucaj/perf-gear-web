var MeasurementBox = React.createClass({displayName: "MeasurementBox",
  render: function() {
    return (
      React.createElement("div", {className: "measurementBox"}, 
        "Measurements go here"
      )
    );
  }
});
React.render(
  React.createElement(MeasurementBox, null),
  document.getElementById('content')
);
