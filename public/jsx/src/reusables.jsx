var JsonPreview = React.createClass({
  render: function() {
    var preview = this.props.data ? JSON.stringify(this.props.data, null, 2) : "#empty";
    return (
      <div className="ui styled accordion full-width">
        <div className="title">
          <i className="dropdown icon"></i>
          JSON content
        </div>
        <div className="active content">
          <pre><code className="json">{preview}</code></pre>
        </div>
      </div>
    );
  }
});