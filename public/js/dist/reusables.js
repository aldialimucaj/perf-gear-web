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

// ============================================================================
var PaginationItem = React.createClass({
  displayName: "PaginationItem",

  handlePageChange: function handlePageChange(e) {
    var pageIdx = Math.abs(e.currentTarget.text);
    this.props.actionStore.setPage(pageIdx);
  },

  render: function render() {
    var classes = ['item'];
    if (this.props.charts.page == this.props.index) {
      classes.push('active');
    }
    return React.createElement(
      "a",
      { className: classes.join(' '), onClick: this.handlePageChange },
      this.props.index
    );
  }
});

// ============================================================================
var TablePagination = React.createClass({
  displayName: "TablePagination",

  paginationItems: [],
  maxPaginationSide: 5,

  handlePrevPageChange: function handlePrevPageChange() {
    var page = --this.props.config.page;
    page = page > 0 ? page : 1;
    ChartsActions.setPage(page);
  },

  handleNextPageChange: function handleNextPageChange() {
    var page = ++this.props.config.page;
    page = page > this.props.config.pages ? this.props.config.pages : page;
    ChartsActions.setPage(page);
  },

  createPageIndexes: function createPageIndexes() {
    var items = [];
    var pages = this.props.config.pages;
    var current = this.props.config.page <= pages ? this.props.config.page : pages;

    var leftLowBound = current > 1 ? current - 1 : current;
    var leftUpBound = this.maxPaginationSide + current - 1;
    leftUpBound = leftUpBound <= pages ? leftUpBound : pages;

    var rightLowBound = pages - this.maxPaginationSide + current;
    var rightUpBound = pages;

    if (pages <= this.maxPaginationSide * 2) {
      for (var i = 1; i <= pages; i++) {
        items.push(React.createElement(PaginationItem, { actionStore: this.props.actionStore, charts: this.props.config, key: i, index: i }));
      }
    } else {
      for (var i = leftLowBound; i <= leftUpBound; i++) {
        items.push(React.createElement(PaginationItem, { actionStore: this.props.actionStore, charts: this.props.config, key: i, index: i }));
      }

      items.push(React.createElement(
        "a",
        { key: "none", className: "disabled item" },
        "..."
      ));

      for (var i = rightLowBound; i <= rightUpBound; i++) {
        items.push(React.createElement(PaginationItem, { actionStore: this.props.actionStore, charts: this.props.config, key: i, index: i }));
      }
    }

    return items;
  },

  render: function render() {
    this.paginationItems = this.createPageIndexes();

    return React.createElement(
      "tfoot",
      null,
      React.createElement(
        "tr",
        null,
        React.createElement(
          "th",
          { colSpan: "2" },
          React.createElement(
            "div",
            { className: "ui right floated pagination menu" },
            React.createElement(
              "a",
              { className: "icon item" },
              React.createElement("i", { className: "left chevron icon", onClick: this.handlePrevPageChange })
            ),
            this.paginationItems,
            React.createElement(
              "a",
              { className: "icon item" },
              React.createElement("i", { className: "right chevron icon", onClick: this.handleNextPageChange })
            )
          )
        )
      )
    );
  }
});