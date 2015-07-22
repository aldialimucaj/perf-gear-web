'use strict';

var AnalyricsContainer = React.createClass({
  displayName: 'AnalyricsContainer',

  render: function render(argument) {
    return React.createElement(
      'div',
      null,
      'AnalyricsContainer'
    );
  }
});

React.render(React.createElement(AnalyricsContainer, null), document.getElementById('content'));