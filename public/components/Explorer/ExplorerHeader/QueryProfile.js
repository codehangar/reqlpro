import React, { PropTypes } from 'react';

const QueryProfile = ({ lastResult }) => {

  let queryProfile;
  if (lastResult && lastResult.profile) {
    queryProfile = '[' + lastResult.profile[0].description + ' - ';
    queryProfile += lastResult.profile[0]['duration(ms)'] + 'ms]';
  }

  return (
    <div className="query-profile" style={{ marginLeft: '20px' }}>
      {queryProfile}
    </div>
  );
};

QueryProfile.propTypes = {
  lastResult: PropTypes.object
};

export default QueryProfile;
