const ConnectedExplorerMessage = ({}) => {
  return (
    <span>
        <p className="super-large-text">Connected!</p>
        <p className="">Start browsing your data by clicking on a database.</p>
        <p className="small-text">
          Having trouble? Visit our <HelpCenter/> or <SendMessage/>.
        </p>
    </span>
  );
};

export default ConnectedExplorerMessage;
