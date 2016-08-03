var utils = require('utils');
var roomStatistics = require('roomStatistics');

var creepUtils = {
  
  getNewName: function(prefix)
  {
    var nameArray = ['WChurchill', 'KMarx', 'CGuevara', 'FNietzsche', 'GOrwell', 'Jd’Arc', 'JRatzinger', 'AEinstein', 'MPolo', 'DKahn', 'JGutenberg', 'BFranklin', 'WHumboldt', 'LTolstoi', 'JLennon'];
    
    for(var i = 0; i < 0; i++)
    {
      var name = prefix + '_' + nameArray[Math.floor(Math.random()*nameArray.length)];
      if(Memory.creeps[name] == undefined)
      return name;
    }
    
    for(var i = 0; i < 1000000; i++)
    {
      var name = prefix + '_' + i;
      if(Memory.creeps[name] == undefined)
      return name;
    }
    
    throw new Error('No names for name: ' + prefix);
  },
  findNearestDroppedSourceObjectIDToCollect: function(creep, room)
  {
    if(creep.memory.additional.collectDropped == undefined || creep.memory.additional.collectDropped == false)
    return null;
    
    if(room == undefined)
    room = creep.room;
    
    var targets = roomStatistics.findDroppedResources(room);
    utils.sortNearestTarget(creep, targets);
    
    for(var t in targets)
    {
      var target = targets[t];
      if(utils.getDistanceBetweenTargets(creep, target) < 10 || utils.getDistanceBetweenTargets(creep, target) < target.energy / 10.0)
      return target.id;
    }
    
    return null;
  },
  
  findNearestBuildingObjectIDToRepair: function(creep, room, minHitPointFactor)
  {
    if(room == undefined)
    room = creep.room;
    
    if(minHitPointFactor == undefined)
    minHitPointFactor = 0.8;
    
    var targets = roomStatistics.findStructures(room, function(structure) {
      if(structure.structureType == STRUCTURE_RAMPART)
      return (structure.hits < 100000); // Todo: based home room lvl
      if(structure.structureType == STRUCTURE_WALL)
      return (structure.hits < 100000); // Todo: based home room lvl
      
      return (structure.hits < structure.hitsMax * minHitPointFactor);
    });
    
    utils.sortNearestTarget(creep, targets);
    
    if(targets.length > 0)
    return targets[0].id;
    
    return null;
  },
  findNearestUnFullContainer: function(creep, room)
  {
    if(room == undefined)
    room = creep.room;
    
    var targets = roomStatistics.findStructures(room, function(structure) {
      if((creep.memory.additional.onlyUseLinksAsContainer == true || creep.memory.additional.useLinksAsContainer == true)  && structure.structureType == STRUCTURE_LINK)
      return structure.energy < structure.energyCapacity;
      
      if(creep.memory.additional.onlyUseLinksAsContainer == true)
      return false;
      
      return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
    });
    utils.sortNearestTarget(creep, targets);
    
    return targets;
  },
  findFullestNonEmptyContainer: function(creep, room)
  {
    if(room == undefined)
    room = creep.room;
    
    var targets = roomStatistics.findStructures(room, function(structure) {
      if((creep.memory.additional.onlyUseLinksAsContainer == true || creep.memory.additional.useLinksAsContainer == true)  && structure.structureType == STRUCTURE_LINK)
      return structure.energy > 0;
      
      if(creep.memory.additional.onlyUseLinksAsContainer == true)
      return false;
      return ((structure.structureType == STRUCTURE_CONTAINER || (creep.memory.additional.loadFromStorage == true && structure.structureType == STRUCTURE_STORAGE)) && structure.store[RESOURCE_ENERGY] > 0);
    });
    targets.sort(function(targetA, targetB)
    {
      if(creep.memory.additional.targetFlag != undefined && Game.flags[creep.memory.additional.targetFlag] == undefined)
      utils.logCreep(creep.name + ': Warning: targetFlag set but can not find it.');
      
      if(creep.memory.additional.targetFlag != undefined && Game.flags[creep.memory.additional.targetFlag] != undefined)
      {
        var flag = Game.flags[creep.memory.additional.targetFlag];
        return utils.getDistanceBetweenTargets(targetA, flag) - utils.getDistanceBetweenTargets(targetB, flag);
      }
      
      var energyA = 0;
      var energyB = 0;
      if(targetB.structureType == STRUCTURE_LINK)
      energyB = targetB.energy/targetB.storeCapacity;
      else
      energyB = targetB.store[RESOURCE_ENERGY]/targetB.storeCapacity;
      
      if(targetA.structureType == STRUCTURE_LINK)
      energyA = targetA.energy/targetB.storeCapacity;
      else
      energyA = targetA.store[RESOURCE_ENERGY]/targetB.storeCapacity;
      
      // Only 20% difference -> sort by nearness
      if(Math.abs(energyA - energyB) < 0.20)
      return utils.getDistanceBetweenTargets(targetA, creep) - utils.getDistanceBetweenTargets(targetB, creep);
      
      return energyB - energyA;
    });
    
    return targets;
  },
  findNearestNonEmptyContainerOrStorage: function(creep, room)
  {
    if(room == undefined)
    room = creep.room;
    
    var targets = roomStatistics.findStructures(room, function(structure) {
      return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE)  &&
      structure.store[RESOURCE_ENERGY] > 0;
    });
    
    utils.sortNearestTarget(creep, targets);
    
    return targets;
  },
   findNearestNonEmptyLink: function(creep, room)
  {
    if(room == undefined)
    room = creep.room;
    
    var targets = roomStatistics.findStructures(room, function(structure) {
      return (structure.structureType == STRUCTURE_LINK )  &&
      structure.energy > 0;
    });
    
    utils.sortNearestTarget(creep, targets);
    
    return targets;
  },
  getTargetRoom : function(creep)
  {
    var room = creep.room;
    if(creep.memory.additional.targetFlag != undefined)
    {
      if(Game.flags[creep.memory.additional.targetFlag] == undefined)
      throw Error(creep.name + ' has flag which does not exist: ' + creep.memory.additional.targetFlag);
      room = Game.flags[creep.memory.additional.targetFlag].room;
    }
    else if(creep.memory.additional.targetRoom != undefined)
    room = Game.rooms[creep.memory.additional.targetRoom];
    
    if(room == undefined)
    utils.logCreep('Warning: target room ' + creep.memory.additional.targetRoom + ' is not accessable -> scout. targetFlag:' + creep.memory.additional.targetFlag);
    //utils.logCreep(creep.name + ' ' + room.name);
    return room;
  },
  
  getHomeRoom : function(creep)
  {
    var room = creep.room;
    
    if(creep.memory.additional.homeFlag != undefined)
    room = Game.flags[creep.memory.additional.homeFlag].room;
    else if(creep.memory.additional.room != undefined)
    room = Game.rooms[creep.memory.additional.room];
    
    if(room == undefined)
    utils.logCreep('Warning: home room ' + creep.memory.additional.targetRoom + ' is not accessable -> scout.');
    
    return room;
  },
  followCreep: function(creep, targetCreep, minDistance)
  {
    if(minDistance == undefined)
    minDistance = 3;
    
    if(utils.getDistanceBetweenTargets(creep, targetCreep) > minDistance)
    {
      creep.moveTo(targetCreep);
      return false;
    }
    return true;
  },
  getNextMoveToPosition: function(creep, target)
  {
    var nextPositions = [{pos:{x:(creep.pos.x + 0), y:(creep.pos.y + 0)}}, {pos:{x:(creep.pos.x - 1), y:(creep.pos.y + 0)}}, {pos:{x:(creep.pos.x - 1), y:(creep.pos.y + 1)}}, {pos:{x:(creep.pos.x + 0), y:(creep.pos.y + 1)}}, {pos:{x:(creep.pos.x + 1), y:(creep.pos.y + 1)}}, {pos:{x:(creep.pos.x + 1), y:(creep.pos.y + 0)}}, {pos:{x:(creep.pos.x + 1), y:(creep.pos.y - 1)}}, {pos:{x:(creep.pos.x + 0), y:(creep.pos.y - 1)}}, {pos:{x:(creep.pos.x - 1), y:(creep.pos.y - 1)}}];
    utils.sortNearestTarget(target, nextPositions);
    return nextPositions[0];
  },
  moveToRightRoom: function(creep, room)
  {
    if(creep.room.name == room.name)
    return false;
    
    utils.logCreep(utils.getCreepInfo(creep) + ': Have to move to right room ' + room.name + ' first.');
    var result = creep.moveTo(new RoomPosition(10, 10, room.name));
    
    if(result != OK)
    utils.logCreep(utils.getCreepInfo(creep) + ': failed: ' + result);
    
    return true;
  },
  isNearEntrance: function(creep, distance)
  {
    if(distance == undefined)
    distance = 1;
    
    return creep.pos.x <= distance || creep.pos.y <= distance || creep.pos.x >= (49 - distance) || creep.pos.y >= (49 - distance);
  },
  moveToFlagOrId: function(creep, room, flagname, targetId, targetName)
  {
    if(flagname == undefined && targetId == undefined)
    return false;
    
    if(targetId != undefined)
    {
      var target = Game.getObjectById(targetId);
      if(target != null)
      {
        if(utils.isNear(creep, target) == true)
        {
          utils.logCreep(utils.getCreepInfo(creep) + ': ' + targetName + ' target reached: ' + target);
          return false;
        }
        creep.moveTo(target);
        utils.logCreep(utils.getCreepInfo(creep) + ': Move to ' + targetName + ' id. Not there yet: ' + target);
        return true;
      }
      else
      {
        utils.logCreep(utils.getCreepInfo(creep) + ': ' + targetName + ' targetId in other room: ' + room);
        
        return this.moveToRightRoom(creep, room);
      }
    }
    
    var flag = Game.flags[flagname];
    
    if(flag == undefined) // || (flag.room != undefined && room != undefined && flag.room.name != room.name))
    {
      return false;
    }
    
    if(flag.room != undefined && flag.room.name == creep.room.name && utils.getDistanceBetweenTargets(creep, flag) < 2)
    {
      utils.logCreep(utils.getCreepInfo(creep) + ': ' + targetName + ' flag reached: ' + flag.name);
      return false;
    }
    
    utils.logCreep(utils.getCreepInfo(creep) + ': Move to ' + targetName + ' flag. Not there yet: ' + flag.name);
    creep.moveTo(flag);
    return true;
  },
  // Moves to Id(set room if in other room), else to flag
  moveToHomeFlagOrId: function(creep, room)
  {
    if(room == undefined)
    room = this.getHomeRoom(creep);
    return this.moveToFlagOrId(creep, room, creep.memory.additional.homeFlag, creep.memory.additional.homeId, 'home');
  },
  
  moveToTargetFlagOrId: function(creep, room)
  {
    if(room == undefined)
    room = this.getTargetRoom(creep);
    return this.moveToFlagOrId(creep, room, creep.memory.additional.targetFlag, creep.memory.additional.targetId, 'target');
  },
  
  getCorrectFlagOrRoomFromCreepAndMoveToFirst: function(creep, room)
  {
    if(room == undefined)
    {
      if(creep.memory.additional.targetFlag != undefined && Game.flags[creep.memory.additional.targetFlag] == undefined)
      {
        utils.logCreep(utils.getCreepInfo(creep) + ' flag set but can not find: ' + creep.memory.additional.targetFlag);
      }
      else if(creep.memory.additional.targetFlag != undefined)
      {
        room = Game.flags[creep.memory.additional.targetFlag].room;
        if(room == undefined)
        {
          if(this.moveToTargetFlagOrId(creep) == true)
          return null;
        }
      }
      
      if(room == undefined)
      {
        if(Game.rooms[creep.memory.additional.room] != undefined)
        room = Game.rooms[creep.memory.additional.room];
        else
        room = creep.room;
      }
    }
    if(room.name == undefined)
    throw Error(creep.name + ' room undefined.' + room);
    if(this.moveToRightRoom(creep, room) == true)
    return null;
    
    //utils.logCreep(utils.getCreepInfo(creep) + ' room: '+ room.name);
    
    return room;
  },
  moveToFullestNonEmptyContainerAndCollect: function(creep, room, targetId)
  {
    var room = this.getCorrectFlagOrRoomFromCreepAndMoveToFirst(creep, room);
    if(room == null)
    return;
    
    var targets = utils.tryFilterId(creep,this.findFullestNonEmptyContainer(creep, room), targetId);
    
    if(targets.length > 0) {
      var result = creep.withdraw(targets[0], RESOURCE_ENERGY);
      if(result == ERR_NOT_IN_RANGE) {
        utils.logCreep(utils.getCreepInfo(creep) + ' move to collect from container: ' + targets[0]);
        creep.moveTo(targets[0]);
      }
      else
      utils.logCreep(utils.getCreepInfo(creep) + ' container to collect: ' + targets[0] + ': ' + result);
    }
    else
    {
      utils.logCreep(utils.getCreepInfo(creep) + ': no containers to collect from.');
      return false;
    }
    
    return true;
  },
  //moveToNearestNonEmptyContainerAndCollect(creep, creepUtils.getTargetRoom(creep))
  moveToNearestNonEmptyLinkAndCollect: function(creep, room, targetId)
  {
    var room = this.getCorrectFlagOrRoomFromCreepAndMoveToFirst(creep, room);
    if(room == null)
    return;
    
    var targets = utils.tryFilterId(creep,this.findNearestNonEmptyLink(creep, room), targetId);
    
    if(targets.length > 0) {
      var result = creep.withdraw(targets[0], RESOURCE_ENERGY);
      if(result == ERR_NOT_IN_RANGE) {
        utils.logCreep(utils.getCreepInfo(creep) + ' move to collect from link: ' + targets[0]);
        creep.moveTo(targets[0]);
      }
      else
      utils.logCreep(utils.getCreepInfo(creep) + ' container/storage to collect: ' + targets[0] + ': ' + result);
    }
    else
    {
      utils.logCreep(utils.getCreepInfo(creep) + ': no containers to collect from.');
      return false;
    }
    
    return true;
  },
  
  moveToNearestNonEmptyContainerAndCollect: function(creep, room, targetId)
  {
    var room = this.getCorrectFlagOrRoomFromCreepAndMoveToFirst(creep, room);
    if(room == null)
    return;
    
    var targets = utils.tryFilterId(creep,this.findNearestNonEmptyContainerOrStorage(creep, room), targetId);
    
    if(targets.length > 0) {
      var result = creep.withdraw(targets[0], RESOURCE_ENERGY);
      if(result == ERR_NOT_IN_RANGE) {
        utils.logCreep(utils.getCreepInfo(creep) + ' move to collect from container/storage: ' + targets[0]);
        creep.moveTo(targets[0]);
      }
      else
      utils.logCreep(utils.getCreepInfo(creep) + ' container/storage to collect: ' + targets[0] + ': ' + result);
    }
    else
    {
      utils.logCreep(utils.getCreepInfo(creep) + ': no containers to collect from.');
      return false;
    }
    
    return true;
  },
  
  moveToNearestUnfullContainerAndTransfer: function(creep, room, targetId, harvestAfter)
  {
    var room = this.getCorrectFlagOrRoomFromCreepAndMoveToFirst(creep, room);
    if(room == null)
    return;
    
    var targets = utils.tryFilterId(creep,this.findNearestUnFullContainer(creep, room), targetId);
    
    if(targets.length > 0) {
      if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        utils.logCreep(utils.getCreepInfo(creep) + ' transfer to container: ' + targets[0]);
        creep.moveTo(targets[0]);
      }
      else
      {
        utils.logCreep(utils.getCreepInfo(creep) + ' transfer to container: ' + targets[0]);
        if(harvestAfter == true && creep.memory.lastHarvestTargetId != undefined)
        {
          var targetSource = Game.getObjectById(creep.memory.lastHarvestTargetId);
          if(targetSource != null)
          {
            if(creep.pos.isNearTo(targetSource))
            {
              utils.logCreep(utils.getCreepInfo(creep) + ': Do additional harvest.');
              creep.harvest(targetSource);
            }
          }
        }
      }
    }
    else
    {
      utils.logCreep(utils.getCreepInfo(creep) + ': no containers to transfer to.');
      return false;
    }
    
    return true;
  },
  moveToDieIfTTLInMemory:function(creep)
  {
    //if(creep.memory.additional.goHomeDieTTL == undefined)
    return false;
    
    if(creep.ticksToLive <= creep.memory.additional.goHomeDieTTL)
    {
      this.moveToNearestSpawnAnDie(creep);
      return true;
    }
    
    return false;
  },
  moveToNearestSpawnAnDie: function(creep, room)
  {
    //var room = this.getCorrectFlagOrRoomFromCreepAndMoveToFirst(creep, room);
    var room = creep.room;
    if(room == null)
    return;
    
    var targets = roomStatistics.findStructuresByType(room, STRUCTURE_SPAWN);
    utils.sortNearestTarget(creep, targets);
    if(targets.length > 0)
    {
      var result = targets[0].recycleCreep(creep);
      if(result == ERR_NOT_IN_RANGE) {
        utils.logCreep(utils.getCreepInfo(creep) + ' move back home to make suicide: ' + targets[0]);
        creep.moveTo(targets[0]);
      }else
      utils.logCreep(utils.getCreepInfo(creep) + ' making suicide: ' + targets[0] + ': ' + result);
    }
  },
  moveToNearestUnfullHomeAndTransferBack: function(creep, room, targetId) // Returns false when no target
  {
    var room = this.getCorrectFlagOrRoomFromCreepAndMoveToFirst(creep, room);
    if(room == null)
    return;
    
    if(creep.memory.additional.unLoadToContainer == true || creep.memory.additional.unLoadToStorage == true)
    {
      utils.logCreep(utils.getCreepInfo(creep) + ' unLoadToContainer/unLoadToStorage activated.');
      var targets = utils.tryFilterId(creep,roomStatistics.findStructures(room, function(structure) {
        if((structure.structureType == STRUCTURE_CONTAINER && creep.memory.additional.unLoadToContainer == true) ||
        (structure.structureType == STRUCTURE_STORAGE && creep.memory.additional.unLoadToStorage == true))
        return (structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
      }), targetId);
      utils.sortNearestTarget(creep, targets);
      
      if(targets.length > 0) {
        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          utils.logCreep(utils.getCreepInfo(creep) + ' move home to container: ' + targets[0]);
          creep.moveTo(targets[0]);
        }else
        utils.logCreep(utils.getCreepInfo(creep) + ' unloading to container: ' + targets[0]);
        return true;
      }
    }
    
    var targets = utils.tryFilterId(creep,roomStatistics.findStructures(room, function(structure) {
      return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
      structure.energy < structure.energyCapacity;
    }), targetId);
    
    utils.sortNearestTarget(creep, targets);
    
    if(targets.length > 0) {
      if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        utils.logCreep(utils.getCreepInfo(creep) + ' move back home to extensions/spawn: ' + targets[0]);
        creep.moveTo(targets[0]);
      }else
      utils.logCreep(utils.getCreepInfo(creep) + ' unloading to extensions/spawn: ' + targets[0]);
    }
    else
    {
      var targets = utils.tryFilterId(creep,roomStatistics.findStructuresByType(room, STRUCTURE_TOWER, function(structure) {
        return (structure.energy < structure.energyCapacity);
      }), targetId);
      
      if(targets.length > 0) {
        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          utils.logCreep(utils.getCreepInfo(creep) + ' move back home to tower: ' + targets[0]);
          creep.moveTo(targets[0]);
        }else
        utils.logCreep(utils.getCreepInfo(creep) + ' unloading to tower: ' + targets[0]);
      }
      else {
        
        var targets = utils.tryFilterId(creep,roomStatistics.findStructuresByType(room, STRUCTURE_STORAGE, function(structure) {
          return (structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
        }), targetId);
        
        if(targets.length > 0) {
          if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            utils.logCreep(utils.getCreepInfo(creep) + ' move back home to storage: ' + targets[0]);
            creep.moveTo(targets[0]);
          }else
          utils.logCreep(utils.getCreepInfo(creep) + ' unloading to storage: ' + targets[0]);
        }
        else {
          utils.logCreep(utils.getCreepInfo(creep) + ': no extensions/spawns to move back');
          return false;
        }
      }
      
    }
    
    return true;
  },
  
  dismantleTarget: function(creep, target)
  {
    if(target == undefined)
    {
      utils.logCreep('No valid target to dismantle');
    }
    
    var result = creep.dismantle(target);
    if(result == ERR_NOT_IN_RANGE) {
      utils.logCreep(utils.getCreepInfo(creep) + ' move to source to dismantel: ' + target);
      creep.moveTo(target);
    }
    else
    utils.logCreep(utils.getCreepInfo(creep) + ' dismantling: ' + target + ': ' + result);
    
    return true;
  },
  
  moveToSourceAndHarvest: function(creep, room, targetId)
  {
    var room = this.getCorrectFlagOrRoomFromCreepAndMoveToFirst(creep, room);
    if(room == null)
    return;
    
    var targets = utils.tryFilterId(creep,roomStatistics.findSources(room), targetId);
    utils.sortNearestTarget(creep, targets);
    
    if(targets.length > 0) {
      var result = creep.harvest(targets[0]);
      if(result == ERR_NOT_IN_RANGE) {
        utils.logCreep(utils.getCreepInfo(creep) + ' move to source to harvest: ' + targets[0]);
        creep.moveTo(targets[0]);
      }
      else
      {
        creep.memory.lastHarvestTargetId = targets[0].id;
        utils.logCreep(utils.getCreepInfo(creep) + ' harvesting: ' + targets[0] + ': ' + result);
      }
    }
    else
    {
      utils.logCreep(utils.getCreepInfo(creep) + ': no sources to harvest back!');
      return false;
    }
    
    return true;
  },
  
  moveToDroppedSourceByIDAndHarvest: function(creep, droppedSourceID)
  {
    if(droppedSourceID == undefined || droppedSourceID == null)
    return false;
    
    var target = Game.getObjectById(droppedSourceID);
    if(target == null)
    return false;
    
    var result = creep.pickup(target);
    if(result == ERR_NOT_IN_RANGE) {
      utils.logCreep(utils.getCreepInfo(creep) + ': move to dropped source ' + target);
      creep.moveTo(target);
    }
    else
    utils.logCreep(utils.getCreepInfo(creep) + ': pickup dropped ' + target + ': ' + result);
    return true;
  },
  
  moveToControllerUpgrade: function(creep, room)
  {
    var room = this.getCorrectFlagOrRoomFromCreepAndMoveToFirst(creep, room);
    if(room == null)
    return;
    
    if(creep.upgradeController(room.controller) == ERR_NOT_IN_RANGE) {
      utils.logCreep(utils.getCreepInfo(creep) + ' move to controller to upgrade: ' + room.controller);
      creep.moveTo(room.controller);
    }
    else
    {
      utils.logCreep(utils.getCreepInfo(creep) + ': Upgrading controller...');
      return false;
    }
    
    return true;
  },
  
  moveToNearestConstructionSiteBuild: function(creep, room, targetId)
  {
    var room = this.getCorrectFlagOrRoomFromCreepAndMoveToFirst(creep, room);
    if(room == null)
    return;
    
    var targets = utils.tryFilterId(creep,roomStatistics.findConstructionSites(room), targetId);
    
    // Priority cs
    for(var t in targets)
    {
      var cs = targets[t];
      if(cs.structureType == STRUCTURE_RAMPART)
      {
        utils.logCreep(utils.getCreepInfo(creep) + ' priority rampart...');
        targets = [cs];
        break;
      }
    }
    
    utils.sortNearestTarget(creep, targets);
    
    if(targets.length > 0)
    {
      var result= creep.build(targets[0]);
      if(result == ERR_NOT_IN_RANGE) {
        utils.logCreep(utils.getCreepInfo(creep) + ': move to build ' + targets[0]);
        creep.moveTo(targets[0]);
      }
      else{
        utils.creepSay(creep, 'B:' + (100.0*targets[0].progress/targets[0].progressTotal) +'%', 10);
        utils.logCreep(utils.getCreepInfo(creep) + ': building ' + targets[0] + ': ' + result + (100.0*targets[0].progress/targets[0].progressTotal) +'%');
      }
    }
    else
    {
      utils.logCreep(utils.getCreepInfo(creep) + ': No construction site to build');
      return false;
    }
    
    return true;
  },
  tryRenewIfNearSpawn(creep)
  {
    //http://support.screeps.com/hc/en-us/community/posts/206398959-request-renewCreep-noobie-guide-
    return false; // TODO: fix this code --> renew not cost effective but for groups
    if(creep.ticksToLive == 50 && (creep.memory.additional.createBeforeDie == undefined))
    {
      var targets = roomStatistics.findStructuresByType(creep.room, STRUCTURE_SPAWN);
      utils.sortNearestTarget(creep, targets);
      if(targets.length > 0)
      {
        if(utils.getDistanceBetweenTargets(creep, targets[0]) < 20, targets[0].spawning == null) // No spawning
        creep.memory.spawner = targets[0].id;
      }
    }
    
    if(creep.memory.spawner != undefined)
    {
      creep.say('renew');
      
      var target = Game.getObjectById(creep.memory.spawner);
      if(target == null)
      delete creep.memory.spawner;
      else {
        var result = target.renewCreep(creep);
        if(result == ERR_NOT_IN_RANGE) {
          utils.logCreep(utils.getCreepInfo(creep) + ': move for renewCreep to ' + target);
          creep.moveTo(target);
        }
        else if(result == ERR_FULL)
        {
          delete creep.memory.spawner;
          return false;
        }
        else
        utils.logCreep(utils.getCreepInfo(creep) + ': renewCreep ' + target + ' ' + creep.ticksToLive + 'TTL: ' + result);
      }
      return true;
    }
    
    return false;
  },
  
  moveToRepairSiteRepairByID: function(creep, repairObjectID)
  {
    if(repairObjectID == undefined || repairObjectID == null || repairObjectID == false)
    return false;
    
    var target = Game.getObjectById(repairObjectID);
    if(target == null)
    return false;
    
    if(target.hits >= target.hitsMax)
    return false;
    
    var result = creep.repair(target);
    if(result == ERR_NOT_IN_RANGE) {
      utils.logCreep(utils.getCreepInfo(creep) + ': move to repair ' + target);
      creep.moveTo(target);
    }
    else{
      utils.creepSay(creep, 'R:' + (100.0*target.hits/target.hitsMax) +'%', 10);
      utils.logCreep(utils.getCreepInfo(creep) + ': repair ' + target + ': ' + result + ' ' + (100.0*target.hits/target.hitsMax) +'%');
    }
    return true;
  }
};

module.exports = creepUtils;