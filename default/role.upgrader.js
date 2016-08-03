var creepUtils = require('creepUtils');
var utils = require('utils');

var roleUpgrader = {
  
  name: 'upgrader',
  
  /** @param {Creep} creep **/
  run: function(creep) {
    
    if(creep.room.controller != undefined)
    utils.creepSay(creep, 'U:L' + creep.room.controller.level + '/' + (creep.room.controller.progress/creep.room.controller.progressTotal*100.0) + '%', 21);
    utils.creepSay(creep, Game.gcl.level + ':GCL' + (Game.gcl.progress / Game.gcl.progressTotal * 100.0) + '%', 25);
    utils.creepSay(creep, 'G/t:'+ utils.getGCLPerTick(), 29);
    
    
    if(creep.memory.upgrading && creep.carry.energy == 0) {
      creep.memory.upgrading = false;
    }
    
    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
      creep.memory.upgrading = true;
    }
    
    if(creep.memory.upgrading)
    {
      if(creepUtils.moveToTargetFlagOrId(creep) == false)
      creepUtils.moveToControllerUpgrade(creep, creepUtils.getTargetRoom(creep));
    }
    else
    {
      if(creepUtils.moveToHomeFlagOrId(creep) == false)
      {
        if(creep.memory.additional.collectFromTargetSource == true) {
            creepUtils.moveToSourceAndHarvest(creep, creepUtils.getTargetRoom(creep), 'homeId');
        }
        else {
          // creepUtils.moveToNearestNonEmptyLinkAndCollect(creep, creepUtils.getTargetRoom(creep)); 
        creepUtils.moveToNearestNonEmptyContainerAndCollect(creep, creepUtils.getTargetRoom(creep));
        }
      }
    }
  }
};

module.exports = roleUpgrader;