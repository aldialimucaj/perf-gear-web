/* @flow */
'use strict';

var Promise = require('promise');
var _ = require('lodash');

/**
 * Parse JSON object into ReQL object
 * returns Promise
 */
exports.parse = function (jsonQuery, r) {
	return new Promise((s, f) => {
		if (_.isPlainObject(jsonQuery)) for (let key in jsonQuery) {
			// if value is object then call function with value
			var value = jsonQuery[key];
			if (_.isPlainObject(value)) {
				//exports.parse(value, r);
			} else {
				r = r[key](value);
			}
		}
		s(r);
	});

}