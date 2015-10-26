"use strict";

var CollectionDD = React.createClass({
	displayName: "CollectionDD",

	componentDidMount: function componentDidMount() {
		CollectionActions.getCollectionList();
		this.init();
	},

	componentDidUpdate: function componentDidUpdate() {
		this.init();
	},

	init: function init() {
		// semantic-ui
		$('#collectionList').dropdown();
	},

	render: function render() {
		return React.createElement(
			"div",
			{ id: "collectionList", className: "ui floating dropdown labeled search icon button" },
			React.createElement("i", { className: "database icon" }),
			React.createElement(
				"span",
				{ className: "text" },
				"Select Collection"
			),
			React.createElement(
				"div",
				{ className: "menu" },
				React.createElement(
					"div",
					{ className: "item" },
					"default"
				)
			)
		);
	}
});

var MenuBox = React.createClass({
	displayName: "MenuBox",

	mixins: [Reflux.connect(collectionStore, "collection")],

	render: function render() {
		return React.createElement(
			"div",
			{ className: "ui menu" },
			React.createElement(
				"a",
				{ href: "/", className: "item" },
				React.createElement("i", { className: "home icon" }),
				"Home"
			),
			React.createElement(
				"a",
				{ href: "/measurements", className: "item" },
				React.createElement("i", { className: "bar chart icon" }),
				"Measurements"
			),
			React.createElement(
				"a",
				{ href: "/analytics", className: "item" },
				React.createElement("i", { className: "bar cubes icon" }),
				"Analytics"
			),
			React.createElement(
				"div",
				{ className: "right menu" },
				React.createElement(
					"div",
					{ className: "right item" },
					React.createElement(CollectionDD, null)
				),
				React.createElement(
					"a",
					{ href: "/help", className: "right item" },
					React.createElement("i", { className: "help circle icon" })
				)
			)
		);
	}
});

React.render(React.createElement(MenuBox, null), document.getElementById('menu'));