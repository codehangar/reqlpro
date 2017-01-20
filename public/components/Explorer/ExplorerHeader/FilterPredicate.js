import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { refreshExplorerBody } from '../../../actions';
const shell = window.nodeRequire('electron').shell;

class FilterPredicate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: '100px'
    };
  }

  componentDidMount() {
    this.predInput.focus();
  }

  onChange = (e) => {
    const len = e.target.value.length;
    const width = ((len * 7.24) + 70) + 'px';
    this.setState({ width });
    this.props.setFilterPredicate(e.target.value);
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.props.submit(this.predInput.value);
  };

  filterHelpClick() {
    shell.openExternal('https://www.rethinkdb.com/api/javascript/filter/');
  }

  render() {
    const { table } = this.props;
    return (
      <div className="filter-predicate" style={{ width: this.state.width }}>
        <form onSubmit={this.onSubmit}>
          <span className="predicate-opener">.filter(</span>
          <input className="form-control input-code" type="text"
                 value={table.filterPredicate}
                 onChange={this.onChange}
                 ref={input => this.predInput = input}
          />
          <span className="predicate-closer">)</span>
        </form>
        <span className="filter-help-icon">
          <i className="fa fa-info-circle clickable" onClick={this.filterHelpClick}/>
        </span>
      </div>
    )
  }
}

FilterPredicate.propTypes = {
  table: PropTypes.object
};


const mapStateToProps = (state) => {
  return {
    table: state.main.selectedTable
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setFilterPredicate: (filterPredicate) => {
      dispatch({
        type: "SET_FILTER_PREDICATE",
        filterPredicate
      });
    },
    submit: (filterPredicate) => {
      dispatch(refreshExplorerBody());
      // Segment.track({
      //   event: 'explorer.setFilterPredicate',
      //   properties: {}
      // });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterPredicate);
