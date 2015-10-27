var pgUtils = new PGUtils();

var PaginationItem = React.createClass({
  
  handlePageChange: function(e) {
    let pageIdx = Math.abs(e.currentTarget.text);
    MeasurementsActions.setPage(pageIdx);
  },
  
  render: function() {
    let classes = ['item'];
    if(this.props.measurements.page == this.props.index) {
      classes.push('active');
    }
    return(<a className={classes.join(' ')} onClick={this.handlePageChange}>{this.props.index}</a>)
  }
});

var MeasurementTablePagination = React.createClass({
  mixins: [Reflux.connect(measurementsStore,"measurements")],
  paginationItems: [],
  maxPaginationSide: 5,
  
  handlePrevPageChange: function() {
    let page = --this.state.measurements.page;
    page = (page > 0) ? page : 1;
    MeasurementsActions.setPage(page);
  },
  
  handleNextPageChange: function() {
    let page = ++this.state.measurements.page;
    page = page > this.state.measurements.pages? this.state.measurements.pages: page;
    MeasurementsActions.setPage(page);
  },
  
  createPageIndexes: function() {
    var items = [];
    let pages = this.state.measurements.pages;
    let current = this.state.measurements.page<=pages?this.state.measurements.page:pages;
    
    let leftLowBound = (current > 1) ? current - 1: current;
    let leftUpBound = (this.maxPaginationSide + current) - 1;
    leftUpBound = leftUpBound <= pages? leftUpBound: pages;
    
    let rightLowBound = (pages - this.maxPaginationSide) + current;
    let rightUpBound = pages;
    
    if(pages <= this.maxPaginationSide * 2) {
      for(let i = 1; i <= pages; i++) {
        items.push(<PaginationItem measurements={this.state.measurements} key={i} index={i}/>);
      }
    } else {
      for(let i = leftLowBound; i <= leftUpBound; i++) {
        items.push(<PaginationItem measurements={this.state.measurements} key={i} index={i}/>);
      }
      
      items.push(<a key="none" className="disabled item">...</a>);
      
      for(let i = rightLowBound ; i <= rightUpBound; i++) {
        items.push(<PaginationItem measurements={this.state.measurements} key={i} index={i}/>);
      }
    }
    
    
    return items;
  },
  
  render: function() {
    this.paginationItems = this.createPageIndexes();
        
    return (
      <tfoot>
        <tr>
          <th colSpan="2">
          <div className="ui right floated pagination menu">
            <a className="icon item">
              <i className="left chevron icon" onClick={this.handlePrevPageChange}></i>
            </a>
            
            {this.paginationItems}
            
            <a className="icon item">
              <i className="right chevron icon" onClick={this.handleNextPageChange}></i>
            </a>
          </div>
          </th>
      </tr>
      </tfoot>
    );
  }
});

var MeasurementNode = React.createClass({
  mixins: [Reflux.connect(collectionStore,"collection")],
  
  render: function() {
    let shortId = this.props.data.id.substr(-7);
    let itemHref = "/measurements/"+this.state.collection.current+"/"+this.props.data.id;
    return (
      <tr>
        <td><a href={itemHref}>{shortId}</a></td>
        <td>{this.props.data.path}</td>
      </tr>
    );
  }
});


var MeasurementTable = React.createClass({
  mixins: [Reflux.connect(measurementsStore,"measurements")],
  measurementNodes: [],
  
  render: function() {
    if(this.state.measurements.data) {
      this.measurementNodes = this.state.measurements.data.map(function (measurement) {
        return (
          <MeasurementNode key={measurement.id} data={measurement}/>
        );
      });
    }

    return (
      <div className="measurementTable">
        <table className="ui celled striped table">
          <thead>
            <tr>
              <th>#ID</th>
              <th>Path</th>
            </tr>
          </thead>
        <tbody>
          {this.measurementNodes}
        </tbody>
        </table>
        <MeasurementTablePagination />
      </div>
    );
  }
});


var MeasurementBox = React.createClass({
  mixins: [Reflux.connect(collectionStore,"collection"), Reflux.connect(measurementsStore,"measurements")],

  componentDidMount: function() {
    MeasurementsActions.getMeasurements(this.state.collection.current, 0, this.state.measurements.limit);
    MeasurementsActions.getMeasurementsCount(this.state.collection.current);
  },

  render: function() {
    return (
      <div className="measurementBox">
        <MeasurementTable />
      </div>
    );
  }
});

// Render
React.render(
  <MeasurementBox />,
  document.getElementById('content')
);
