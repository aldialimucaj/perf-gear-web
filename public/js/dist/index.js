"use strict";

var MainBox = React.createClass({
  displayName: "MainBox",

  render: function render() {
    return React.createElement(
      "div",
      { className: "mainBox" },
      "Measurements go here"
    );
  }
});
React.render(React.createElement(MainBox, null), document.getElementById('content'));