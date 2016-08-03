var creepUtils = require('creepUtils');
var utils = require('utils');
var roleCombatBase = require('role.combat.base');
var combatUtils = require('combatUtils');

var roleScouter = {
  name: 'combat.marine',
  
  run: function(creep, squad, messages) {
    roleCombatBase.alwaysRunBefore(creep, squad);
    
    if(squad.currentRoomAttacked == true)
    {
      utils.creepSay(creep, squad.attackers.length);
      utils.creepSay(creep, 'ATTACK!');
      combatUtils.simpleAttack(creep, squad);
    }
    else // Nothing special
    roleCombatBase.run(creep, squad, messages);
  }
};

module.exports = roleScouter;