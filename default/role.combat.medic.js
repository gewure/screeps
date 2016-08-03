var creepUtils = require('creepUtils');
var utils = require('utils');
var roleCombatBase = require('role.combat.base');
var combatUtils = require('combatUtils');
var roomStatistics = require('roomStatistics');

var roleMedic = {
  name: 'combat.medic',
  
  /** @param {Creep} creep **/
  run: function(creep, squad, messages) {
    roleCombatBase.alwaysRunBefore(creep, squad);
    
    //console.log(creep.name + ' friendly: ' + roomStatistics.findOwnAndAlliedCreeps(creep.room));
    
    var friendlyCreeps = roomStatistics.findOwnAndAlliedCreeps(creep.room, function(c)
    {
      return (c.hits < c.hitsMax);
    });
    utils.sortNearestTarget(creep, friendlyCreeps);
    
    if(friendlyCreeps.length > 0)
    {
      var creepToHeal = friendlyCreeps[0];
      
      if(creepToHeal != null)
      {
        utils.logCombat(utils.getCreepInfo(creep) + ': go heal: ' + creepToHeal);
        
        var result = creep.heal(creepToHeal);
        if(result == ERR_NOT_IN_RANGE)
        {
          if(messages.followFormation == undefined)
          creep.moveTo(creep.pos.getDirectionTo(creepToHeal));
          
          var result = creep.heal(creepToHeal);
          if(result == ERR_NOT_IN_RANGE)
          {
            var result = creep.rangedHeal(creepToHeal);
            if(result == ERR_NOT_IN_RANGE)
            {
              utils.creepSay(creep, 'NO-HEAL!');
            }
            else {
              utils.creepSay(creep, 'RHEAL!');
              utils.logCombat(utils.getCreepInfo(creep) + ': range healed' + creepToHeal + ': ' + result);
            }
          }
          else
          {
            utils.creepSay(creep, 'HEAL!');
            utils.logCombat(utils.getCreepInfo(creep) + ': healed' + creepToHeal + ': ' + result);
            return;
          }
        }
        else{
          utils.creepSay(creep, 'HEAL!');
          utils.logCombat(utils.getCreepInfo(creep) + ': healed' + creepToHeal + ': ' + healResult);
          return;
        }
      }
    }
    
    
    roleCombatBase.run(creep, squad, messages);
  }
};

module.exports = roleMedic;