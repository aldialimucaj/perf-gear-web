// pg_utils.js
/* @flow */
(function (module) {

  if (module && require) { // put the requires here
    _ = require("lodash");
  }

  function NetUtils() {
    // constructor
  }

  /* ************************************************************************* */
  // NET
  /* ************************************************************************* */

  /** 
   * Fetch data from database
   *
   */
  NetUtils.prototype.fetchMeasurements = function (collection, skip, limit, cb) {
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

  /* ************************************************************************* */

  /** 
   * Fetch one measurement by id
   *
   */
  NetUtils.prototype.fetchOneMeasurementById = function (collection, id, cb) {
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
  
  /* ************************************************************************* */
  
  /** 
   * Fetch measurements count from database
   *
   */
  NetUtils.prototype.fetchMeasurementsCount = function (collection, cb) {

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
  
  /* ************************************************************************* */
  
  /**
   * Save chart configuration.
   * 
   */
  NetUtils.prototype.saveChart = function (chart, cb) {

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
  
  /* ************************************************************************* */
  
  /** 
   * Fetch data from database
   *
   */
  NetUtils.prototype.fetchCollections = function (cb) {

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
  
  /* ************************************************************************* */
  
  /** 
    * Fetch data from database
    *
    */
  NetUtils.prototype.fetchCharts = function (collection, skip, limit, cb) {
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
  
  /* ************************************************************************* */
  
  /** 
    * Fetch data from database
    *
    */
  NetUtils.prototype.fetchChartOptionsById = function (id, collection, cb) {
    $.ajax({
      url: '/api/charts/' + id + '/' + collection + '/options',
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
  
  /* ************************************************************************* */
  
  /**  
    * Fetch charts count from database
    *
    */
  NetUtils.prototype.fetchChartsCount = function (collection, cb) {

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
  
  /* ************************************************************************* */

  /** 
   * Check data if valid and errors.
   * private
   */
  NetUtils.prototype._dataCheckAndReturn = function (data, cb) {
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

  

  /* ************************************************************************* */
  // ANALYTICS
  /* ************************************************************************* */
  
  /**
   * Sends query to backend API to request ReQL results
   */
  NetUtils.prototype.sendAnalyticsQuery = function (query, cb) {

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
  
  /* ************************************************************************* */

  /**
   * Pick up results out of returend results. This is done in order to
   * build the x and y axes. It creates a phantom template which has
   * all keys from all returend measurements. 
   */
  NetUtils.prototype.queryResultsToMeasurement = function (result, cb) {
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

  /* ************************************************************************* */

 

  /* ************************************************************************* */
  // EXTERNALS
  /* ************************************************************************* */

  String.prototype.toUpperFirst = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  }

  if (module) module.exports = NetUtils;
  else window.NetUtils = NetUtils;

})(typeof module === 'undefined' ? null : module);
