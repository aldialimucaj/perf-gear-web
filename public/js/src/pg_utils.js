// pg_utils.js
/* @flow */
function PGUtils() {
  // constructor
}

/** Fetch data from database
 *
 */
PGUtils.prototype.fetchMeasurements = function (skip, limit, cb) {
  if (!cb) cb = limit;
  if (!cb) cb = skip;

  $.ajax({
    url: '/api/measurements',
    dataType: 'json',
    cache: false,
    success: function (data) {
      this._dataCheckAndReturn(data, cb);
    }.bind(this),
    error: function (xhr, status, err) {
      console.error(this.props.url, status, err.toString());
    }.bind(this)
  });
};


/** Fetch one measurement by id
 *
 */
PGUtils.prototype.fetchOneMeasurementById = function (id, cb) {
  if (!cb) cb = limit;
  if (!cb) cb = skip;

  $.ajax({
    url: '/api/measurements/' + id,
    dataType: 'json',
    cache: false,
    success: function (data) {
      this._dataCheckAndReturn(data, cb);
    }.bind(this),
    error: function (xhr, status, err) {
      console.error(this.props.url, status, err.toString());
    }.bind(this)
  });
};

/** Check data if valid and errors.
 * private
 */
PGUtils.prototype._dataCheckAndReturn = function (data, cb) {
  if (data && data.ok) {
    cb(null, data.content);
  } else if (data) {
    cb(data.err, null);
  } else {
    cb({
      msg: "unknown error"
    }, null);
  }
};

/**
* Get relevant items to be selected for axis.
*/
PGUtils.prototype.getAxisItems = function (type, optionId, mObject, prefix) {
  var self = this;
  var keys = Object.keys(mObject).map(function (key) {
    if (_.isPlainObject(mObject[key])) {
      return self.getAxisItems(type, optionId, mObject[key], key);
    }
    // filtering for known types
    switch (type) {
      case 'bar':
        if (optionId === "yAxis" && !$.isNumeric(mObject[key])) return null;
        if (Array.isArray(mObject[key])) return null;
        break;
      case 'seq':
        if (!Array.isArray(mObject[key])) return null;
        break;
    }

    return prefix ? prefix + '.' + key : key;
  });

  return _.flattenDeep(keys);
}

/* ************************************************************************* */

/** Build graph
 *
 */
PGUtils.prototype.buildGraph = function (graphTypes, options, element) {
  var chartHolder = document.getElementById(element) || document.getElementById('chart');
  var chartType = ['echarts'].concat(graphTypes);

  // checking options
  if (!options.legend) options.legend = {
    data: ['#Add legend']
  };

  console.log(JSON.stringify(options));

  require(chartType,
    function (ec) {
      // Initialize after dom ready
      var myChart = ec.init(chartHolder);

      // Load data into the ECharts instance
      myChart.setOption(options);
    }
    );

};

/** Generate Graph Options from a single measurement
 *
 */
PGUtils.prototype.buildOptionsFromSingle = function (measurement, selection) {
  var options = {};
  options.tooltip = {
    show: true
  };
  // add legend
  options.xAxis = [{
    type: 'category', // TODO: need to find out data type!!!
    data: [_.get(measurement, selection.xAxis)] //read data from measurement[props.xAxis]. If sequence special case
  }];

  options.yAxis = [{
    type: 'value', // TODO: need to find out data type!!!
  }];

  options.series = [{
    "name": selection.name || selection.yAxis,
    "type": selection.type,
    "data": [_.get(measurement, selection.yAxis)]
  }]

  return options;
};


PGUtils.prototype.buildOptionsFromSingleRAM = function (measurement, selection) {
  var options = {};

  options.legend = { data: [] };

  options.tooltip = {
    show: true
  };

  options.yAxis = [{
    type: 'value',
  }];

  options.legend.data.push(selection.yAxis.toUpperFirst());
  var data = [];
  var temp = measurement.sequence[0].timestamp;
  var ramData = measurement.sequence.map(function (seq) {
    var xLabel = seq.tag ? (seq.tag + ' (at ' + (seq.timestamp - temp) + 'µs)') : 'at ' + (seq.timestamp - temp) + 'µs'
    data.push(xLabel);// TODO: change ms to dynamic value
    return seq.value
  });

  options.series = [{
    "name": selection.yAxis.toUpperFirst(),
    "type": 'line',
    "stack": 'true',
    "itemStyle": {
      "normal": {
        "label": {
          "show": true,
          "position": 'insideRight'
        }
      }
    },
    "data": ramData,
    "markLine": {
      "data": [{
        "type": 'average',
        "name": 'Average'
      }]
    }
  }];

  // add x-axis
  options.xAxis = [{
    type: 'category',
    data: data
  }];


  return options;
};

PGUtils.prototype.buildOptionsFromSingleTimestamp = function (measurement, selection) {
  var options = {};

  options.legend = {};

  options.tooltip = {
    show: true
  };

  options.xAxis = [{
    type: 'value'
  }];

  options.legend.data = [];
  var temp = measurement.sequence[0].timestamp;
  options.series = measurement.sequence.map(function (seq) {
    var tstamp = seq.timestamp - temp;
    temp = seq.timestamp;
    options.legend.data.push(seq.tag);
    return {
      "name": seq.tag,
      "type": 'bar',
      "stack": 'true',
      "barMaxWidth": 25,
      "itemStyle": {
        "normal": {
          "label": {
            "show": true,
            "position": 'insideRight'
          }
        }
      },
      "data": [tstamp]
    }
  });

  // add y-axis
  options.yAxis = [{
    type: 'category',
    data: [selection.yAxis]
  }];


  return options;
};

/** Builds options for sequence charts
*/
PGUtils.prototype.buildOptionsFromSingleSeq = function (measurement, selection) {
  switch (measurement.type) {
    case "TIME": // timestamp
      return this.buildOptionsFromSingleTimestamp(measurement, selection);
    case "RAM": // RAM
      return this.buildOptionsFromSingleRAM(measurement, selection);
    default:
      return {
        err: "no sequence"
      };
  }
}


/** Create options from measurement and selection and build graph
 *
 */
PGUtils.prototype.buildGraphFromSingle = function (measurement, selections) {
  var self = this;
  var graphTypes = [];
  var options = {
    legend: { data: [] },
    xAxis: [],
    yAxis: [],
    series: [],
    tooltip: {
      show: true
    }
  };

  Object.keys(selections).map(function (selection) {
    switch (selections[selection].type) {
      case 'line':
      case 'bar':
        graphTypes.push('echarts/chart/' + selections[selection].type);
        var transformed = self.buildOptionsFromSingle(measurement, selections[selection]);
        options.xAxis = options.xAxis.concat(transformed.xAxis);
        options.yAxis = options.yAxis.concat(transformed.yAxis);
        options.series = options.series.concat(transformed.series);
        break;
      case 'seq':
        graphTypes.push('echarts/chart/bar'); // TODO: make it dynamic
        graphTypes.push('echarts/chart/line');
        var transformed = self.buildOptionsFromSingleSeq(measurement, selections[selection]);
        options.xAxis = options.xAxis.concat(transformed.xAxis);
        options.yAxis = options.yAxis.concat(transformed.yAxis);
        options.series = options.series.concat(transformed.series);
        options.legend = transformed.legend;
        break;
      default:

    }

  });
  this.buildGraph(graphTypes, options);
}


/* ************************************************************************* */
// ANALYTICS
PGUtils.prototype.sendAnalyticsQuery = function (query, cb) {
  
  $.ajax({
    type: 'POST',
    url: '/api/analytics/query',
    dataType: 'json',
    //contentType: "application/json; charset=utf-8",
    data: {'query': query},
    //cache: false,
    success: function (data) {
      cb(data);
    }.bind(this),
    error: function (xhr, status, err) {
      console.error(status, err.toString());
    }.bind(this)
  });
  
}

/* ************************************************************************* */
// EXTERNALS

String.prototype.toUpperFirst = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
}
