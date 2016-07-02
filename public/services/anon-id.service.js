var UUID = require('./uuid.service');

function AnonId() {

  this.get = function(cb) {
    var key = 'uuid';

    if(localStorage.getItem(key)){
      cb(localStorage.getItem(key));
    }else{
      var uuid = UUID.generate()
      localStorage.setItem(key, uuid)
      cb(uuid);
    }


    // chrome.storage.sync.get(function(result) {
    //   if (result[key]) {
    //     cb(result[key]);
    //   } else {
    //     var obj = {};
    //     obj[key] = UUID.generate();
    //     chrome.storage.sync.set(obj, function(result) {
    //       cb(obj[key]);
    //     });
    //   }

    // });

  };

  return this;

}
module.exports = new AnonId();
