// pg_utils.js
/* @flow */
function PGUtils() {
  // constructor
}

/** Fetch data from database
 *
 */
PGUtils.prototype.fetchMeasurements = function(skip, limit, cb) {
  if (!cb) cb = limit;
  if (!cb) cb = skip;

  $.ajax({
    url: '/api/measurements',
    dataType: 'json',
    cache: false,
    success: function(data) {
      this._dataCheckAndReturn(data, cb);
    }.bind(this),
    error: function(xhr, status, err) {
      console.error(this.props.url, status, err.toString());
    }.bind(this)
  });
};


/** Fetch one measurement by id
 *
 */
PGUtils.prototype.fetchOneMeasurementById = function(id, cb) {
  if (!cb) cb = limit;
  if (!cb) cb = skip;

  $.ajax({
    url: '/api/measurements/' + id,
    dataType: 'json',
    cache: false,
    success: function(data) {
      this._dataCheckAndReturn(data, cb);
    }.bind(this),
    error: function(xhr, status, err) {
      console.error(this.props.url, status, err.toString());
    }.bind(this)
  });
};

/** Check data if valid and errors.
 * private
 */
PGUtils.prototype._dataCheckAndReturn = function(data, cb) {
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

/* ************************************************************************* */

/** Build graph
 *
 */
PGUtils.prototype.buildGraph = function(graphTypes, options, element) {
  var chartHolder = document.getElementById(element) || document.getElementById('chart');
  var chartType = ['echarts'].concat(graphTypes);

  // checking options
  if (!options.legend) options.legend = {
    data: ['#Add legend']
  };

  console.log(JSON.stringify(options));

  require(chartType,
    function(ec) {
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
PGUtils.prototype.buildOptionsFromSingle = function(measurement, selection) {
  var options = {};
  options.tooltip = {
    show: true
  };
  // add legend
  options.xAxis = [{
    type: 'category', // TODO: need to find out data type!!!
    data: [measurement[selection.xAxis]] //read data from measurement[props.xAxis]. If sequence special case
  }];

  options.yAxis = [{
    type: 'value', // TODO: need to find out data type!!!
  }];

  options.series = [{
    "name": selection.name || selection.yAxis,
    "type": selection.type,
    "data": [measurement[selection.yAxis]]
  }]

  return options;
};

PGUtils.prototype.buildOptionsFromSingleSeq = function(measurement, selection) {
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


PGUtils.prototype.buildOptionsFromSingleRAM = function(measurement, selection) {
  var options = {};
  options.tooltip = {
    show: true
  };

  options.yAxis = [{
    type: 'value',
  }];

  var data = [];
  var temp = measurement.sequence[0].timestamp;
  var ramData = measurement.sequence.map(function(seq) {
    var xLabel = seq.tag? (seq.tag + ' (at '+ (seq.timestamp - temp)+ 'ms)'):'at '+ (seq.timestamp - temp)+ 'ms'
    data.push(xLabel);// TODO: change ms to dynamic value
    return seq.value
  });

  options.series = [{
    "name": 'Sequence',
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

PGUtils.prototype.buildOptionsFromSingleTimestamp = function(measurement, selection) {
  var options = {};
  options.tooltip = {
    show: true
  };

  options.xAxis = [{
    type: 'value',
  }];

  var legend = [];
  var temp = measurement.sequence[0].timestamp;
  options.series = measurement.sequence.map(function(seq) {
    var tstamp = seq.timestamp - temp;
    temp = seq.timestamp;
    legend.push(seq.tag);
    return {
      "name": seq.tag,
      "type": 'bar',
      "stack": 'true',
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
    data: ['Sequence']
  }];


  return options;
};


/** Create options from measurement and selection and build graph
 *
 */
PGUtils.prototype.buildGraphFromSingle = function(measurement, selections) {
  var self = this;
  var graphTypes = [];
  var options = {
    legend: {},
    xAxis: [],
    yAxis: [],
    series: [],
    tooltip: {
      show: true
    }
  };

  Object.keys(selections).map(function(selection) {
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


/** Build a test graph -- DELETE
 *
 */
PGUtils.prototype.buildTestGraph = function(first_argument) {
  // use
  require(
    [
      'echarts',
      'echarts/chart/line' // require the specific chart type
    ],
    function(ec) {
      // Initialize after dom ready
      var myChart = ec.init(document.getElementById('chart'));

      var option = {
        tooltip: {
          show: true
        },
        legend: {
          data: ['Sales', 'Buys']
        },
        xAxis: [{
          type: 'category',
          data: ["Shirts", "Sweaters", "Chiffon Shirts", "Pants", "High Heels", "Socks"]
        }, {
          type: 'category',
          data: ["Jeans", "Hoodies", "Shorts", "Pyjamas", "Shoes", "Panties"]
        }],
        yAxis: [{
          type: 'value'
        }],
        series: [{
          "name": "Sales",
          "type": "line",
          "data": [5, 20, 40, 10, 10, 20]
        }, {
          "name": "Buys",
          "type": "line",
          "data": [15, 2, 10, 1, 17, 30]
        }]
      };

      // Load data into the ECharts instance
      myChart.setOption(option);
    }
  );
};

/* ************************************************************************* */
// EXTERNALS

String.prototype.toUpperFirst = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}
