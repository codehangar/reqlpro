import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { refreshExplorerBody } from '../../../actions';
import { shell } from 'electron';
import Segment from '../../../services/segment.service.js';

class FilterPredicate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: ((props.table.query.filterPredicate.length * 7.8) + 50) + 'px'
    };
  }

  setWidth(val) {
    const width = ((val.length * 7.8) + 50) + 'px';
    this.setState({ width });
  }

  componentWillReceiveProps(props) {
    if (props.table.query.filterPredicate) {
      this.setWidth(props.table.query.filterPredicate);
    }
  }

  componentDidMount() {
    this.predInput.focus();
  }

  onChange = (e) => {
    this.setWidth(e.target.value);
    this.props.setFilterPredicate(e.target.value);
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.props.submit(this.predInput.value);
  };

  filterHelpClick() {
    shell.openExternal('https://www.rethinkdb.com/api/javascript/filter/');
    Segment.track({
      event: 'query.filter',
      properties: {
        action: "help"
      }
    });
  }

  render() {
    const { table } = this.props;
    return (
      <span className="filter-predicate">
        <form onSubmit={this.onSubmit}>
          <span className="predicate-opener">.filter(</span>
          <input className="input-code" type="text" style={{ width: this.state.width }}
                 value={table.query.filterPredicate}
                 onChange={this.onChange}
                 ref={input => this.predInput = input}
          />
          <span className="predicate-closer">)
            <span className="filter-help-icon">
              <i className="fa fa-info-circle clickable" onClick={this.filterHelpClick}/>
            </span>
          </span>

        </form>

      </span>
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
      Segment.track({
        event: 'table.query',
        properties: {
          type: "filter"
        }
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterPredicate);
