/* @flow */
'use strict';

var Promise = require('promise');

/**
 * Parse JSON object into ReQL object
 * returns Promise
 */
exports.parse = function(jsonQuery, db) {
	return new Promise(function(fulfill, reject) {
		var tempQuery = db.group(jsonQuery.groupBy);
		fulfill(tempQuery);	
	});
	
}