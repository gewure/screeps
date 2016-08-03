var creepUtils = require('creepUtils');
var utils = require('utils');
var roleCombatBase = require('role.combat.base');
var combatUtils = require('combatUtils');

var roleScouter = {
  name: 'combat.ranger',
  
  /** @param {Creep} creep **/
  run: function(creep, squad, messages) {
    roleCombatBase.alwaysRunBefore(creep, squad);
    
    if(squad.currentRoomAttacked == true)
    {
      combatUtils.rangedAttack(creep, squad);
    }
    else // Nothing special
    roleCombatBase.run(creep, squad, messages);
  }
};

module.exports = roleScouter;