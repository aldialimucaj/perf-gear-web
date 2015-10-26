var MainBox = React.createClass({
  render: function() {
    return (
      <div className="mainBox">
        Measurements go here
      </div>
    );
  }
});
React.render(
  <MainBox />,
  document.getElementById('content')
);
