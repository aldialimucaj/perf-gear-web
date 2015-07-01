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
      cb(null, data);
    }.bind(this),
    error: function(xhr, status, err) {
      console.error(this.props.url, status, err.toString());
    }.bind(this)
  });

};
