// pg_utils.js

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
PGUtils.prototype.buildGraph = function(graphType, options, element) {
  var chartHolder = document.getElementById(element) || document.getElementById('chart');
  var chartType = ['echarts', 'echarts/chart/'];

  switch (graphType) {
    case 'bar':
    case 'line':
      chartType[1] += graphType;
      options.series.type = graphType;
      break;
    default:
      console.error("Graph Type not recognized. Please contact someone.");
      return;
  }
  // checking options
  if (!options.legend) options.legend = {
    data: ['#Add legend']
  };

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
    "name": selection.yAxis,
    "type": selection.type,
    "data": [measurement[selection.yAxis]]
  }]

  return options;
};


/** Create options from measurement and selection and build graph
 * 
 */
PGUtils.prototype.buildGraphFromSingle = function(measurement, selection) {
  var options = this.buildOptionsFromSingle(measurement, selection);
  this.buildGraph(selection.type, options);
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
