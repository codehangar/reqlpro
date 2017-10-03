const GenericConnectionError = (props) => {
  return (
    <div>
      <p className="super-large-text">Oops!</p>
      <pre className="text-danger">{props.text}</pre>
      <p className="small-text">
        Still having trouble? Visit our <HelpCenter/> or <SendMessage/>.
      </p>
    </div>
  );
};

export default GenericConnectionError;
