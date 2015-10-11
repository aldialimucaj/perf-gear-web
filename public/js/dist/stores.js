// stores.js
/* @flow */
'use strict';

// this goes to window.*
var measurementStore = Reflux.createStore({
  listenables: [MeasurementActions],

  getInitialState: function() {
      this.options = {};

      return this.options;
  },

  onSelectAxis: function (keyId, optionId, value) {
    if(!this.options[keyId]) this.options[keyId] = {};
    this.options[keyId][optionId] = value;
    this.updateOptions(this.options);
  },

  onSelectChart: function(keyId, arg) {
    if(!this.options[keyId]) this.options[keyId] = {};
    this.options[keyId].type = arg;
    this.updateOptions(this.options);
  },

  editLabel: function (keyId, optionId, value) {
    if(!this.options[keyId]) this.options[keyId] = {};
    this.options[keyId][optionId] = value;
    this.updateOptions(this.options);
  },

  updateOptions: function(obj){
    this.trigger(obj);
  }

});

// ============================================================================
var analyticsStore = Reflux.createStore({
  listenables: [AnalyticsActions],
  
  getInitialState: function() {
    this.config = { query: {}, result: {}};
    
    return this.config;
  },
  
  onSendQuery: function(query) {
    try {
      pgUtils.sendAnalyticsQuery(query, (data) => {
        this.config.result = data.content;
        this.updateConfiguration(this.config);
        console.log(data);
      });
    }catch(e) {
      console.error(e);
    }
  },

  updateConfiguration: function(obj){
    this.trigger(obj);
  }
  
});