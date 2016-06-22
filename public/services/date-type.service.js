const _ = require('lodash');

function DateTypeService() {

  this.convertStringsToDates = function(prev, next) {

    // Recursively loop through the all nested properties of the object
    function traverseLevel(objP, objN) {
      _.forEach(objP, (field, key) => {
        // We only care about Object types (the javascript class Date is an object type)
        if (typeof field === 'object') {
          // If this field on the record was a Date type, convert the string that field to a Date object
          if (field instanceof Date) {
            if (objN[key]) {
              objN[key] = new Date(objN[key]);
            }
          } else if (!_.isEmpty(field) && !_.isEmpty(objN[key])) {
            // Traverse further if this is a nested object
            traverseLevel(field, objN[key]);
          }
        }
      });
    }

    traverseLevel(prev, next);

    return next;
  };

  return this;

}

module.exports = new DateTypeService();
