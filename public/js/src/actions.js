// actions.js
/* @flow */
'use strict';

var MeasurementActions = Reflux.createActions([
  "selectChart",
  "selectAxis",
  "editLabel"
]);

var MeasurementsActions = Reflux.createActions([
  "getMeasurements",
  "getMeasurementsCount",
  "nextPage",
  "prevPage",
  "setPage"
]);

var ChartsActions = Reflux.createActions([
  "getCharts",
  "getChartsCount",
  "nextPage",
  "prevPage",
  "setPage"
]);


var AnalyticsActions = Reflux.createActions([
  "sendQuery"
]);

var CollectionActions = Reflux.createActions([
  "getCollectionList",
  "setCurrentCollection"
]);

