var utils = require('utils');
var roomStatistics = require('roomStatistics');

var combatUtils = {
  findNearestHostileCreeps: function(combater, filter)
  {
    var targets = roomStatistics.findHostileCreeps(combater.room, filter);
    utils.sortNearestTarget(combater, targets);
    
    return targets;
  },
  simpleAttack: function(creep, squad)
  {
    utils.sortNearestTarget(creep, squad.attackers);
    var target = squad.attackers[0];
    var result = creep.attack(target);
    if(result == ERR_NOT_IN_RANGE) {
      utils.logCreep(utils.getCreepInfo(creep) + ': move for attack to ' + target);
      creep.moveTo(target);
      result = creep.attack(target);
      utils.logCreep(utils.getCreepInfo(creep) + ': attack ' + target + ': ' + result);
    }else {
      utils.logCreep(utils.getCreepInfo(creep) + ': attack ' + target + ': ' + result);
    }
  },
  rangedAttack: function(creep, squad)
  {
    utils.sortNearestTarget(creep, squad.attackers);
    var target = squad.attackers[0];
    var result = creep.rangedAttack(target);
    if(result == ERR_NOT_IN_RANGE) {
      utils.logCreep(utils.getCreepInfo(creep) + ': move for attack to ' + target);
      this.randomMove(creep, target);
      result = creep.rangedAttack(target);
      utils.logCreep(utils.getCreepInfo(creep) + ': attack ' + target + ': ' + result);
    }else {
      utils.logCreep(utils.getCreepInfo(creep) + ': attack ' + target + ': ' + result);
    }
  },
  followCreepCombat: function(creep, targetCreep, minDistance)
  {
    var distance = creep.pos.getRangeTo(targetCreep);
    
    if(distance > minDistance)
    {
      if(distance < 4)
      creep.move(creep.getDirectionTo(targetCreep));
      else
      creep.moveTo(targetCreep);
      
      return false;
    }
    return true;
  },
  randomMove: function(creep, target) {
    var distance = creep.pos.getRangeTo(target);
    var direction = creep.pos.getDirectionTo(target);
    
    var random = Math.ceil(Math.random()*8);
    try {
      if(distance == 1) {
        if(random != direction) {
          var oppositeDir = target.pos.getDirectionTo(creep);
          creep.move(oppositeDir);
          return true;
        }
      } else if(distance == 3) {
        var result = creep.move(direction);
        if(result == ERR_INVALID_TARGET || result == ERR_NO_PATH)
        creep.moveTo(target);
        return true;
      } else if(distance == 2) {
        if(random != direction) {
          
          var result = creep.move(random);
          if(result == ERR_INVALID_TARGET || result == ERR_NO_PATH)
          creep.moveTo(target);
          return true;
        }
      } else if(distance == 0) {
        var oppositeDir = target.pos.getDirectionTo(creep);
        var result = creep.move(oppositeDir);
        if(result == ERR_INVALID_TARGET || result == ERR_NO_PATH)
        creep.moveTo(target);
        return true;
      } else if (distance > 3 && distance < 5) {
        var result = creep.move(direction);
        if(result == ERR_INVALID_TARGET || result == ERR_NO_PATH)
        creep.moveTo(target);
        return true;
      }
    } catch (someMoveError) {
    }
    
    creep.moveTo(target);
    return false;
  },
};


module.exports = combatUtils;