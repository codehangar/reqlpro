import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { refreshExplorerBody } from '../../../actions';

const FilterPredicate = ({
  table,
  setFilterPredicate
}) => {
  let predInput;
  const submit = (e) => {
    e.preventDefault();
    setFilterPredicate(predInput.value);
  };
  return (
    <div className="filter-predicate">
      <form onSubmit={submit}>
        <span className="predicate-opener">.filter(</span>
        <input className="form-control input-code" type="text"
               value={table.filterPredicate}
               ref={input => predInput = input}/>
        <span className="predicate-closer">)</span>
      </form>
    </div>
  );
};

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
      dispatch(refreshExplorerBody());

      // Segment.track({
      //   event: 'explorer.setFilterPredicate',
      //   properties: {}
      // });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterPredicate);
