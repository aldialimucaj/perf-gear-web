var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        Hello, world! I am a CommentBox and i need to go now.
      </div>
    );
  }
});
React.render(
  <CommentBox />,
  document.getElementById('content')
);
