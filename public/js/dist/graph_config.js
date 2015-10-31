'use strict';

var GraphType = React.createClass({
  displayName: 'GraphType',

  render: function render() {
    var classes = ['ui', 'label'];
    var labelColor;
    switch (this.props.arg.type) {
      case 'bar':
        classes.push('olive');
        break;
      case 'line':
        classes.push('orange');
        break;
      case 'seq':
        classes.push('violet');
        break;
      default:
        classes.push('black');
    }

    return React.createElement(
      'div',
      { className: 'ui field two wide' },
      React.createElement(
        'label',
        null,
        this.props.label
      ),
      React.createElement(
        'div',
        { className: classes.join(' ') },
        this.props.arg.type.toUpperFirst()
      )
    );
  }
});

// ============================================================================
var GraphKey = React.createClass({
  displayName: 'GraphKey',

  getInitialState: function getInitialState() {
    return {};
  },

  handleChange: function handleChange(arg, id) {
    MeasurementActions.selectAxis(this.props.keyId, this.props.optionId, arg);
  },

  componentDidMount: function componentDidMount(argument) {
    var self = this;
    setTimeout(function () {
      self.init();
    }, 500);
  },

  init: function init(argument) {
    var self = this;
    var id = this.props.optionId + this.props.keyId;
    $('#' + id + '.ui.dropdown.axis').dropdown({
      onChange: function onChange(text, value) {
        self.handleChange(value, self.props.optionId);
      }
    });
  },

  render: function render() {
    var self = this;
    var keys = [];
    if (this.props.measurement) {
      var keyList = pgUtils.getAxisItems(self.props.type, self.props.optionId, this.props.measurement);
      var index = 0;
      keys = keyList.map(function (key) {
        return React.createElement(
          'option',
          { value: key, key: index++ },
          key
        );
      });
    }

    return React.createElement(
      'div',
      { className: 'field' },
      React.createElement(
        'label',
        null,
        this.props.label
      ),
      React.createElement(
        'select',
        { name: 'dropdown', id: this.props.optionId + this.props.keyId, className: 'ui select dropdown axis' },
        React.createElement('option', null),
        keys
      )
    );
  }
});

// ============================================================================
var GraphLabel = React.createClass({
  displayName: 'GraphLabel',

  handleChange: function handleChange(arg) {
    MeasurementActions.editLabel(this.props.keyId, this.props.optionId, arg.target.value);
  },

  render: function render() {
    return React.createElement(
      'div',
      { className: 'field' },
      React.createElement(
        'label',
        null,
        this.props.label
      ),
      React.createElement('input', { name: 'graphLabel', onChange: this.handleChange })
    );
  }
});

// ============================================================================
var GraphConfiguration = React.createClass({
  displayName: 'GraphConfiguration',

  mixins: [Reflux.connect(measurementStore, "keyList")],

  willBuildGraph: function willBuildGraph() {
    // add class to set element height needed by echarts
    $('#chart').addClass('graph-content');
  },

  buildGraph: function buildGraph(argument) {
    $('#chart-container').removeClass('pg-hidden');
    this.willBuildGraph();
    var results = this.props.results ? this.props.results : this.props.data;

    var config = pgUtils[this.props.plotFunc](results, this.state.keyList);

    if ($('#graph-config-form').form('validate form')) {
      pgUtils.buildGraph(config.graphTypes, config.options);
    }
  },

  addElement: function addElement(argument) {
    this.setState({ graphElements: this.state.graphElements.concat(argument) });
    MeasurementActions.selectChart(this.state.graphElements.length - 1, argument.type);
  },

  getInitialState: function getInitialState() {
    return { graphElements: [] };
  },

  componentDidMount: function componentDidMount(argument) {
    var self = this;
    setTimeout(function () {
      self.init();
    }, 500);
  },

  componentDidUpdate: function componentDidUpdate(argument) {
    this.initFormValidation();
  },

  init: function init(argument) {
    var self = this;
    var dropdown = $('.ui.dropdown.adder').dropdown({
      action: function action(text, value) {
        self.addElement({ type: value });
        dropdown.dropdown("hide");
      }
    });

    this.initFormValidation();
  },

  getGraphElement: function getGraphElement(measurement, argument, idx) {
    switch (argument.type) {
      case 'bar':
      case 'line':
        {
          return React.createElement(
            'div',
            { className: 'three fields', key: idx },
            React.createElement(GraphType, { keyId: idx, arg: argument, label: 'Presentation' }),
            React.createElement(GraphKey, { measurement: measurement, type: argument.type, keyId: idx, optionId: 'xAxis', label: 'X Axis' }),
            React.createElement(GraphKey, { measurement: measurement, type: argument.type, keyId: idx, optionId: 'yAxis', label: 'Y Axis' }),
            React.createElement(GraphLabel, { keyId: idx, optionId: 'name', label: 'Label' })
          );
        }
      case 'seq':
        {
          return React.createElement(
            'div',
            { className: 'three fields', key: idx },
            React.createElement(GraphType, { keyId: idx, arg: argument, label: 'Presentation' }),
            React.createElement(GraphKey, { measurement: measurement, type: argument.type, keyId: idx, optionId: 'yAxis', label: 'Value Axis' }),
            React.createElement(GraphLabel, { keyId: idx, optionId: 'name', label: 'Label' })
          );
        }
      default:
        console.error("No graph type!");
        return React.createElement(
          'div',
          null,
          'Error'
        );
    }
  },

  initFormValidation: function initFormValidation() {
    var fields = {};
    var fieldTemplate = {
      identifier: null,
      rules: [{
        type: 'empty',
        prompt: 'Field cannot be empty'
      }]
    };

    var elements = $('#graph-config-form').find("[id*='Axis']");
    elements.each(function (i, el) {
      var newField = _.clone(fieldTemplate, true);
      newField.identifier = el.id;
      fields[el.id] = newField;
    });
    // add dummy validation for no selection
    if (elements.length == 0) {
      var newField = _.clone(fieldTemplate, true);
      newField.identifier = 'dummy';
      newField.rules[0].prompt = 'You have to add a data selection row in order to draw a graph.';
      fields.dummy = newField;
    }

    $('#graph-config-form').form({
      fields: fields
    });
  },

  render: function render() {
    var self = this;
    var measurement = this.props.data;
    var elements = this.state.graphElements.map(function (element, idx) {
      return self.getGraphElement(measurement, element, idx);
    });

    var seqClasses = ["item"];

    // analytics dont get sequences
    if (this.props.plotFunc === "buildGraphFromMultiple") {
      seqClasses.push("pg-hidden");
    }

    return React.createElement(
      'div',
      { className: 'graphConfiguration' },
      React.createElement(
        'form',
        { id: 'graph-config-form', className: 'ui form' },
        elements,
        React.createElement(
          'div',
          { className: 'field' },
          React.createElement(
            'div',
            { className: 'ui circular black left pointing dropdown icon button adder' },
            React.createElement('i', { className: 'icon plus' }),
            React.createElement(
              'div',
              { className: 'menu' },
              React.createElement(
                'div',
                { className: 'item', 'data-value': 'bar' },
                'Bar'
              ),
              React.createElement(
                'div',
                { className: 'item', 'data-value': 'line' },
                'Line'
              ),
              React.createElement(
                'div',
                { className: seqClasses.join(" "), 'data-value': 'seq' },
                'Sequence'
              )
            )
          )
        ),
        React.createElement('input', { type: 'hidden', name: 'dummy' }),
        React.createElement('div', { className: 'ui error message' }),
        React.createElement(
          'div',
          { className: 'field pg-center' },
          React.createElement(
            'button',
            { className: 'ui primary button', type: 'button', onClick: this.buildGraph },
            'Build Graph'
          )
        )
      )
    );
  }
});

// ============================================================================
var GraphPreview = React.createClass({
  displayName: 'GraphPreview',

  render: function render() {
    return React.createElement(
      'div',
      { id: 'chart-container', className: 'ui segment pg-hidden' },
      React.createElement('div', { id: 'chart' })
    );
  }
});

// ============================================================================
var GraphPersistence = React.createClass({
  displayName: 'GraphPersistence',

  mixins: [Reflux.connect(persistenceStore, "chart")],

  componentDidMount: function componentDidMount() {
    this.init();
  },

  toggleContainer: function toggleContainer() {
    $('#persistence-container').toggleClass('pg-hidden');
    $('#btnToggleContainer').toggleClass('pg-hidden');
    $('#iPersistenceTitle').focus();
  },

  init: function init() {
    var self = this;
    // ESC
    $('#persistence-container').keyup(function (e) {
      if (e.keyCode == 27) {
        self.toggleContainer();
      }
    });

    // CLTR + S
    $('#persistence-container').keydown(function (e) {
      if (e.keyCode == 83 && e.ctrlKey) {
        if (self.preCommit()) {
          PersistenceActions.saveChart();
        }
        e.preventDefault();
      }
    });

    // CLTR + S for Document
    // show persistence container if invisible
    $(document).keydown(function (e) {
      if (e.keyCode == 83 && e.ctrlKey && !$('#btnToggleContainer').hasClass('pg-hidden')) {
        self.toggleContainer();
        e.preventDefault();
      } else if (e.keyCode == 83 && e.ctrlKey && $('#btnToggleContainer').hasClass('pg-hidden')) {
        if (self.preCommit()) {
          PersistenceActions.saveChart();
        }
        e.preventDefault();
      }
    });

    // every key should update
    $('#persistence-container').keyup(function (e) {
      self.state.chart.title = $('#iPersistenceTitle').val();
      self.state.chart.type = self.props.type;
      PersistenceActions.updatePersistenceConfig(self.state.chart);
    });

    this.initFormValidation();
  },

  initFormValidation: function initFormValidation() {
    $('#persistence-form').form({
      fields: {
        iPersistenceTitle: {
          identifier: 'iPersistenceTitle',
          rules: [{
            type: 'empty',
            prompt: 'Please enter a title. It will apear on the charts header'
          }]
        }
      }
    });
  },

  /**
  * Necessary checks before commiting to server.
  */
  preCommit: function preCommit() {
    var result = true;

    result &= $('#persistence-form').form('validate form');
    result &= $('#graph-config-form').form('validate form');
    result &= $('#query-from').form('validate form');

    return result;
  },

  render: function render() {
    return React.createElement(
      'div',
      { className: 'ui' },
      React.createElement(
        'div',
        { className: 'ui small basic icon buttons' },
        React.createElement(
          'button',
          { id: 'btnToggleContainer', className: 'ui button', onClick: this.toggleContainer },
          React.createElement('i', { className: 'save icon' })
        )
      ),
      React.createElement(
        'div',
        { id: 'persistence-container', className: 'ui vertical segment pg-hidden' },
        React.createElement(
          'form',
          { id: 'persistence-form', className: 'ui form' },
          React.createElement(
            'div',
            { className: 'field' },
            React.createElement('input', { id: 'iPersistenceTitle', name: 'iPersistenceTitle', type: 'text', placeholder: 'Title' })
          ),
          React.createElement('div', { className: 'ui error message' })
        )
      )
    );
  }
});