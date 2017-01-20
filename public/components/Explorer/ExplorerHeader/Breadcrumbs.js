import React, { PropTypes } from 'react';

const Breadcrumbs = ({ connection, table }) => {

  const userCrumb = <span className="badge" style={{marginRight: '10px'}}><i className="fa fa-user"/> {connection.user || 'admin'} </span>;
  const dbCrumb = <span><i className="fa fa-database"/> {table.databaseName} </span>;
  const tableCrumb = <span><i className="fa fa-table"/> {table.name} </span>;

  let actionCrumb;
  if (table.type === 'code') {
    if (table.codeAction === 'update') {
      actionCrumb = <span><i className="fa fa-angle-right"/> Edit (Replace)</span>;
    }
    if (table.codeAction === 'add') {
      actionCrumb = <span><i className="fa fa-angle-right"/> Insert</span>;
    }
  }

  return (
    <div className="breadcrumb-text-container">
      {userCrumb}
      {dbCrumb}
      <i className="fa fa-angle-right"/>
      {tableCrumb}
      {actionCrumb}
    </div>
  );
};

Breadcrumbs.propTypes = {
  database: PropTypes.object,
  table: PropTypes.object
};

export default Breadcrumbs;
