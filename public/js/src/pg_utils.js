console.log('test')

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

PGUtils.prototype._dataCheckAndReturn = function(data, cb) {
  if(data && data.ok){
    cb(null, data.content);
  }else if (data){
    cb(data.err, null);
  }else {
    cb({msg: "unknown error"}, null);
  }
}
