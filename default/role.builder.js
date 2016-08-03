var creepUtils = require('creepUtils');
var utils = require('utils');

var roleBuilder = {
  name: 'builder',
  
  /** @param {Creep} creep **/
  run: function(creep) {
    
    if(creep.memory.additional.repairAlso == true)
    {
      var doAll = 50;
      if(creep.memory.repairObjectID != null && creep.memory.repairObjectID != false)
      doAll = 1;
      
      utils.onlyDoTicks(function()
      {
        creep.memory.repairObjectID = creepUtils.findNearestBuildingObjectIDToRepair(creep);
      }, doAll);
    }
    
    if(creep.memory.building && creep.carry.energy == 0) {
      creep.memory.building = false;
    }
    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
      creep.memory.building = true;
    }
    
    if(creep.memory.building)
    {
      if(creepUtils.moveToRepairSiteRepairByID(creep, creep.memory.repairObjectID) == false)
      {
        creep.memory.repairObjectID = null;
        
        if(creepUtils.moveToTargetFlagOrId(creep) == false)
        if(creepUtils.moveToNearestConstructionSiteBuild(creep, creepUtils.getTargetRoom(creep), 'targetId') == false)
        creepUtils.moveToControllerUpgrade(creep);
      }
      
    }
    else
    {
      if(creepUtils.moveToHomeFlagOrId(creep) == false)
      {
        if(creep.memory.additional.collectFromTargetSource == true)
        creepUtils.moveToSourceAndHarvest(creep, creepUtils.getTargetRoom(creep), 'homeId');
        else
        creepUtils.moveToNearestNonEmptyContainerAndCollect(creep, undefined, 'homeId');
      }
    }
  }
};

module.exports = roleBuilder;