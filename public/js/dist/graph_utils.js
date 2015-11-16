/* @flow */
(function (module) {

	'use strict';

	if (module && require) { // put the requires here
		GLOBAL._ = require("lodash");
	}


	var GraphUtils = function () { };


	/**
	  * Get relevant items to be selected for axis.
	  * We generate the keys for the axes based on the object structure.
	  * Here is where we parse the object and compile the relevant list.
	  * type = string, bar/line/seq
	  * optionId = string, axis option that was chosen. xAxis/yAxis
	  * mObject = measurement object to be parsed
	  * prefix = string, called recursively in case of sub objects like "key1"
	  *
	  * @return Array with all selectable fields
	  */
	GraphUtils.prototype.getAxisItems = function (type, optionId, mObject, prefix) {
		var self = this;
		var keys = Object.keys(mObject).map(function (key) {
			if (_.isPlainObject(mObject[key])) {
				return self.getAxisItems(type, optionId, mObject[key], key);
			}
			// filtering for known types
			switch (type) {
				case 'line':
				case 'bar':
					if (optionId === "yAxis" && !_.isNumber(mObject[key])) return null;
					if (Array.isArray(mObject[key])) return null;
					break;
				case 'seq':
					if (!Array.isArray(mObject[key])) return null;
					break;
			}

			return prefix ? prefix + '.' + key : key;
		});

		return _.filter(_.flattenDeep(keys), (n) => _.isString(n));
	}

	/* ************************************************************************* */

	/** 
	 * Generate Graph Options from a single measurement.
	 * This function only build options for non sequencial graphs.
	 *
	 */
	GraphUtils.prototype.buildOptionsFromSingle = function (measurement, selection) {
		var options = {};
		options.tooltip = {
			show: true
		};
		// add legend
		options.xAxis = [{
			type: 'category', // TODO: need to find out data type!!!
			data: [_.get(measurement, selection.xAxis)] //read data from measurement[props.xAxis]. If sequence special case
		}];

		options.yAxis = [{
			type: 'value', // TODO: need to find out data type!!!
		}];

		options.series = [{
			"name": selection.name || selection.yAxis,
			"type": selection.type,
			"data": [_.get(measurement, selection.yAxis)]
		}]

		return options;
	};

	/* ************************************************************************* */

	/**
	 * Generate Graph Options for single RAM measurements
	 * This function generates options for sequential memory measurements.
	 */
	GraphUtils.prototype.buildOptionsFromSingleRAM = function (measurement, selection) {
		var options = {};

		options.legend = { data: [] };

		options.tooltip = {
			show: true
		};

		options.yAxis = [{
			type: 'value',
		}];

		options.legend.data.push(selection.yAxis.toUpperFirst());
		var data = [];
		var temp = measurement.sequence[0].timestamp;
		var ramData = measurement.sequence.map(function (seq) {
			var xLabel = seq.tag ? (seq.tag + ' (at ' + (seq.timestamp - temp) + 'µs)') : 'at ' + (seq.timestamp - temp) + 'µs'
			data.push(xLabel);// TODO: change ms to dynamic value
			return seq.value
		});

		options.series = [{
			"name": selection.yAxis.toUpperFirst(),
			"type": 'line',
			"stack": 'true',
			"itemStyle": {
				"normal": {
					"label": {
						"show": true,
						"position": 'insideRight'
					}
				}
			},
			"data": ramData,
			"markLine": {
				"data": [{
					"type": 'average',
					"name": 'Average'
				}]
			}
		}];

		// add x-axis
		options.xAxis = [{
			type: 'category',
			data: data
		}];


		return options;
	};

	/* ************************************************************************* */
  
	/**
	 * Generate Graph Options for single TIME measurements
	 * This function generates options for sequential timestamp measurements.
	 */
	GraphUtils.prototype.buildOptionsFromSingleTimestamp = function (measurement, selection) {
		var options = {};

		options.legend = {};

		options.tooltip = {
			show: true
		};

		options.xAxis = [{
			type: 'value'
		}];

		options.legend.data = [];
		var temp = measurement.sequence[0].timestamp;
		options.series = measurement.sequence.map(function (seq) {
			var tstamp = seq.timestamp - temp;
			temp = seq.timestamp;
			options.legend.data.push(seq.tag);
			return {
				"name": seq.tag,
				"type": 'bar',
				"stack": 'true',
				"barMaxWidth": 25,
				"itemStyle": {
					"normal": {
						"label": {
							"show": true,
							"position": 'insideRight'
						}
					}
				},
				"data": [tstamp]
			}
		});

		// add y-axis
		options.yAxis = [{
			type: 'category',
			data: [selection.yAxis]
		}];


		return options;
	};

	/* ************************************************************************* */

	/** 
	 * Builds options for sequence charts
	 */
	GraphUtils.prototype.buildOptionsFromSingleSeq = function (measurement, selection) {
		switch (measurement.type) {
			case "TIME": // timestamp
				return this.buildOptionsFromSingleTimestamp(measurement, selection);
			case "RAM": // RAM
				return this.buildOptionsFromSingleRAM(measurement, selection);
			default:
				return {
					err: "no sequence"
				};
		}
	}

	/* ************************************************************************* */

	/** 
	 * Create options from measurement and selection and build graph
	 *
	 */
	GraphUtils.prototype.buildGraphFromSingle = function (measurement, selections) {
		var self = this;
		var graphTypes = [];
		var options = {
			legend: { data: [] },
			xAxis: [],
			yAxis: [],
			series: [],
			tooltip: {
				show: true
			}
		};

		Object.keys(selections).map(function (selection) {
			switch (selections[selection].type) {
				case 'line':
				case 'bar':
					graphTypes.push('echarts/chart/' + selections[selection].type);
					var transformed = self.buildOptionsFromSingle(measurement, selections[selection]);
					options.xAxis = options.xAxis.concat(transformed.xAxis);
					options.yAxis = options.yAxis.concat(transformed.yAxis);
					options.series = options.series.concat(transformed.series);
					break;
				case 'seq':
					graphTypes.push('echarts/chart/bar'); // TODO: make it dynamic
					graphTypes.push('echarts/chart/line');
					var transformed = self.buildOptionsFromSingleSeq(measurement, selections[selection]);
					options.xAxis = options.xAxis.concat(transformed.xAxis);
					options.yAxis = options.yAxis.concat(transformed.yAxis);
					options.series = options.series.concat(transformed.series);
					options.legend = transformed.legend;
					break;
				default:

			}

		});
		return { graphTypes: graphTypes, options: options };
	}


	/* ************************************************************************* */
	// ANALYTICS
	/* ************************************************************************* */
  
	/**
	 * Pick up results out of returend results. This is done in order to
	 * build the x and y axes. It creates a phantom template which has
	 * all keys from all returend measurements. 
	 */
	GraphUtils.prototype.queryResultsToMeasurement = function (result, cb) {
		var template = {};
		var err = null;
		// only if it is an array it needs transformation
		if (_.isArray(result)) {
			_.forEach(result, function (n) {
				if (_.isArray(n.reduction)) {
					_.forEach(n.reduction, function (m) {
						_.assign(template, m);
					});
				} else {
					_.assign(template, n);
				}
			});
		} else if (_.isPlainObject(result)) {
			template = result;
		} else {
			template.value = result;
		}

		return { template: template, err: err };
	}

	/* ************************************************************************* */

	/** 
	 * Generate Graph Options from a multiple measurement
	 *
	 */
	GraphUtils.prototype.buildOptionsFromMultiple = function (measurements, selection) {
		// results can still return single element through m.get(ID)
		if (!_.isArray(measurements) && _.isPlainObject(measurements)) return this.buildOptionsFromSingle(measurements, selection);

		var options = {
			series: []
		};

		options.tooltip = {
			show: true
		};

		options.yAxis = [{
			type: 'value', // TODO: need to find out data type!!!
		}];

		if (measurements.length == 0) {
			return options;
		}

		if (_.isArray(measurements[0].reduction) && measurements[0].group) {
			var isGrouped = true;
		}

		if (isGrouped) {
			// add legend
			options.xAxis = [{
				type: 'category', // TODO: need to find out data type!!!
				data: _.pluck(measurements, "group") //read data from measurement[props.xAxis]. If sequence special case
			}];

			// get the number of seris which is the number of bars per group
			var maxSeries = _.max(_.map(_.pluck(measurements, "reduction"), (r) => r.length));

			// create the empty series
			for (var i = 0; i < maxSeries; i++) {
				options.series.push({
					"name": selection.name || selection.yAxis,
					"type": selection.type,
					"data": [] //_.pluck(group.reduction, selection.yAxis)
				});
			}

			// fill the series      
			_.forEach(measurements, function (group) {
				for (var i = 0; i < maxSeries; i++) {
					options.series[i].data.push(_.get(group.reduction[i], selection.yAxis));
					if (group.reduction[i]) {
						options.series[i].name = _.get(group.reduction[i], selection.xAxis) + "." + selection.yAxis
					}
				}
			});

		} else {
			// add legend
			options.xAxis = [{
				type: 'category', // TODO: need to find out data type!!!
				data: _.pluck(measurements, selection.xAxis) //read data from measurement[props.xAxis]. If sequence special case
			}];

			options.series = [{
				"name": selection.name || selection.yAxis,
				"type": selection.type,
				"data": _.pluck(measurements, selection.yAxis)
			}]
		}

		return options;
	};

	/* ************************************************************************* */

	/** 
	 * Generate Graph Options from a multiple measurements
	 *
	 */
	GraphUtils.prototype.buildGraphFromMultiple = function (measurements, selections) {
		var self = this;
		var graphTypes = [];
		var options = {
			legend: { data: [] },
			xAxis: [],
			yAxis: [],
			series: [],
			tooltip: {
				show: true
			}
		};

		Object.keys(selections).map(function (selection) {
			switch (selections[selection].type) {
				case 'line':
				case 'bar':
					graphTypes.push('echarts/chart/' + selections[selection].type);
					var transformed = self.buildOptionsFromMultiple(measurements, selections[selection]);
					options.xAxis = options.xAxis.concat(transformed.xAxis);
					options.yAxis = options.yAxis.concat(transformed.yAxis);
					options.series = options.series.concat(transformed.series);
					options.legend = transformed.legend;
					break;
				case 'seq':
					graphTypes.push('echarts/chart/bar'); // TODO: make it dynamic
					graphTypes.push('echarts/chart/line');
					var transformed = self.buildOptionsFromSingleSeq(measurements, selections[selection]);
					options.xAxis = options.xAxis.concat(transformed.xAxis);
					options.yAxis = options.yAxis.concat(transformed.yAxis);
					options.series = options.series.concat(transformed.series);
					options.legend = transformed.legend;
					break;
				default:
			}
		});

		return { graphTypes: graphTypes, options: options };
	};

	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
		module.exports = GraphUtils;
	else
		window.GraphUtils = GraphUtils;

  if(!String.prototype.toUpperFirst) String.prototype.toUpperFirst = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  }

})(typeof module === 'undefined' ? undefined : module);