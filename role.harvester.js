var reHarvestFactor = 30; //if only 20 %energy are left, the creep will gather again
var reFillFactorEmptySource = 15;
var droppedEnergyHarvestDistance = 20;
var sourceID = 'afb76d89e4a600fff28ceed3';

var containerIDs = ['0e6d8cd45eb7f65ae41e12fc'];


var roleHarvester = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
        var workFound = false;
        if(creep.memory.stillFill == undefined) {
            creep.memory.stillFill = false;
        }
        
	    if(creep.carry.energy < creep.carryCapacity && !creep.memory.stillFill) {
            //var sources = creep.room.find(FIND_SOURCES);
            //get closest resource
            var closestSource = Game.getObjectById(sourceID);
            if(creep.harvest(closestSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestSource);
                workFound = true;
            //if the source is empty and the creep has a decent amount of energy stored, transport the energy to the spawn, extractions or towers
            } else if(creep.harvest(closestSource) == ERR_NOT_ENOUGH_RESOURCES && creep.carry.energy > ((creep.carryCapacity / 100) * reFillFactorEmptySource)) {
                creep.memory.stillFill = true;
                workFound = true;
            } else if (creep.harvest(closestSource) == OK) {
                workFound = true;
            }
        } else {
            var activeCarryCount = getActiveCarryPartsCount(creep);
            creep.say(activeCarryCount);
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                (structure.structureType == STRUCTURE_TOWER && ((structure.energyCapacity - structure.energy) >= (activeCarryCount * 50)))) && structure.energy < structure.energyCapacity;
                    }, algorithm:'dijkstra'});
            
            if(target) {
                workFound = true;
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                } else {
                    
                    if(creep.carry.energy >= reHarvestFactor) {
                        creep.memory.stillFill = true;
                    } else {
                         creep.memory.stillFill = false;
                    }
                }
            }
        }
        
        //no work found and source empty, goto source to start gathering or gather dropped resources
        if(!workFound && Game.getObjectById(sourceID).energy == 0) {
            if(!creep.pos.isNearTo(Game.getObjectById(sourceID))) {
                creep.moveTo(Game.getObjectById(sourceID));
            } 
        //no work found but source has still energy, idle near structures to drop energy immediately if required. BUT only of storages are all filled
        } else if(!workFound) {
            creep.say('idle');
            
            var containers = getNotFullContainers(creep);
            
            //drop energy to containers (for later use)
            if(containers.length > 0) {
                creep.say('LOL');
                if(creep.transfer(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containers[0]);
                } 
            //idle infront of spawn, extension or tower to drop energy immediately when required
            } else {
            
               var idleTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION ||
                                    structure.structureType == STRUCTURE_SPAWN ||
                                    structure.structureType == STRUCTURE_TOWER);
                        }, algorithm:'dijkstra'}); 
                        
                if(!creep.pos.isNearTo(idleTarget)) {
                    creep.moveTo(idleTarget);
                } 
            }
        }
	}
};

function getNotFullContainers(creep) {
    var count = 0;
    var containers = [];
    for(var i = 0; i < containerIDs.length; ++i) {
        var container = Game.getObjectById(containerIDs[i]);
        if(_.sum(container.store) < container.storeCapacity) {
            containers[count++] = container;
        }
    }
    return containers;
}

function getActiveCarryPartsCount(creep) {
    var carryPartsCount = 0;
    var creepBody = creep.body;
    for(var i = 0; i < creepBody.length; ++i) {
        if(creepBody[i].type == CARRY) {
            ++carryPartsCount;
        }
    }
    return carryPartsCount;
}

function collectDroppedEnergy(creep) {
    var droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
    
    if(droppedEnergy) {
        if(creep.pos.inRangeTo(droppedEnergy, droppedEnergyHarvestDistance)) {
            if(creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
                creep.moveTo(droppedEnergy);
            }
        }
    }
}

module.exports = roleHarvester;