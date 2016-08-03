var creepUtils = require('creepUtils');
var utils = require('utils');
var roleCombatBase = require('role.combat.base');
var combatUtils = require('combatUtils');
var roomStatistics = require('roomStatistics');

var roleTrainer = {
  name: 'combat.trainer',
  
  /** @param {Creep} creep **/
  run: function(creep, squad, messages) {
    roleCombatBase.alwaysRunBefore(creep, squad);
    
    var trainingEnemies = [];
    if(squad.usualTargetRoom == creep.room.name)
    {
      utils.creepSay(creep, 'Teaching...');
      creep.memory.isTrainingAttacker = true;
      
      trainingEnemies = roomStatistics.findOwnCreeps(creep.room, function(c) { return !(c.memory.isTrainingAttacker == true);});
      
      if(trainingEnemies.length > 0)
      {
        squad.attackers = trainingEnemies;
        combatUtils.simpleAttack(creep, squad);
      }
    }else
    {
      utils.creepSay(creep, 'Waiting...');
      creep.memory.isTrainingAttacker = false;
    }
    
    if(trainingEnemies.length <= 0)
    {
      roleCombatBase.run(creep, squad, messages);
    }
    
  }
};

module.exports = roleTrainer;