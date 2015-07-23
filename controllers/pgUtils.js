/* @flow */
'use strict';

/*
* Check if there was an error. If so respond with err message and status code.
*/
exports.forwarder = function(res, err, result, statusCode) {
  if (!err) {
    res.status(statusCode || 200).send({
      ok: true,
      content: result
    });
  } else {
    res.status(200).send({
      ok: false,
      err: err
    });
  }
}
