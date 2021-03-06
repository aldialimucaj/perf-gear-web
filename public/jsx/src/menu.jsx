var netUtils = new NetUtils();

// ============================================================================
var CollectionItem = React.createClass({
	render: function() {
		return (<div className="item" data-value={this.props.key}>{this.props.name}</div>);
	}
});

// ============================================================================
var CollectionDD = React.createClass ({
	mixins: [Reflux.connect(collectionStore,"collection")],
	collectionItems: null,
	
	componentDidMount() {
		CollectionActions.getCollectionList();
		this.init();
	},

	componentDidUpdate: function() {
		this.init();
		this.collectionItems = this.state.collection.list.map(function (item, k) {
        	return (
          		<CollectionItem key={k} name={item}/>
        	);
      	});
		$('#collectionList').dropdown('set selected', this.state.collection.current);
	
	},
	
	handleChange: function (text, value) {
    	CollectionActions.setCurrentCollection(value);
  	},

	
	init: function() {
		let self = this;
		// semantic-ui
		$('#collectionList').dropdown({
			onChange: function(text, value, $selectedItem) {
        		if(text !== self.state.collection.current) self.handleChange(text, value);
      		}
		});
			  
	},
	
	render() {
		return (
		<div id="collectionList" className="ui floating basic dropdown labeled search icon button">
			<i className="database icon"></i>
			<span className="text">Select Collection</span>
			<div className="menu">
				{this.collectionItems}
			</div>
		</div>
		)
	}
});

// ============================================================================
var MenuBox = React.createClass ({
	mixins: [Reflux.connect(collectionStore,"collection")],
	
	render: function() {
		let measurementsHref = "/measurements";
		return (
		<div className="ui menu">
			<a href="/" className="item"><i className="home icon"></i>Home</a>
			<a href={measurementsHref} className="item"><i className="bar chart icon"></i>Measurements</a>
			<a href="/analytics" className="item"><i className="bar cubes icon"></i>Analytics</a>
			<a href="/charts" className="item"><i className="pie chart icon"></i>Charts</a>
			<div className="right menu">
				<div className="right item"><CollectionDD /></div>
				<a href="/help" className="right item"><i className="setting icon"></i></a>
				<a href="/help" className="right item"><i className="help circle icon"></i></a>
			</div>
		</div>
		)
	}
});

// ============================================================================
React.render(
  <MenuBox />,
  document.getElementById('menu')
);
