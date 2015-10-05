/* @flow */
'use strict';

var Promise = require('promise');
var _ = require('lodash');

/**
 * Parse JSON object into ReQL object
 * returns Promise
 */
exports.parse = function (jsonQuery, r) {
	var promises = [];
	// iterate over the object
	if (_.isPlainObject(jsonQuery)) for (let key in jsonQuery) {
		// if value is object then call function with value
		var value = jsonQuery[key];
		var p = null;
		if (_.isPlainObject(value)) {
			p = exports.parse(value, r);
		} else {
			p = new Promise((fulfill, reject) => {
				var tempQuery = r[key](value);
				fulfill(tempQuery);
			})
		}
		promises.push(p);
	}

	return Promise.all(promises);

}