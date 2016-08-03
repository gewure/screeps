//var creepUtils = require('creepUtils');
//var combatUtils = require('combatUtils');
var utils = require('utils');

var roleLabs = {
  name: 'labs',
  
  /** @param {Creep} creep **/
  run: function(room, labs) {
    var labIA = Game.getObjectById(labs[1]);
    var labIB = Game.getObjectById(labs[0]);
    var labO = Game.getObjectById(labs[2]);
    
    var result = labO.runReaction(labIA, labIB);
    //utils.logLabs('Run labs ' + labs.labInputAId + ' + ' + labs.labInputBId + ' = ' + labs.labOutputId + ' ' + result);
  }
  
};

module.exports = roleLabs;