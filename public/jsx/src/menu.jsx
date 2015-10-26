var CollectionDD = React.createClass ({
	componentDidMount() {
		CollectionActions.getCollectionList();
		this.init();
	},

	componentDidUpdate: function() {
		this.init();
	},
	
	init: function() {
		// semantic-ui
		$('#collectionList').dropdown();
	},
	
	render() {
		return (
		<div id="collectionList" className="ui floating dropdown labeled search icon button">
			<i className="database icon"></i>
			<span className="text">Select Collection</span>
			<div className="menu">
				<div className="item">default</div>
			</div>
		</div>
		)
	}
});


var MenuBox = React.createClass ({
	mixins: [Reflux.connect(collectionStore,"collection")],
	
	render: function() {
		return (
		<div className="ui menu">
			<a href="/" className="item"><i className="home icon"></i>Home</a>
			<a href="/measurements" className="item"><i className="bar chart icon"></i>Measurements</a>
			<a href="/analytics" className="item"><i className="bar cubes icon"></i>Analytics</a>
			<div className="right menu">
			<div className="right item"><CollectionDD /></div>
			<a href="/help" className="right item"><i className="help circle icon"></i></a>
			</div>
		</div>
		)
	}
});

React.render(
  <MenuBox />,
  document.getElementById('menu')
);
