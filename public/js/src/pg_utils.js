// pg_utils.js
/* @flow */
(function (module) {

  if (module && require) { // put the requires here
    _ = require("lodash");
  }

  function PGUtils() {
    // constructor
  }

  /* ************************************************************************* */
  // NET
  

  /** 
   * Fetch data from database
   *
   */
  PGUtils.prototype.fetchMeasurements = function (collection, skip, limit, cb) {
    if (!cb) cb = limit;
    if (!cb) cb = skip;

    $.ajax({
      url: '/api/measurements/' + collection,
      dataType: 'json',
      cache: false,
      data: { skip: skip, limit: limit },
      type: 'GET',
      success: function (data) {
        this._dataCheckAndReturn(data, cb);
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(collection, status, err.toString());
      }.bind(this)
    });
  };


  /** 
   * Fetch one measurement by id
   *
   */
  PGUtils.prototype.fetchOneMeasurementById = function (collection, id, cb) {
    if (!cb) cb = limit;
    if (!cb) cb = skip;

    $.ajax({
      url: '/api/measurements/' + collection + '/' + id,
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
  
  /** 
   * Fetch measurements count from database
   *
   */
  PGUtils.prototype.fetchMeasurementsCount = function (collection, cb) {

    $.ajax({
      url: '/api/measurements/' + collection + '/count',
      dataType: 'json',
      cache: false,
      success: function (data) {
        this._dataCheckAndReturn(data, cb);
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(collection, status, err.toString());
      }.bind(this)
    });
  };
  
  /**
   * Save chart configuration.
   * 
   */
  PGUtils.prototype.saveChart = function (chart, cb) {

    $.ajax({
      type: 'POST',
      url: '/api/charts',
      dataType: 'json',
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(chart),
      //cache: false,
      success: function (data) {
        cb(data);
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });

  }
  
  /** 
 * Fetch data from database
 *
 */
  PGUtils.prototype.fetchCollections = function (cb) {

    $.ajax({
      url: '/api/collections/',
      dataType: 'json',
      cache: false,
      success: function (data) {
        this._dataCheckAndReturn(data, cb);
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(collection, status, err.toString());
      }.bind(this)
    });
  };
  
  /** 
    * Fetch data from database
    *
    */
  PGUtils.prototype.fetchCharts = function (collection, skip, limit, cb) {
    if (!cb) cb = limit;
    if (!cb) cb = skip;

    $.ajax({
      url: '/api/charts/' + collection,
      dataType: 'json',
      cache: false,
      data: { skip: skip, limit: limit },
      type: 'GET',
      success: function (data) {
        this._dataCheckAndReturn(data, cb);
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(collection, status, err.toString());
      }.bind(this)
    });
  };
  
  /** 
    * Fetch data from database
    *
    */
  PGUtils.prototype.fetchChartOptionsById = function (id, collection, cb) {
    $.ajax({
      url: '/api/charts/' + id+ '/' + collection +  '/options',
      dataType: 'json',
      cache: false,
      type: 'GET',
      success: function (data) {
        this._dataCheckAndReturn(data, cb);
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(id, status, err.toString());
      }.bind(this)
    });
  };
  
  /**  
    * Fetch charts count from database
    *
    */
  PGUtils.prototype.fetchChartsCount = function (collection, cb) {

    $.ajax({
      url: '/api/charts/' + collection + '/count',
      dataType: 'json',
      cache: false,
      success: function (data) {
        this._dataCheckAndReturn(data, cb);
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(collection, status, err.toString());
      }.bind(this)
    });
  };

  /** 
   * Check data if valid and errors.
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
  * We generate the keys for the axes based on the object structure.
  * Here is where we parse the object and compile the relevant list.
  * type = string, bar/line/seq
  * optionId = string, axis option that was chosen. xAxis/yAxis
  * mObject = measurement object to be parsed
  * prefix = string, called recursively in case of sub objects like "key1"
  *
  */
  PGUtils.prototype.getAxisItems = function (type, optionId, mObject, prefix) {
    var self = this;
    var keys = Object.keys(mObject).map(function (key) {
      if (_.isPlainObject(mObject[key])) {
        return self.getAxisItems(type, optionId, mObject[key], key);
      }
      // filtering for known types
      switch (type) {
        case 'line':
        case 'bar':
          if (optionId === "yAxis" && !_.isNumber(mObject[key])) return null;
          if (Array.isArray(mObject[key])) return null;
          break;
        case 'seq':
          if (!Array.isArray(mObject[key])) return null;
          break;
      }

      return prefix ? prefix + '.' + key : key;
    });

    return _.filter(_.flattenDeep(keys), (n) => _.isString(n));
  }

  /* ************************************************************************* */

  /** 
   * Build graph
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

  /** 
   * Generate Graph Options from a single measurement.
   * This function only build options for non sequencial graphs.
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

  /**
   * Generate Graph Options for single RAM measurements
   * This function generates options for sequential memory measurements.
   */
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
  
  /**
   * Generate Graph Options for single TIME measurements
   * This function generates options for sequential timestamp measurements.
   */
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

  /** 
   * Builds options for sequence charts
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


  /** 
   * Create options from measurement and selection and build graph
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
    return { graphTypes: graphTypes, options: options };
  }


  /* ************************************************************************* */
  // ANALYTICS
  
  /**
   * Sends query to backend API to request ReQL results
   */
  PGUtils.prototype.sendAnalyticsQuery = function (query, cb) {

    $.ajax({
      type: 'POST',
      url: '/api/analytics/query',
      dataType: 'json',
      //contentType: "application/json; charset=utf-8",
      data: query,
      //cache: false,
      success: function (data) {
        cb(data);
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });

  }

  /**
   * Pick up results out of returend results. This is done in order to
   * build the x and y axes. It creates a phantom template which has
   * all keys from all returend measurements. 
   */
  PGUtils.prototype.queryResultsToMeasurement = function (result, cb) {
    var template = {};
    var err = null;
    // only if it is an array it needs transformation
    if (_.isArray(result)) {
      _.forEach(result, function (n) {
        if (_.isArray(n.reduction)) {
          _.forEach(n.reduction, function (m) {
            _.assign(template, m);
          });
        } else {
          _.assign(template, n);
        }
      });
    } else if (_.isPlainObject(result)) {
      template = result;
    } else {
      template.value = result;
    }

    return { template: template, err: err };
  }


  /** 
   * Generate Graph Options from a multiple measurement
   *
   */
  PGUtils.prototype.buildOptionsFromMultiple = function (measurements, selection) {
    // results can still return single element through m.get(ID)
    if (!_.isArray(measurements) && _.isPlainObject(measurements)) return this.buildOptionsFromSingle(measurements, selection);

    var options = {
      series: []
    };

    options.tooltip = {
      show: true
    };

    options.yAxis = [{
      type: 'value', // TODO: need to find out data type!!!
    }];

    if (measurements.length == 0) {
      return options;
    }

    if (_.isArray(measurements[0].reduction) && measurements[0].group) {
      var isGrouped = true;
    }

    if (isGrouped) {
      // add legend
      options.xAxis = [{
        type: 'category', // TODO: need to find out data type!!!
        data: _.pluck(measurements, "group") //read data from measurement[props.xAxis]. If sequence special case
      }];

      // get the number of seris which is the number of bars per group
      var maxSeries = _.max(_.map(_.pluck(measurements, "reduction"), (r) => r.length));

      // create the empty series
      for (var i = 0; i < maxSeries; i++) {
        options.series.push({
          "name": selection.name || selection.yAxis,
          "type": selection.type,
          "data": [] //_.pluck(group.reduction, selection.yAxis)
        });
      }

      // fill the series      
      _.forEach(measurements, function (group) {
        for (var i = 0; i < maxSeries; i++) {
          options.series[i].data.push(_.get(group.reduction[i], selection.yAxis));
          if (group.reduction[i]) {
            options.series[i].name = _.get(group.reduction[i], selection.xAxis) + "." + selection.yAxis
          }
        }
      });

    } else {
      // add legend
      options.xAxis = [{
        type: 'category', // TODO: need to find out data type!!!
        data: _.pluck(measurements, selection.xAxis) //read data from measurement[props.xAxis]. If sequence special case
      }];

      options.series = [{
        "name": selection.name || selection.yAxis,
        "type": selection.type,
        "data": _.pluck(measurements, selection.yAxis)
      }]
    }

    return options;
  };

  /** 
   * Generate Graph Options from a multiple measurements
   *
   */
  PGUtils.prototype.buildGraphFromMultiple = function (measurements, selections) {
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
          var transformed = self.buildOptionsFromMultiple(measurements, selections[selection]);
          options.xAxis = options.xAxis.concat(transformed.xAxis);
          options.yAxis = options.yAxis.concat(transformed.yAxis);
          options.series = options.series.concat(transformed.series);
          options.legend = transformed.legend;
          break;
        case 'seq':
          graphTypes.push('echarts/chart/bar'); // TODO: make it dynamic
          graphTypes.push('echarts/chart/line');
          var transformed = self.buildOptionsFromSingleSeq(measurements, selections[selection]);
          options.xAxis = options.xAxis.concat(transformed.xAxis);
          options.yAxis = options.yAxis.concat(transformed.yAxis);
          options.series = options.series.concat(transformed.series);
          options.legend = transformed.legend;
          break;
        default:
      }
    });

    return { graphTypes: graphTypes, options: options };
  };

  /* ************************************************************************* */
  // EXTERNALS

  String.prototype.toUpperFirst = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  }

  if (module) module.exports = PGUtils;
  else window.PGUtils = PGUtils;

})(typeof module === 'undefined' ? null : module);
