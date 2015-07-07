// stores.js
'use strict';

// this goes to window.*
var measurementStore = Reflux.createStore({
  listenables: [MeasurementActions],

  getInitialState: function() {
      this.options = {};

      return this.options;
  },

  onSelectAxis: function (optionId, value) {
    this.options[optionId] = value;
    this.updateOptions(this.options);
  },

  onSelectChart: function(arg) {
    this.options.type = arg;
    this.updateOptions(this.options);
  },

  updateOptions: function(obj){
    this.trigger(obj);
  }

});
