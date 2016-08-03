var creepUtils = require('creepUtils');

var roleHarvester = {
  
  name: 'harvester',
  
  /** @param {Creep} creep **/
  run: function(creep) {
    
    if(creep.carry.energy < creep.carryCapacity && creep.ticksToLive > 10)
    {
      if(creepUtils.moveToTargetFlagOrId(creep) == false)
      creepUtils.moveToSourceAndHarvest(creep, creepUtils.getTargetRoom(creep), 'targetId');
    }
    else
    {
      if(creepUtils.moveToHomeFlagOrId(creep) == false)
      {
        if(creepUtils.moveToNearestUnfullContainerAndTransfer(creep, creepUtils.getHomeRoom(creep), 'homeId', true) == false)
        {
          if(creepUtils.moveToNearestUnfullHomeAndTransferBack(creep, creepUtils.getHomeRoom(creep), 'homeId') == false)
          creepUtils.moveToControllerUpgrade(creep);
        }
      }
    }
  }
};

module.exports = roleHarvester;