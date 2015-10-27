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
      mockMeasurement: {}
    };

    return this.config;
  },

  onSendQuery: function (query) {
    var q = {
      query: query, 
      collection: collectionStore.collection.current
    };
    
    try {
      pgUtils.sendAnalyticsQuery(q, (data) => {
        this.config.result = data.content;
        this.updateConfiguration(this.config);
        this.transformResultsToMeasurement(data.content);
      });
    } catch (e) {
      console.error(e);
    }
  },
  
  transformResultsToMeasurement: function(qResult) {
    var result = pgUtils.queryResultsToMeasurement(qResult) // TODO: check and display errors
    this.config.mockMeasurement = result.template;
    this.updateConfiguration(this.config);
  },

  updateConfiguration: function (obj) {
    this.trigger(obj);
    console.log(obj);
  }

});


// ============================================================================
var collectionStore = Reflux.createStore({
  listenables: [CollectionActions],

  getInitialState: function () {
    
    this.collection = {
      list: [],
      current: localStorage.current
    };

    return this.collection;
  },
  
  checkDefault: function() {
    if(!this.collection.current && this.collection.list.length > 0){
      this.collection.current = this.collection.list[0];
      this.updateConfiguration(this.collection);
    }
  },
  
  onGetCollectionList: function () {
    let self = this;
    pgUtils.fetchCollections((err, data) => {
      self.collection.list = data;
      self.updateConfiguration(self.collection);
      self.checkDefault();
    });
  },
  
  onSetCurrentCollection: function (value) {
    this.collection.current = value;
    localStorage.current = value;
  },

  updateConfiguration: function (obj) {
    this.trigger(obj);
    console.log(obj);
  }

});