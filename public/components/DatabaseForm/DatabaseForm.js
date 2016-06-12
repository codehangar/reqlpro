const React = require('react');
const classNames = require('classnames');

const DatabaseForm = React.createClass({
  getInitialState: function() {
    return {
      store: this.context.store,
      name: {
        valid: true,
        value: ''
      }
    };
  },
  handleTextChange: function(key, e) {
    let updatedField = {};
    updatedField[key] = {
      value: e.target.value,
      valid: this.state[key].valid
    };
    this.setState(updatedField);
  },
  handleCancel: function() {
    this.state.store.toggleDatabaseForm();
  },
  handleSubmit: function(e) {
    if(e.keyCode === 13 || e.keyCode === undefined) {
      e.preventDefault();
      if(this.state.name.value !== '') {
        this.saveDatabase(this.state.name.value);
      } else {
        this.setState({
          name: {
            value: this.state.name.value,
            valid: false
          }
        });
      }
    }
  },
  saveDatabase: function(name) {
    // Lets save database for this connection
    this.state.store.saveDatabase(name).then(() => {
      this.setState({
        name: {
          value: '',
          valid: true
        }
      });
    }).catch((err) => {
      console.log(err);
    });
  },
  render: function() {
    const classes = {
      databaseForm: classNames(
        'databaseForm',
        {
          'show': this.state.store.router.databaseForm.show,
          'hidden': !this.state.store.router.databaseForm.show
        }
      ),
      name: classNames({
        'form-group': true,
        'has-error': !this.state.name.valid
      })
    };
    return (
      <div className={classes.databaseForm}>
        <div className="panel panel-default">
          <div className="panel-heading">
            <strong>Add Database</strong>
          </div>
          <div className="panel-body">
            <div className="row">
              <div className="col-sm-12">
                <form onKeyDown={this.handleSubmit}>
                  <div className={classes.name}>
                    <label htmlFor="name">Database Name</label>
                    <input type="text" className="form-control" id="name" placeholder="Database Name" value={this.state.name.value} onChange={this.handleTextChange.bind(this, 'name')} />
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="panel-footer">
            <button type="submit" className="btn btn-primary pull-right" onClick={this.handleSubmit}>Add Database</button>
            <button type="cancel" className="btn btn-default pull-left" onClick={this.handleCancel}>Cancel</button>
            <div className="clearfix"/>
          </div>
        </div>
      </div>
    );
  }
});

DatabaseForm.contextTypes = {
  store: React.PropTypes.object
};

module.exports = DatabaseForm;
