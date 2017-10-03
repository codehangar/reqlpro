const StartLogo = ({}) => {
  return (
    <span>
          <div><img className="start-logo" src={logo}/></div>
          <h2>No database connections added.</h2>
          <p>Click the <strong>"+"</strong> to add a RethinkDB connection.</p>
        </span>
  );
};

export default StartLogo;
