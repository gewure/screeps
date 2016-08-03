var creepUtils = require('creepUtils');
var utils = require('utils');
var roleCombatBase = require('role.combat.base');
var combatUtils = require('combatUtils');
var roomStatistics = require('roomStatistics');

var roleDismantler = {
  name: 'combat.dismantler',
  
  /** @param {Creep} creep **/
  run: function(creep, squad, messages) {
    roleCombatBase.alwaysRunBefore(creep, squad);
    
    if(squad.usualTargetRoom == creep.room.name)
    {
    }
  }
};

module.exports = roleDismantler;