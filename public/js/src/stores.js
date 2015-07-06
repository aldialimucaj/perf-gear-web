// stores.js
'use strict';

// this goes to window.*
var measurementStore = Reflux.createStore({
  listenables: [MeasurementActions],
  onSelectChart: function(itemKey, newSelection) {
    console.log(newSelection);
  }

});
