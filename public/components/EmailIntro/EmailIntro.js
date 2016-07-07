const React = require('react');
const classNames = require('classnames');
const Segment = require('../../services/segment.service');

const ConnectionForm = React.createClass({
  getInitialState: function() {
    return {
      store: this.context.store,
      email: this.context.store.userConfig.email,
      isValid: false,
      show: this.context.store.router.EmailIntro.show
    };
  },
  componentDidMount: function() {
    this.setupEvents();
  },
  setupEvents: function() {
    const updateState = () => {
      this.setState({
        show: this.context.store.router.EmailIntro.show
      });
    }

    this.state.store.on('updateRehinkDbClient', () => {
      updateState();
    });
    this.state.store.on('showConnectionForm', () => {
      updateState();
    });
    this.state.store.on('hideConnectionForm', () => {
      updateState();
    });
  },
  handleTextChange: function(key, e) {
    this.setState({
      email: e.target.value
    });
  },

  handleValidation: function() {
    this.setState({
      isValid: true
    });
  },
  handleSubmit: function(e) {
    e.preventDefault();
    this.handleValidation();
    if (this.state.email) {
      // Save email turn off form
      this.state.store.addEmail(this.state.email);

      Segment.alias(this.state.email);

      Segment.identify({
        userId: this.state.email,
        traits: {
          email: this.state.email
        }
      });

      Segment.track({
        event: 'email.add',
        properties: {
          email: this.state.email
        }
      });

      // this.state.store.hideConnectionForm();
    }
  },
  render: function() {
    var containerStyles = {
      display: this.state.show ? 'block' : 'none'
    };

    // Validation Classes
    const inputValidationClasses = {
      email: classNames({
        'form-group': true,
        'has-error': !this.state.email
      })
    };

    let deleteButton = '';
    if (this.state.action === 'Edit') {
      deleteButton = <button type="delete" className="btn btn-default" onClick={this.handleDelete}>Delete</button>
    }

    return (
      <div className="EmailIntro" style={containerStyles}>
         <div className="">
         <div className="email-panel">
            <div className="panel panel-default">
              <div className="panel-body text-center">
                <div><img className="email-logo" src="images/logo.png"/></div>
                <p className="lead">Thank you for trying ReQLPro.</p>
                <p> To continue, please register for free by providing your email below.</p>
                <div className="row">
                  <form onSubmit={this.handleSubmit}>
                    <div className="col-xs-10 col-xs-offset-1 text-center">
                      <div className={inputValidationClasses.port}>
                        <input type="text" className="form-control" id="email" placeholder="Email" onChange={this.handleTextChange.bind(this, 'email')} />
                      </div>
                    </div>
                  </form>
                </div>
                <p className="email-built-by">ReQLPro was built with <i className="fa fa-heart"/> by <a href="http://www.codehangar.io" target="_blank">Code Hangar, Inc.</a></p>
              </div>
              <div className="panel-footer text-center">
                Have a question? Visit our <a href="http://utils.codehangar.io/rethink/support" target="_blank">Help Center</a> or <a onClick={function() { HS.beacon.open(); }}>send us a message</a>.
              </div>
            </div>
         </div>
         
          
          
         </div>
      </div>
    );
  }
});
ConnectionForm.contextTypes = {
  store: React.PropTypes.object
};

module.exports = ConnectionForm;
