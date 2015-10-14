// stores.js
/* @flow */
'use strict';

// this goes to window.*
var measurementStore = Reflux.createStore({
  listenables: [MeasurementActions],

  getInitialState: function () {
    this.options = {};

    return this.options;
  },

  onSelectAxis: function (keyId, optionId, value) {
    if (!this.options[keyId]) this.options[keyId] = {};
    this.options[keyId][optionId] = value;
    this.updateOptions(this.options);
  },

  onSelectChart: function (keyId, arg) {
    if (!this.options[keyId]) this.options[keyId] = {};
    this.options[keyId].type = arg;
    this.updateOptions(this.options);
  },

  editLabel: function (keyId, optionId, value) {
    if (!this.options[keyId]) this.options[keyId] = {};
    this.options[keyId][optionId] = value;
    this.updateOptions(this.options);
  },

  updateOptions: function (obj) {
    this.trigger(obj);
  }

});

// ============================================================================
var analyticsStore = Reflux.createStore({
  listenables: [AnalyticsActions],

  getInitialState: function () {
    this.config = {
      query: {},
      result: {},
      mockMeasurement: {
        "_commitDate": "2015-10-11T19:32:59.928Z",
        "hitValue": 392911,
        "id": "630e1aff-8191-4bcf-b359-ab33eaa9a615",
        "path": "examples/c/example2/fibonacci_at",
        "sequence": [],
        "type": "HIT",
        "unit": "HITS"
      }
    };

    return this.config;
  },

  onSendQuery: function (query) {
    try {
      pgUtils.sendAnalyticsQuery(query, (data) => {
        this.config.result = data.content;
        this.updateConfiguration(this.config);
        console.log(data);
      });
    } catch (e) {
      console.error(e);
    }
  },

  updateConfiguration: function (obj) {
    this.trigger(obj);
  }

});