"use strict";

var pgUtils = new PGUtils();

var CollectionItem = React.createClass({
	displayName: "CollectionItem",

	render: function render() {
		return React.createElement(
			"div",
			{ className: "item", "data-value": this.props.key },
			this.props.name
		);
	}
});

var CollectionDD = React.createClass({
	displayName: "CollectionDD",

	mixins: [Reflux.connect(collectionStore, "collection")],
	collectionItems: null,

	componentDidMount: function componentDidMount() {
		CollectionActions.getCollectionList();
		this.init();
	},

	componentDidUpdate: function componentDidUpdate() {
		this.init();
		this.collectionItems = this.state.collection.list.map(function (item, k) {
			return React.createElement(CollectionItem, { key: k, name: item });
		});
		$('#collectionList').dropdown('set selected', this.state.collection.current);
	},

	handleChange: function handleChange(text, value) {
		CollectionActions.setCurrentCollection(value);
	},

	init: function init() {
		var self = this;
		// semantic-ui
		$('#collectionList').dropdown({
			onChange: function onChange(text, value, $selectedItem) {
				if (text !== self.state.collection.current) self.handleChange(text, value);
			}
		});
	},

	render: function render() {
		return React.createElement(
			"div",
			{ id: "collectionList", className: "ui floating basic dropdown labeled search icon button" },
			React.createElement("i", { className: "database icon" }),
			React.createElement(
				"span",
				{ className: "text" },
				"Select Collection"
			),
			React.createElement(
				"div",
				{ className: "menu" },
				this.collectionItems
			)
		);
	}
});

var MenuBox = React.createClass({
	displayName: "MenuBox",

	mixins: [Reflux.connect(collectionStore, "collection")],

	render: function render() {
		var measurementsHref = "/measurements";
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
				{ href: measurementsHref, className: "item" },
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
				"a",
				{ href: "/charts", className: "item" },
				React.createElement("i", { className: "pie chart icon" }),
				"Charts"
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
					React.createElement("i", { className: "setting icon" })
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