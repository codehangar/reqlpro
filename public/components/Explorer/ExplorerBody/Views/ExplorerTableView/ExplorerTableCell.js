import React from 'react';
import { RIEInput, RIENumber } from 'riek'

const ExplorerTableCell = ({
  row,
  fieldName,
  rowChanged
}) => {
  const dataChanged = function(data) {
    rowChanged(row, Object.assign({}, row, data));
  };

  const composeCellBody = function(row, fieldName) {
    const data = row[fieldName];

    if (typeof data === 'string') {
      return <RIEInput value={data} change={dataChanged} propName={fieldName} shouldBlockWhileLoading={true}
                       classLoading="loading-cell" classEditing="form-control"/>;
    } else if (typeof data === 'number') {
      return <RIENumber value={data} change={dataChanged} propName={fieldName} shouldBlockWhileLoading={true}
                        classLoading="loading-cell" classEditing="form-control"/>;
    } else {
      if (data) {
        if (Object.keys(data).length) {
          return '{Object ...}';
        } else {
          return JSON.stringify(data);
        }
      } else {
        return JSON.stringify(data);
      }
    }
  };

  return (
    <div>
      {composeCellBody(row, fieldName)}
    </div>
  );
};

export default ExplorerTableCell;
