import React from 'react';
import { HelpCenter, SendMessage } from '../generic/support-links';

const ReEnterPasswordExplorerMessage = ({}) => {
  return (
    <div>
        <p className="super-large-text">Connected!</p>
        <p className="">Start browsing your data by clicking on a database.</p>
        <p className="small-text">
          Having trouble? Visit our <HelpCenter/> or <SendMessage/>.
        </p>
    </div>
  );
};

export default ReEnterPasswordExplorerMessage;
