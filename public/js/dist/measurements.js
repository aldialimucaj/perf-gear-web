'use strict';

var pgUtils = new PGUtils();

var PaginationItem = React.createClass({
  displayName: 'PaginationItem',

  handlePageChange: function handlePageChange(e) {
    var pageIdx = Math.abs(e.currentTarget.text);
    MeasurementsActions.setPage(pageIdx);
  },

  render: function render() {
    var classes = ['item'];
    if (this.props.measurements.page == this.props.index) {
      classes.push('active');
    }
    return React.createElement(
      'a',
      { className: classes.join(' '), onClick: this.handlePageChange },
      this.props.index
    );
  }
});

var MeasurementTablePagination = React.createClass({
  displayName: 'MeasurementTablePagination',

  mixins: [Reflux.connect(measurementsStore, "measurements")],
  paginationItems: [],
  maxPaginationSide: 5,

  handlePrevPageChange: function handlePrevPageChange() {
    var page = --this.state.measurements.page;
    page = page > 0 ? page : 1;
    MeasurementsActions.setPage(page);
  },

  handleNextPageChange: function handleNextPageChange() {
    var page = ++this.state.measurements.page;
    page = page > this.state.measurements.pages ? this.state.measurements.pages : page;
    MeasurementsActions.setPage(page);
  },

  createPageIndexes: function createPageIndexes() {
    var items = [];
    var pages = this.state.measurements.pages;
    var current = this.state.measurements.page <= pages ? this.state.measurements.page : pages;

    var leftLowBound = current > 1 ? current - 1 : current;
    var leftUpBound = this.maxPaginationSide + current - 1;
    leftUpBound = leftUpBound <= pages ? leftUpBound : pages;

    var rightLowBound = pages - this.maxPaginationSide + current;
    var rightUpBound = pages;

    if (pages <= this.maxPaginationSide * 2) {
      for (var i = 1; i <= pages; i++) {
        items.push(React.createElement(PaginationItem, { measurements: this.state.measurements, key: i, index: i }));
      }
    } else {
      for (var i = leftLowBound; i <= leftUpBound; i++) {
        items.push(React.createElement(PaginationItem, { measurements: this.state.measurements, key: i, index: i }));
      }

      items.push(React.createElement(
        'a',
        { key: 'none', className: 'disabled item' },
        '...'
      ));

      for (var i = rightLowBound; i <= rightUpBound; i++) {
        items.push(React.createElement(PaginationItem, { measurements: this.state.measurements, key: i, index: i }));
      }
    }

    return items;
  },

  render: function render() {
    this.paginationItems = this.createPageIndexes();

    return React.createElement(
      'tfoot',
      null,
      React.createElement(
        'tr',
        null,
        React.createElement(
          'th',
          { colSpan: '2' },
          React.createElement(
            'div',
            { className: 'ui right floated pagination menu' },
            React.createElement(
              'a',
              { className: 'icon item' },
              React.createElement('i', { className: 'left chevron icon', onClick: this.handlePrevPageChange })
            ),
            this.paginationItems,
            React.createElement(
              'a',
              { className: 'icon item' },
              React.createElement('i', { className: 'right chevron icon', onClick: this.handleNextPageChange })
            )
          )
        )
      )
    );
  }
});

var MeasurementNode = React.createClass({
  displayName: 'MeasurementNode',

  mixins: [Reflux.connect(collectionStore, "collection")],

  render: function render() {
    var shortId = this.props.data.id.substr(-7);
    var itemHref = "/measurements/" + this.state.collection.current + "/" + this.props.data.id;
    return React.createElement(
      'tr',
      null,
      React.createElement(
        'td',
        null,
        React.createElement(
          'a',
          { href: itemHref },
          shortId
        )
      ),
      React.createElement(
        'td',
        null,
        this.props.data.path
      )
    );
  }
});

var MeasurementTable = React.createClass({
  displayName: 'MeasurementTable',

  mixins: [Reflux.connect(measurementsStore, "measurements")],
  measurementNodes: [],

  render: function render() {
    if (this.state.measurements.data) {
      this.measurementNodes = this.state.measurements.data.map(function (measurement) {
        return React.createElement(MeasurementNode, { key: measurement.id, data: measurement });
      });
    }

    return React.createElement(
      'div',
      { className: 'measurementTable' },
      React.createElement(
        'table',
        { className: 'ui celled striped table' },
        React.createElement(
          'thead',
          null,
          React.createElement(
            'tr',
            null,
            React.createElement(
              'th',
              null,
              '#ID'
            ),
            React.createElement(
              'th',
              null,
              'Path'
            )
          )
        ),
        React.createElement(
          'tbody',
          null,
          this.measurementNodes
        )
      ),
      React.createElement(MeasurementTablePagination, null)
    );
  }
});

var MeasurementBox = React.createClass({
  displayName: 'MeasurementBox',

  mixins: [Reflux.connect(collectionStore, "collection"), Reflux.connect(measurementsStore, "measurements")],

  componentDidMount: function componentDidMount() {
    MeasurementsActions.getMeasurements(this.state.collection.current, 0, this.state.measurements.limit);
    MeasurementsActions.getMeasurementsCount(this.state.collection.current);
  },

  render: function render() {
    return React.createElement(
      'div',
      { className: 'measurementBox' },
      React.createElement(MeasurementTable, null)
    );
  }
});

// Render
React.render(React.createElement(MeasurementBox, null), document.getElementById('content'));