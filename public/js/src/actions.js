// actions.js
/* @flow */
'use strict';

var MeasurementActions = Reflux.createActions([
  "selectChart",
  "selectAxis",
  "editLabel"
]);

var AnalyticsActions = Reflux.createActions([
  "sendQuery"
]);

var CollectionActions = Reflux.createActions([
  "getCollectionList",
  "setCurrentCollection"
]);

