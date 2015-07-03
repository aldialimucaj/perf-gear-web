// pg_utils.js

function PGUtils() {

}

/** Fetch data from database
 *
 */
PGUtils.prototype.fetchMeasurements = function (skip, limit, cb) {
  if(!cb) cb = limit;
  if(!cb) cb = skip;

  $.ajax({
    url: '/api/measurements',
    dataType: 'json',
    cache: false,
    success: function(data) {
      this._dataCheckAndReturn(data, cb);
    }.bind(this),
    error: function(xhr, status, err) {
      console.error(this.props.url, status, err.toString());
    }.bind(this)
  });
};


/** Fetch one measurement by id
 *
 */
PGUtils.prototype.fetchOneMeasurementById = function (id, cb) {
  if(!cb) cb = limit;
  if(!cb) cb = skip;

  $.ajax({
    url: '/api/measurements/'+id,
    dataType: 'json',
    cache: false,
    success: function(data) {
      this._dataCheckAndReturn(data, cb);
    }.bind(this),
    error: function(xhr, status, err) {
      console.error(this.props.url, status, err.toString());
    }.bind(this)
  });
};

/** Check data if valid and errors.
 * private
 */
PGUtils.prototype._dataCheckAndReturn = function(data, cb) {
  if(data && data.ok){
    cb(null, data.content);
  }else if (data){
    cb(data.err, null);
  }else {
    cb({msg: "unknown error"}, null);
  }
}


PGUtils.prototype.buildTestGraph = function (first_argument) {
  // use
     require(
         [
             'echarts',
             'echarts/chart/bar' // require the specific chart type
         ],
         function (ec) {
             // Initialize after dom ready
             var myChart = ec.init(document.getElementById('chart'));

             var option = {
                 tooltip: {
                     show: true
                 },
                 legend: {
                     data:['Sales']
                 },
                 xAxis : [
                     {
                         type : 'category',
                         data : ["Shirts", "Sweaters", "Chiffon Shirts", "Pants", "High Heels", "Socks"]
                     }
                 ],
                 yAxis : [
                     {
                         type : 'value'
                     }
                 ],
                 series : [
                     {
                         "name":"Sales",
                         "type":"bar",
                         "data":[5, 20, 40, 10, 10, 20]
                     }
                 ]
             };

             // Load data into the ECharts instance
             myChart.setOption(option);
         }
     );
};
