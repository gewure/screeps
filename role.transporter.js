var containerIDs = [];
var containerIDsWStorage = [];
var container = undefined;
var untilPathRecalc = 2;
var reFillFactorFullContainer = 10;
var minEnergyLimit = 0;
var towerIDs = [];
var minCapLinkIDs = undefined;
var mainContainer = undefined;
var bigStoreID = undefined;

var roleTransporter = {
    
    /** @param {Creep} creep **/
    run: function(creep, contIDs, contStorIDs, towIDs, minLinkID, mainCont, bigStID) {
        containerIDs = contIDs;
        containerIDsWStorage = contStorIDs;
        towerIDs = towIDs;
        minCapLinkIDs = minLinkID;
        mainContainer = mainCont;
        bigStoreID = bigStID;

        if(creep.memory.state == undefined) creep.memory.state = 'fill';
        if(creep.memory.stillDistribute == undefined) creep.memory.stillDistribute = false;
        
        var activeCarryCount = getActiveBodyPartCount(creep, CARRY);
        
        //creep can't carry more, getClosest controller
        if(creep.carry.energy == creep.carryCapacity || (creep.memory.stillDistribute && creep.carry.energy > 0)) {
            creep.memory.state = 'distribute';
            var stateChanged = hasStateChanged(creep);
            distribute(creep, stateChanged, activeCarryCount); 
        //creep has no energy, go to container
        } else if(creep.carry.energy < creep.carryCapacity) {
            //only collect if creep has more than x ticks to live
            if(creep.ticksToLive >= 10) {
                creep.memory.state = 'fill';
                var stateChanged = hasStateChanged(creep);
                fillFromContainer(creep, stateChanged, activeCarryCount);
            }
        } 
        creep.memory.stateBefore = creep.memory.state;
	}
};

function fillFromContainer(creep, stateChanged, activeCarryCount) {
    
    var emptyExtensions = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
                    }, algorithm:'dijkstra'});
    
    if(emptyExtensions.length > 0) {
        //first check if main containers have more energy than the creep can carry, else go to big storage
        var carryParts = getActiveBodyPartCount(creep, CARRY);
        var closestArray = [];
        for(var i = 0; i < containerIDsWStorage.length; ++i) {
            var container = Game.getObjectById(containerIDsWStorage[i]); 
            if(container.store[RESOURCE_ENERGY] > carryParts * 50 || (creep.pos.isNearTo(container) && container.store[RESOURCE_ENERGY] > carryParts * 50)) 
                closestArray[closestArray.length] = container;
        }
        if(closestArray.length > 0) {
            var closest = creep.pos.findClosestByRange(closestArray);
            if(closest.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                goto(creep, stateChanged, closest);
            }
            
        } else {
            //no container with more energy than te creep can carry, search containers with more than 0 energy
            for(var i = 0; i < containerIDsWStorage.length; ++i) {
            var container = Game.getObjectById(containerIDsWStorage[i]); 
            if(container.store[RESOURCE_ENERGY] > 0 || (creep.pos.isNearTo(container) && container.store[RESOURCE_ENERGY] > 0)) 
                closestArray[closestArray.length] = container;
            }
            if(closestArray.length > 0) {
                var closest = creep.pos.findClosestByRange(closestArray);
                if(closest.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    goto(creep, stateChanged, closest);
                }
            } 
        }
            
    } else {
        var arr = undefined;
        if(minCapLinkIDs != undefined) arr = containerIDs;
        else arr = mainContainer;
        
        var container = getClosestHighEnergyContainer(creep, 100, arr);
        if(container) {
            if(container.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                goto(creep, stateChanged, container);
            }
        }
    }
}

function distribute(creep, stateChanged, activeCarryCount) {
    //HIER UMSCHREIBEN IN EINZELNE IF-bedingung um mehrere objekte auszuschließen (liste der targets der anderen transporter wenn ziel kapazität überschreiten würde)
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
                    }, algorithm:'dijkstra'});           
    
    creep.memory.containerPath = undefined;


    if(target != null) {
        var result = creep.transfer(target, RESOURCE_ENERGY);
        if(result == ERR_NOT_IN_RANGE) {
            goto(creep, stateChanged, target);
        } else if(result == OK) {
            //delete path to recalc in next tick
            creep.memory.containerPath = undefined;
        }
        
        if(creep.carry.energy > ((creep.carryCapacity / 100) * reFillFactorFullContainer)) {
            creep.memory.stillDistribute = true;
        } else {
            creep.memory.stillDistribute = false;
        }
    
    //transfer energy from storage to tower if tower has less energy than the transporter can carry. if tower has enough, transfere rest to big storage 
    //or fillmin cap containers
    } else {
        if(!checkForTowerFill(creep, stateChanged, activeCarryCount)) {
            var minCaps = getMinCapLinkContainer();
            var big = Game.getObjectById(bigStoreID);
            if(minCaps != undefined) {
                fillMinCap(creep, minCaps[0], stateChanged);
            } else if(big != undefined) {
                if(creep.transfer(big, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    goto(creep, stateChanged, big);
                }
            }
        }
    }
}

function checkForTowerFill(creep, stateChanged, activeCarryCount) {
    var closestTowerLowEnergy = getClosestLowEnergyTarget(creep, 150, towerIDs);

    if(closestTowerLowEnergy != null) {
        fillTower(creep, closestTowerLowEnergy, stateChanged);
        return true;
            
    } else if(creep.room.store != undefined && _.sum(creep.room.storage.store) < creep.room.storage.storeCapacity) {
        
        if(creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            goto(creep, stateChanged, creep.room.storage);
        }
    }
    return false;
}

// falls links spezifiziert worden sind, die immer bis zu einem gewiwsen cap gefüllt sien müssen, gib sie zurück
function getMinCapLinkContainer() {
    
    var targets = undefined;
    if(minCapLinkIDs != undefined) {
        //check if a container has less energy than defined
        
        for(var contID in minCapLinkIDs) {
            var realCont = Game.getObjectById(contID);
            
            if((realCont.store == undefined && realCont.energy < minCapLinkIDs[contID]) || (realCont.store != undefined && _.sum(realCont.store) < minCapLinkIDs[contID])) {
                if(targets == undefined) targets = [];
                targets[targets.length] = realCont;
            } 
        }
    }
    
    return targets;
}

function fillMinCap(creep, target, stateChanged) {
    
    //fill from storage
    if(creep.carry.energy < creep.carryCapacity) {
        
        var container = getClosestHighEnergyContainer(creep, minEnergyLimit, containerIDsWStorage);
        //if a non-empty container exists, go there
        if(container) {
            if(container.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                goto(creep, stateChanged, container);
            }
        //all storages are empty, idle at storage
        } else {
               goto(creep, stateChanged, creep.room.storage);
        }
        
    //fill tower
    } else {
        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            goto(creep, stateChanged, target);
    }
}

function fillTower(creep, tower, stateChanged) {
    
    //fill from storage
    if(creep.carry.energy < creep.carryCapacity) {
        
        var container = getClosestHighEnergyContainer(creep, minEnergyLimit, containerIDsWStorage);
        //if a non-empty container exists, go there
        if(container) {
            if(container.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                goto(creep, stateChanged, container);
            }
        //all storages are empty, idle at storage
        } else {
               goto(creep, stateChanged, creep.room.storage);
        }
        
    //fill tower
    } else {
        if(creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            goto(creep, stateChanged, tower);
    }
}

function getActiveBodyPartCount(creep, part) {
    var carryPartsCount = 0;
    var creepBody = creep.body;
    for(var i = 0; i < creepBody.length; ++i) {
        if(creepBody[i].type == part) {
            ++carryPartsCount;
        }
    }
    return carryPartsCount;
}

function getClosestHighEnergyContainer(creep, minEnergyLimit, idArray) {
    var closestArray = [];
    for(var i = 0; i < idArray.length; ++i) {
        var container = Game.getObjectById(idArray[i]); 
        if(_.sum(container.store) > minEnergyLimit) 
            closestArray[closestArray.length] = container;
    }
    var closest = creep.pos.findClosestByRange(closestArray);
    return closest;
}

function getClosestLowEnergyTarget(creep, energyLimit, targetIDs) {
    var closestArray = [];
    for(var i = 0; i < targetIDs.length; ++i) {
        var target = Game.getObjectById(targetIDs[i]); 
        if(target != null && ((target.store == undefined && target.energy < target.energyCapacity - energyLimit) || (target.store != undefined && _.sum(target.store) < target.storeCapacity - energyLimit))) {
            closestArray[closestArray.length] = target;
        }
    }
    var closest = creep.pos.findClosestByRange(closestArray);
    return closest;
}

function goto(creep, stateChanged, target) {
    if(creep.memory.containerPath == undefined || stateChanged) {
        var path = newPath(creep, target);
        creep.memory.containerPath = path;
    }
    var gotoResult = 0;
    if((gotoResult = creep.moveByPath(creep.memory.containerPath)) != -11) {
        //if path is blocked, count
        if(creep.pos.x == creep.memory.prevX && creep.pos.y == creep.memory.prevY) {
            
            if(creep.memory.pathRecalcCount == undefined) {
                creep.memory.pathRecalcCount = 0;
            }
            
            if(++creep.memory.pathRecalcCount >= untilPathRecalc) {
               
                creep.memory.containerPath = undefined;
                creep.memory.pathRecalcCount = 0;
            }
        } else {
            creep.memory.pathRecalcCount = 0;
        } 
        creep.memory.prevX = creep.pos.x;
        creep.memory.prevY = creep.pos.y;
    }
    return gotoResult;
}

function hasStateChanged(creep) {
    if(creep.memory.state != creep.memory.stateBefore)
        return true;
    else return false;
}

function newPath(creep, target) {
    return creep.pos.findPathTo(target, {algorithm: 'astar'});
}

module.exports = roleTransporter;