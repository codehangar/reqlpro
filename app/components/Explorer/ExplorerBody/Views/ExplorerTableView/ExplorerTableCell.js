import React from 'react';
import { RIEInput, RIENumber } from 'riek';

const ExplorerTableCell = ({
  row,
  fieldName,
  rowChanged
}) => {
  const dataChangedString = function(data, f) {
    rowChanged(row, Object.assign({}, row, data));
  };
  const dataChangedNumber = function(data, f) {
    rowChanged(row, Object.assign({}, row, { [fieldName]: parseFloat(data[fieldName]) }));
  };

  const composeCellBody = function(row, fieldName) {
    const data = row[fieldName];

    if (typeof data === 'string') {
      return <RIEInput value={data} change={dataChangedString} propName={fieldName}
                       shouldBlockWhileLoading={true} className="inline-edit"
                       classLoading="loading-cell" classEditing="form-control"/>;
    } else if (typeof data === 'number') {
      return <RIENumber value={data + ''} change={dataChangedNumber} propName={fieldName}
                        shouldBlockWhileLoading={true} className="inline-edit"
                        classLoading="loading-cell" classEditing="form-control"/>;
    } else if (typeof data === 'undefined') {
      return <RIEInput value={''} change={dataChangedString} propName={fieldName} shouldBlockWhileLoading={true}
                       classLoading="loading-cell" classEditing="form-control" className="empty-cell"/>;
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
