var roleContainerWorker = require('role.containerWorker');
var roleHarvester = require('role.harvester');
var creepBalancer = require('creepBalancer');
var roleTower = require('role.tower');

var roomBase = {
  emergencyNeeded: function(room, foundCreeps, containerWorkerNeeded)
  {
    var neededCreeps = null;
    // Emergency code
    if(foundCreeps.creepsByRole[roleHarvester.name] == undefined ||foundCreeps.creepsByRole[roleHarvester.name].nr <= 0)
    {
      neededCreeps = [creepBalancer.getNearbyHarvester('H_EMERGENCY', room, 1)];
      console.log('Emergency! We have to build a low harvester!');
    }
    else if(containerWorkerNeeded == true && (foundCreeps.creepsByRole[roleContainerWorker.name] == undefined ||foundCreeps.creepsByRole[roleContainerWorker.name].nr <= 0))
    {
      neededCreeps = [creepBalancer.getContainerWorker('CW_EMERGENCY',room, 1)];
      console.log('Emergency! We have to build a low containerWorker!');
    }
    
    return neededCreeps;
  },
  getTowerRoles : function(room, roomStatistics)
  {
    var towerRoles = [];
    var towers = roomStatistics.findStructuresByType(room, STRUCTURE_TOWER);
    console.log('Towers in room: ' + towers);
    
    if(towers != undefined){
      
      for(var t = 0; t < towers.length; t++)
      towerRoles.push(roleTower.name);
    }
    
    return towerRoles;
  }
  
};


module.exports = roomBase;