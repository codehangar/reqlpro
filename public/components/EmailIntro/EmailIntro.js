const React = require('react');
const classNames = require('classnames');
const Segment = require('../../services/segment.service');
import {connect} from 'react-redux';

const ConnectionForm = ({
  email,
  onEmailSubmit
}) => {
    let input;

    var containerStyles = {
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
                  <form>
                    <div className="col-xs-10 col-xs-offset-1 text-center">
                        <div className="input-group">
                          <input
                            ref={node => { input = node; }} 
                            type="text" 
                            className="form-control" 
                            id="email" 
                            placeholder="Email" />
                            <span className="input-group-btn">
                              <button 
                                className="btn btn-primary" 
                                type="button" 
                                onClick={() => {onEmailSubmit(input.value)} }>Submit</button>
                            </span>
                          </div>
                      </div>
                  </form>
                </div>
                <p className="email-built-by">ReQLPro was built with <i className="fa fa-heart"/> by <a href="http://www.codehangar.io" target="_blank">Code Hangar, Inc.</a></p>
              </div>
              <div className="panel-footer text-center">
                Have a question? Visit our <a href="http://utils.codehangar.io/rethink/support" target="_blank">Help Center</a> or <a className="cursor-pointer" onClick={function() { HS.beacon.open(); }}>send us a message</a>.
              </div>
            </div>
         </div>
         </div>
      </div>
    );
};

function mapStateToProps(state) {
  // console.log('EmailIntro', state)
  return {
    email: state.main.userConfig.email
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    onEmailSubmit: (email) =>{
      dispatch({
        type: "SET_EMAIL",
        email
      })
    }
  }
};

const ConnectionFormContainer = connect(mapStateToProps, mapDispatchToProps)(ConnectionForm);

module.exports = ConnectionFormContainer;
