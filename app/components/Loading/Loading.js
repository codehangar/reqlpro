import React from 'react';

const Loading = ({}) => {
  return (
    <div className="explorer-container">
      <div className="explorer-loading">
        <span className="fa fa-refresh fa-spin"/>
        <p>Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
