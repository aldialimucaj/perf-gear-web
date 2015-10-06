"use strict";

var JsonPreview = React.createClass({
  displayName: "JsonPreview",

  render: function render() {
    var preview = this.props.data ? JSON.stringify(this.props.data, null, 2) : "#empty";
    return React.createElement(
      "div",
      { className: "ui styled accordion full-width" },
      React.createElement(
        "div",
        { className: "title" },
        React.createElement("i", { className: "dropdown icon" }),
        "JSON content"
      ),
      React.createElement(
        "div",
        { className: "active content" },
        React.createElement(
          "pre",
          null,
          React.createElement(
            "code",
            { className: "json" },
            preview
          )
        )
      )
    );
  }
});