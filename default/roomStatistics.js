var utils = require('utils');

var roomStatistics = {
  structures: {},
  allStructures: {},
  sources: {},
  dropped_resources: {},
  constructionSites: {},
  hostileCreeps: {},
  alliedCreeps: {},
  ownCreeps: {},
  attackedRooms: {},
  allOwnCreepsNamesSortedByLeaderFirst: [],
  energyPerTickUpdate: 3000,
  init: function()
  {
    roomStatistics.allOwnCreepsNamesSortedByLeaderFirst = [];
  },
  getRoomAttackPeriod: function(room)
  {
    if(room == undefined || room.memory.attackedPeriod == undefined)
    return 0;
    return room.memory.attackedPeriod;
  },
  getRoomAttackNr: function(room)
  {
    if(this.attackedRooms[room.name] == undefined)
    this.update(room.name);
    
    return this.attackedRooms[room.name].nr;
  },
  getEnergyPerTick: function(room)
  {
    if(room.memory.lastEnergy == undefined || room.memory.lastEnergyBefore == undefined)
    return NaN;
    return (room.memory.lastEnergy - room.memory.lastEnergyBefore)/(1.0*this.energyPerTickUpdate);
  },
  getControllerLevel: function(room)
  {
    if(room.controller == undefined)
    return -1;
    return room.controller.level;
  },
  getAllOwnCreepsNamesSortedByLeaderFirst: function()
  {
    // For attack code -> we have to execute leaders first
    roomStatistics.allOwnCreepsNamesSortedByLeaderFirst.sort(function(creepA, creepB)
    {
      var aValue = 1;
      var bValue = 1;
      if(Game.creeps[creepA].memory.additional.isLeader == true)
      aValue += 1;
      if(Game.creeps[creepB].memory.additional.isLeader == true)
      bValue += 1;
      return bValue - aValue;
    });
    
    return roomStatistics.allOwnCreepsNamesSortedByLeaderFirst;
  },
  getCurrentEnergy: function(room)
  {
    return this.getCurrentEnergyContainerLink(room) + this.getCurrentEnergyStorage(room) + this.getCurrentEnergyExtensionsAndSpawn(room);
  },
  getTotalEnergy: function(room)
  {
    return this.getTotalEnergyContainerLink(room) + this.getTotalEnergyStorage(room) + this.getTotalEnergyExtensionsAndSpawn(room);
  },
  getTotalEnergyContainerLink: function(room)
  {
    if(this.structures[room.name][STRUCTURE_CONTAINER] == undefined)
    return 0;
    
    var total= 0;
    for(var s in this.structures[room.name][STRUCTURE_CONTAINER])
    {
      total += this.structures[room.name][STRUCTURE_CONTAINER][s].storeCapacity;//store[RESOURCE_ENERGY]
    }
    
    return total;
  },
  getTotalEnergyStorage: function(room)
  {
    if(this.structures[room.name][STRUCTURE_STORAGE] == undefined)
    return 0;
    
    var total= 0;
    for(var s in this.structures[room.name][STRUCTURE_STORAGE])
    {
      total += this.structures[room.name][STRUCTURE_STORAGE][s].storeCapacity;
    }
    
    return total;
  },
  getTotalEnergyExtensionsAndSpawn: function(room)
  {
    /*if(this.structures[room.name][STRUCTURE_EXTENSION] == undefined)
    return 0;
    
    var total= 0;
    for(var s in this.structures[room.name][STRUCTURE_EXTENSION])
    {
    total += this.structures[room.name][STRUCTURE_EXTENSION][s].energyCapacity;
  }
  for(var s in this.structures[room.name][STRUCTURE_SPAWN])
  {
  total += this.structures[room.name][STRUCTURE_SPAWN][s].energyCapacity;
}*/

return room.energyCapacityAvailable;
},
getCurrentEnergyContainerLink: function(room)
{
  if(this.structures[room.name][STRUCTURE_CONTAINER] == undefined)
  return 0;
  
  var total= 0;
  for(var s in this.structures[room.name][STRUCTURE_CONTAINER])
  {
    total += this.structures[room.name][STRUCTURE_CONTAINER][s].store[RESOURCE_ENERGY]
  }
  
  return total;
},
getCurrentEnergyStorage: function(room)
{
  if(this.structures[room.name][STRUCTURE_STORAGE] == undefined)
  return 0;
  
  var total= 0;
  for(var s in this.structures[room.name][STRUCTURE_STORAGE])
  {
    total += this.structures[room.name][STRUCTURE_STORAGE][s].store[RESOURCE_ENERGY];
  }
  
  return total;
},
getCurrentEnergyExtensionsAndSpawn: function(room)
{
  /*if(this.structures[room.name][STRUCTURE_EXTENSION] == undefined)
  return 0;
  
  var total= 0;
  for(var s in this.structures[room.name][STRUCTURE_EXTENSION])
  {
  total += this.structures[room.name][STRUCTURE_EXTENSION][s].energy;
}
for(var s in this.structures[room.name][STRUCTURE_SPAWN])
{
total += this.structures[room.name][STRUCTURE_SPAWN][s].energy;
}*/

return room.energyAvailable;
},
filter: function(resultList, filterFunction)
{
  if(filterFunction == undefined)
  return resultList;
  
  var result = []
  for(var r in resultList)
  {
    if(filterFunction(resultList[r]) == true)
    result.push(resultList[r]);
  }
  
  return result;
},
areContainersAvailableFull(room, nr, fullnessPercent)
{
  var targets = this.findStructuresByType(room, STRUCTURE_CONTAINER, function(container){ return (container.store[RESOURCE_ENERGY]*100.0 / container.storeCapacity) >= fullnessPercent });
  
  return targets.length >= nr;
},
findDroppedResources: function(room, filter)
{
  if(this.dropped_resources[room.name] == undefined)
  this.update(room.name);
  
  return this.filter(this.dropped_resources[room.name], filter);
},
findSources: function(room, filter)
{
  if(this.sources[room.name] == undefined)
  this.update(room.name);
  
  return this.filter(this.sources[room.name], filter);
},
findConstructionSites: function(room, filter)
{
  if(this.constructionSites[room.name] == undefined)
  this.update(room.name);
  
  return this.filter(this.constructionSites[room.name], filter);
},
findHostileCreeps: function(room, filter)
{
  if(this.hostileCreeps[room.name] == undefined)
  this.update(room.name);
  
  return this.filter(this.hostileCreeps[room.name], filter);
},
findOwnAndAlliedCreeps: function(room, filter)
{
  var result = [];
  var targets = this.findAlliedCreeps(room, filter);
  for(var t in targets)
  result.push(targets[t]);
  var targets = this.findOwnCreeps(room, filter);
  for(var t in targets)
  result.push(targets[t]);
  return result;
},
findAlliedCreeps: function(room, filter)
{
  if(this.alliedCreeps[room.name] == undefined)
  this.update(room.name);
  
  return this.filter(this.alliedCreeps[room.name], filter);
},
findOwnCreeps: function(room, filter)
{
  if(this.ownCreeps[room.name] == undefined)
  this.update(room.name);
  
  return this.filter(this.ownCreeps[room.name], filter);
},
findStructures: function(room, filter)
{
  if(this.allStructures[room.name] == undefined)
  this.update(room.name);
  
  return this.filter(this.allStructures[room.name], filter);
},
findStructuresByType: function(room, structureType, filter)
{
  if(this.structures[room.name] == undefined)
  this.update(room.name);
  
  if(this.structures[room.name][structureType] == undefined)
  return [];
  
  return this.filter(this.structures[room.name][structureType], filter);
},
update: function(roomName)
{
  var room = Game.rooms[roomName];
  
  this.structures[room.name] = {};
  this.allStructures[room.name] = [];
  
  var targets = room.find(FIND_STRUCTURES);
  for(t in targets)
  {
    var structure = targets[t];
    if(this.structures[room.name][structure.structureType] == undefined)
    this.structures[room.name][structure.structureType] = [];
    
    this.structures[room.name][structure.structureType].push(structure);
    this.allStructures[room.name].push(structure);
  }
  
  roomStatistics.constructionSites[room.name] = [];
  var targets = room.find(FIND_CONSTRUCTION_SITES);
  for(t in targets)
  roomStatistics.constructionSites[room.name].push(targets[t]);
  
  roomStatistics.attackedRooms[room.name] = {nr:0};
  roomStatistics.hostileCreeps[room.name] = [];
  roomStatistics.alliedCreeps[room.name] = [];
  var friendlyFound = false;
  var targets = room.find(FIND_HOSTILE_CREEPS);
  //console.log('Hostile' + targets.length);
  for(t in targets)
  {
    if(utils.isFriendlyCreep(targets[t]) == false)
    {
      console.log(room.name + ': found emeny creep!!!: ' + targets[t].owner.username);
      roomStatistics.attackedRooms[room.name].nr += 1;
      roomStatistics.hostileCreeps[room.name].push(targets[t]);
    }
    else
    {
      friendlyFound = true;
      roomStatistics.alliedCreeps[room.name].push(targets[t]);
    }
  }
  
  roomStatistics.ownCreeps[room.name] = [];
  for(var c in Game.creeps){
    if(Game.creeps[c].room.name == room.name){
      roomStatistics.ownCreeps[room.name].push(Game.creeps[c]);
      roomStatistics.allOwnCreepsNamesSortedByLeaderFirst.push(Game.creeps[c].name);
      if(Game.creeps[c].memory.isTrainingAttacker == true) // Also add for training...
      roomStatistics.hostileCreeps[room.name].push(Game.creeps[c]);
    }
  }
  
  if(roomStatistics.attackedRooms[room.name].nr > 0)
  room.memory.attackedPeriod += 1;
  else
  room.memory.attackedPeriod = 0;
  
  // Only do this at ticks
  var searchForNotOften = 5000;
  if(this.dropped_resources[room.name] == undefined || this.sources[room.name] == undefined)
  searchForNotOften = 1;
  
  var searchForDroppedResources = 15;
  if(this.dropped_resources[room.name] == undefined || this.dropped_resources[room.name].length > 0)
  searchForDroppedResources = 1;
  
  utils.onlyDoTicks(function()
  {
    roomStatistics.dropped_resources[room.name] = [];
    var targets = room.find(FIND_DROPPED_RESOURCES);
    for(t in targets)
    roomStatistics.dropped_resources[room.name].push(targets[t]);
  }, searchForDroppedResources);
  
  utils.onlyDoTicks(function()
  {
    roomStatistics.sources[room.name] = [];
    
    var targets = room.find(FIND_SOURCES);
    for(t in targets)
    roomStatistics.sources[room.name].push(targets[t]);
  }, searchForNotOften);
  
  console.log('Find elements for room: ' + room.name + ' done. Found friendly creeps: ' + friendlyFound);
  
  utils.onlyDoTicks(function()
  {
    room.memory.lastEnergyBefore = room.memory.lastEnergy;
    room.memory.lastEnergy = roomStatistics.getCurrentEnergy(room);
  }, this.energyPerTickUpdate);
  // Update energy statistics
},
};


module.exports = roomStatistics;