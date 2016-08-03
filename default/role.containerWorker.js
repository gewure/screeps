var creepUtils = require('creepUtils');
var utils = require('utils');
var roomStatistics = require('roomStatistics');

var roleContainerWorker = {
  name: 'containerWorker',
  run: function(creep)
  {
    utils.creepSay(creep, 'CW:E' +roomStatistics.getCurrentEnergy(creep.room), 13);
    utils.creepSay(creep, 'E/t:' +roomStatistics.getEnergyPerTick(creep.room), 14);
    
    // switched off -> took too long
    creep.memory.droppedSourceID = creepUtils.findNearestDroppedSourceObjectIDToCollect(creep);
    
    if(creep.memory.transferBack && creep.carry.energy == 0) {
      creep.memory.transferBack = false;
    }
    
    if(!creep.memory.transferBack && creep.carry.energy == creep.carryCapacity) {
      creep.memory.transferBack = true;
    }
    if(creep.ticksToLive < 15)
    creep.memory.transferBack = true;
    
    if(creep.memory.transferBack)
    {
      if(creepUtils.moveToHomeFlagOrId(creep) == false)
      if(creepUtils.moveToNearestUnfullHomeAndTransferBack(creep, creepUtils.getHomeRoom(creep), 'homeId') == false)
      creepUtils.moveToControllerUpgrade(creep);
    }
    else
    {
      if(creep.memory.droppedSourceID != undefined && creep.memory.droppedSourceID != null)
      {
        if(creepUtils.moveToDroppedSourceByIDAndHarvest(creep, creep.memory.droppedSourceID) == false)
        creepUtils.moveToFullestNonEmptyContainerAndCollect(creep, creepUtils.getTargetRoom(creep), 'targetId');
      }
      else
      if(creepUtils.moveToTargetFlagOrId(creep) == false)
      creepUtils.moveToFullestNonEmptyContainerAndCollect(creep, creepUtils.getTargetRoom(creep), 'targetId');
    }
  }
};

module.exports = roleContainerWorker;