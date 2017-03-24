import React from 'react';
import Segment from '../../services/segment.service.js';
import { connect } from 'react-redux';
import { writeConfigFile } from '../../actions';
import { HelpCenter, SendMessage } from '../generic/support-links';

const EmailIntro = ({
  email,
  onSkipEmail,
  onEmailSubmit
}) => {
  let nameInput;

  const submit = (e) => {
    e.preventDefault();
    onEmailSubmit(nameInput.value)
  };

  const containerStyles = {
    display: !email ? 'block' : 'none'
  };

  return (
    <div className="EmailIntro" style={containerStyles}>
      <div className="">
        <div className="email-panel">
          <div className="panel panel-default">
            <div className="panel-body text-center">
              <div><img className="email-logo" src="images/logo.png"/></div>
              <p className="lead">Thank you for downloading ReQLPro.</p>
              <p> To continue, please register for free by providing your email below.</p>
              <div className="row">
                <form onSubmit={submit}>
                  <div className="col-xs-10 col-xs-offset-1 text-center">
                    <div className="input-group">
                      <input type="text" className="form-control" id="email" placeholder="Email" ref={(input) => {
                        nameInput = input;
                        if (nameInput) {
                          nameInput.focus();
                        }
                      }}/>
                      <div className="input-group-btn">
                        <button className="btn btn-primary" type="submit">
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <p className="col-xs-10 col-xs-offset-1 text-center email-built-by">ReQLPro was built with <i className="fa fa-heart"/> by <a
                href="http://www.codehangar.io" target="_blank">Code Hangar, Inc.</a>
                <span className="email-skip-btn" onClick={onSkipEmail}>Skip</span>
              </p>
            </div>
            <div className="panel-footer text-center">
              Have a question? Visit our <HelpCenter/> or <SendMessage/>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    email: state.main.email
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSkipEmail: () => {
      dispatch({
        type: "SET_EMAIL",
        email: 'none',
        created: new Date().toDateString()
      });
    },
    onEmailSubmit: (email) => {
      dispatch({
        type: "SET_EMAIL",
        email,
        created: new Date().toDateString()
      });
      dispatch(writeConfigFile());

      Segment.alias(email);

      Segment.identify({
        userId: email,
        traits: {
          email: email,
          created: new Date().toDateString()
        }
      });

      Segment.track({
        event: 'Add Email',
        properties: {
          email: email
        }
      });

    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmailIntro);
