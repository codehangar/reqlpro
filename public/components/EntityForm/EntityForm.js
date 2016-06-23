const React = require('react');
const classNames = require('classnames');

const EntityForm = React.createClass({
  getInitialState: function() {
    return {
      store: this.context.store
    };
  },
  handleTextChange: function(key, e) {
    this.state.store.router.EntityForm.formElems[key].value = e.target.value;
    this.setState(this.state.store);
  },
  handleCancel: function() {
    this.state.store.toggleEntityForm();
    this.resetState();
  },
  handleSubmit: function(e) {
    if(e.keyCode === 13 || e.keyCode === undefined) {
      e.preventDefault();
      if(this.state.store.router.EntityForm.formElems.name.value !== '') {
        if(this.state.store.router.EntityForm.action === 'Delete') {
          if(this.state.store.router.EntityForm.toDeleteName === this.state.store.router.EntityForm.formElems.name.value) {
            this.saveForm(this.state.store.router.EntityForm.formElems.name.value);
          } else {
            this.state.store.router.EntityForm.errMessage = 'This name doesn\'t match the name of the ' + this.state.store.router.EntityForm.type +  ' you\'re trying to delete.';
            this.setState(this.state.store);
          }
        } else {
          this.saveForm(this.state.store.router.EntityForm.formElems.name.value);
        }
      } else {
        this.setState({
          name: {
            value: this.state.store.router.EntityForm.formElems.name.value,
            valid: false
          }
        });
      }
    }
  },
  saveForm: function(name) {
    if(this.state.store.router.EntityForm.action === 'Add') {
      // Lets save entity for this connection
      switch (this.state.store.router.EntityForm.type) {
        case 'Database':
          this.state.store.saveDatabase(name).then(() => {
            this.resetState();
          }).catch((err) => {
            this.state.store.router.EntityForm.errMessage = err.msg;
            this.setState(this.state.store);
          });
          break;
        case 'Table':
          this.state.store.saveTable(name).then(() => {
            this.resetState();
          }).catch((err) => {
            this.state.store.router.EntityForm.errMessage = err.msg;
            this.setState(this.state.store);
          });
          break;
        default:
          break;
      }
    }
    if(this.state.store.router.EntityForm.action === 'Edit') {
      // Lets edit entity for this connection
    }
    if(this.state.store.router.EntityForm.action === 'Delete') {
      // Lets delete entity for this connection
      switch (this.state.store.router.EntityForm.type) {
        case 'Database':
          this.state.store.deleteDatabase(name).then(() => {
            this.resetState();
          }).catch((err) => {
            console.log(err);
          });
          break;
        case 'Table':
          this.state.store.deleteTable(name).then(() => {
            this.resetState();
          }).catch((err) => {
            console.log(err);
          });
          break;
        default:
          break;
      }
    }
  },
  resetState: function() {
    this.setState({
      name: {
        value: '',
        valid: true
      },
      errMessage: ''
    });
  },
  render: function() {
    const classes = {
      EntityForm: classNames(
        'EntityForm',
        {
          'show': this.state.store.router.EntityForm.show,
          'hidden': !this.state.store.router.EntityForm.show
        }
      ),
      name: classNames({
        'form-group': true,
        'has-error': !this.state.store.router.EntityForm.formElems.name.valid
      }),
      deleteDatabaseWarning: classNames(
        'alert',
        'alert-warning',
        {
          'show': this.state.store.router.EntityForm.action === 'Delete' && this.state.store.router.EntityForm.type === 'Database',
          'hidden': this.state.store.router.EntityForm.action !== 'Delete' || this.state.store.router.EntityForm.type !== 'Database'
        }
      ),
      deleteTableWarning: classNames(
        'alert',
        'alert-warning',
        {
          'show': this.state.store.router.EntityForm.action === 'Delete' && this.state.store.router.EntityForm.type === 'Table',
          'hidden': this.state.store.router.EntityForm.action !== 'Delete' || this.state.store.router.EntityForm.type !== 'Table'
        }
      ),
      deleteDatabaseValidationError: classNames(
        'alert',
        'alert-danger',
        {
          'show': this.state.store.router.EntityForm.errMessage !== '',
          'hidden': this.state.store.router.EntityForm.errMessage === ''
        }
      )
    };
    return (
      <div className={classes.EntityForm}>
        <div className="panel panel-default">
          <div className="panel-heading">
            <strong>{this.state.store.router.EntityForm.action} {this.state.store.router.EntityForm.type}</strong>
          </div>
          <div className="panel-body">
            <div className="row">
              <div className="col-sm-12">
                <form onKeyDown={this.handleSubmit}>
                  <p className={classes.deleteDatabaseValidationError}>
                    {this.state.store.router.EntityForm.errMessage}
                  </p>
                  <p className={classes.deleteDatabaseWarning}>
                    Deleting the database will delete all the tables in it.
                    This action <strong>cannot</strong> be undone. Please type in the name of the database to confirm.
                  </p>
                  <p className={classes.deleteTableWarning}>
                    This action <strong>cannot</strong> be undone. Please type in the name of the table to confirm.
                  </p>
                  <div className={classes.name}>
                    <label htmlFor="name">{this.state.store.router.EntityForm.type} Name</label>
                    <input type="text" className="form-control" id="name" placeholder={this.state.store.router.EntityForm.type + ' Name'} value={this.state.store.router.EntityForm.formElems.name.value} onChange={this.handleTextChange.bind(this, 'name')} />
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="panel-footer">
            <button type="submit" className="btn btn-primary pull-right" onClick={this.handleSubmit}>{this.state.store.router.EntityForm.action} {this.state.store.router.EntityForm.type}</button>
            <button type="cancel" className="btn btn-default pull-left" onClick={this.handleCancel}>Cancel</button>
            <div className="clearfix"/>
          </div>
        </div>
      </div>
    );
  }
});

EntityForm.contextTypes = {
  store: React.PropTypes.object
};

module.exports = EntityForm;
