var MeasurementBox = React.createClass({
  render: function() {
    return (
      <div className="measurementBox">
        Measurements go here
      </div>
    );
  }
});
React.render(
  <MeasurementBox />,
  document.getElementById('content')
);
