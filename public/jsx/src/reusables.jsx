var JsonPreview = React.createClass({
  render: function() {
    var preview = this.props.data ? JSON.stringify(this.props.data, null, 2) : "#empty";
    return (
      <div className="ui styled accordion full-width">
        <div className="title">
          <i className="dropdown icon"></i>
          JSON content
        </div>
        <div className="active content">
          <pre><code className="json">{preview}</code></pre>
        </div>
      </div>
    );
  }
});

// ============================================================================
var PaginationItem = React.createClass({
  
  handlePageChange: function(e) {
    let pageIdx = Math.abs(e.currentTarget.text);
    this.props.actionStore.setPage(pageIdx);
  },
  
  render: function() {
    let classes = ['item'];
    if(this.props.charts.page == this.props.index) {
      classes.push('active');
    }
    return(<a className={classes.join(' ')} onClick={this.handlePageChange}>{this.props.index}</a>)
  }
});

// ============================================================================
var TablePagination = React.createClass({
  paginationItems: [],
  maxPaginationSide: 5,
  
  handlePrevPageChange: function() {
    let page = --this.props.config.page;
    page = (page > 0) ? page : 1;
    ChartsActions.setPage(page);
  },
  
  handleNextPageChange: function() {
    let page = ++this.props.config.page;
    page = page > this.props.config.pages? this.props.config.pages: page;
    ChartsActions.setPage(page);
  },
  
  createPageIndexes: function() {
    var items = [];
    let pages = this.props.config.pages;
    let current = this.props.config.page<=pages?this.props.config.page:pages;
    
    let leftLowBound = (current > 1) ? current - 1: current;
    let leftUpBound = (this.maxPaginationSide + current) - 1;
    leftUpBound = leftUpBound <= pages? leftUpBound: pages;
    
    let rightLowBound = (pages - this.maxPaginationSide) + current;
    let rightUpBound = pages;
    
    if(pages <= this.maxPaginationSide * 2) {
      for(let i = 1; i <= pages; i++) {
        items.push(<PaginationItem actionStore={this.props.actionStore} charts={this.props.config} key={i} index={i}/>);
      }
    } else {
      for(let i = leftLowBound; i <= leftUpBound; i++) {
        items.push(<PaginationItem actionStore={this.props.actionStore} charts={this.props.config} key={i} index={i}/>);
      }
      
      items.push(<a key="none" className="disabled item">...</a>);
      
      for(let i = rightLowBound ; i <= rightUpBound; i++) {
        items.push(<PaginationItem actionStore={this.props.actionStore} charts={this.props.config} key={i} index={i}/>);
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