// stores.js
/* @flow */
'use strict';

// this goes to window.*

// ============================================================================
// MEASUREMENT_STORE

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
    MeasurementActions.measurementsUpdated(obj);
    this.trigger(obj);
  }

});

// ============================================================================
// MEASUREMENTS_STORE

var measurementsStore = Reflux.createStore({
  listenables: [MeasurementsActions],

  getInitialState: function () {
    this.measurements = {
      data: [],
      count: 0,
      pages: 1,
      page: 1,
      skip: 0,
      limit: 10
    };

    return this.measurements;
  },

  onGetMeasurements: function (collection, skip, limit) {
    let self = this;
    netUtils.fetchMeasurements(collection, skip, limit, function (err, data) {
      self.measurements.data = data;
      self.update(self.measurements);
    });
  },
  
  onGetMeasurementsCount: function (collection) {
    let self = this;
    netUtils.fetchMeasurementsCount(collection, function (err, data) {
      self.measurements.count = data;
      self.measurements.pages = Math.ceil(data / self.measurements.limit);
      self.update(self.measurements);
    });
  },
  
  onNextPage: function (){
    
  },
  
  onPrevPage: function (){
    
  },
  
  onSetPage: function (pageNr){
    this.measurements.page = pageNr;
    this.measurements.skip = (this.measurements.page - 1) * this.measurements.limit;
    this.onGetMeasurements(collectionStore.collection.current, this.measurements.skip, this.measurements.limit);
    this.update(this.measurements);
  },

  update: function (obj) {
    this.trigger(obj);
    console.log(obj);
  }

});

// ============================================================================
// CHARTS_STORE

var chartsStore = Reflux.createStore({
  listenables: [ChartsActions],

  getInitialState: function () {
    this.charts = {
      data: [],
      count: 0,
      pages: 1,
      page: 1,
      skip: 0,
      limit: 10
    };

    return this.charts;
  },

  onGetCharts: function (collection, skip, limit) {
    let self = this;
    netUtils.fetchCharts(collection, skip, limit, function (err, data) {
      self.charts.data = data;
      self.update(self.charts);
    });
  },
  
  onGetChartsCount: function (collection) {
    let self = this;
    netUtils.fetchChartsCount(collection, function (err, data) {
      self.charts.count = data;
      self.charts.pages = Math.ceil(data / self.charts.limit);
      self.update(self.charts);
    });
  },
  
  onNextPage: function (){
    
  },
  
  onPrevPage: function (){
    
  },
  
  onSetPage: function (pageNr){
    this.charts.page = pageNr;
    this.charts.skip = (this.charts.page - 1) * this.charts.limit;
    this.onGetCharts(collectionStore.collection.current, this.charts.skip, this.charts.limit);
    this.update(this.charts);
  },

  update: function (obj) {
    this.trigger(obj);
    console.log(obj);
  }

});

// ============================================================================
// PERSISTENCE_STORE

var persistenceStore = Reflux.createStore({
  listenables: [PersistenceActions, AnalyticsActions,MeasurementActions],

  chart: {},

  getInitialState: function () {
    this.chart = {
      title: null,
      description: null,
      type: null,
      collection: null,
      query: null,
      selection: null
    };
    return this.chart;
  },
  
  onSaveChart: function() {
    netUtils.saveChart(this.chart, function(err, msg){
      console.log(err);
    });
  },
  
  onUpdatePersistenceConfig: function(update) {
    this.chart = _.assign(this.chart, update);
    this.chart.collection = collectionStore.collection.current;
    this.updateChart(this.chart);
  },
  
  onUpdateAnalyticsQuery: function(query) {
    this.chart.query = query;
    this.chart.collection = collectionStore.collection.current;
    this.updateChart(this.chart);
  },

  onMeasurementsUpdated: function (obj) {
    this.chart.selection = obj;
    this.updateChart(this.chart);
  },

  updateChart: function (obj) {
    this.trigger(obj);
    console.log(obj);
  }

});

// ============================================================================
// ANALYTICS_STORE

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
      netUtils.sendAnalyticsQuery(q, (data) => {
        this.config.result = data.content;
        this.updateConfiguration(this.config);
        this.transformResultsToMeasurement(data.content);
      });
    } catch (e) {
      console.error(e);
    }
    AnalyticsActions.updateAnalyticsQuery(query);
  },
  
  transformResultsToMeasurement: function(qResult) {
    var result = netUtils.queryResultsToMeasurement(qResult) // TODO: check and display errors
    this.config.mockMeasurement = result.template;
    this.updateConfiguration(this.config);
  },

  updateConfiguration: function (obj) {
    this.trigger(obj);
    console.log(obj);
  }

});


// ============================================================================
// COLLECTION_STORE

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
      localStorage.current = this.collection.list[0];
      this.updateConfiguration(this.collection);
    }
  },
  
  onGetCollectionList: function () {
    let self = this;
    netUtils.fetchCollections((err, data) => {
      self.collection.list = data;
      self.checkDefault();
      self.updateConfiguration(self.collection);
    });
  },
  
  onSetCurrentCollection: function (value) {
    this.collection.current = value;
    localStorage.current = value;
    location.reload();
  },

  updateConfiguration: function (obj) {
    this.trigger(obj);
    console.log(obj);
  }

});

