
var storageID = '576a9cb857110ab231d899f8';
var containerIDs = ['5773cc3684ed25e4699c070c', '5773f5d774e2c6695fefdb07', '57745542b6d085646bee57cf'];
var containerIDsWStorage = ['5773cc3684ed25e4699c070c', '5773f5d774e2c6695fefdb07', storageID];
var container = undefined;
var untilPathRecalc = 2;
var reFillFactorFullContainer = 25;
var minEnergyLimit = 0;
var towerIDs = ['5773e3fae6d164973b320b2c'];

var roleTransporter = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
        
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
            if(creep.ticksToLive > 20) {
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
        var container = getClosestHighEnergyContainer(creep, minEnergyLimit, containerIDsWStorage);
        if(container) {
            if(container.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                goto(creep, stateChanged, container);
            }
        }
    } else {
        var container = getClosestHighEnergyContainer(creep, minEnergyLimit, containerIDs);
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
    if(target != null) {
        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            goto(creep, stateChanged, target);
        } else {
            //walk back NOW
            
        }
        
        if(creep.carry.energy > ((creep.carryCapacity / 100) * reFillFactorFullContainer)) {
            creep.memory.stillDistribute = true;
        } else {
            creep.memory.stillDistribute = false;
        }
    
    //transfer energy from storage to tower if tower has less energy than the transporter can carry. if tower has enough, transfere rest to big storage 
    } else {
        checkForTowerFill(creep, stateChanged, activeCarryCount);
    }
}

function checkForTowerFill(creep, stateChanged, activeCarryCount) {
    var closestTowerLowEnergy = getClosestLowEnergyTower(creep, activeCarryCount * 50);

    if(closestTowerLowEnergy != null) {
        fillTower(creep, closestTowerLowEnergy, stateChanged);
            
    } //else if(_.sum(creep.room.storage.store) < creep.room.storage.storeCapacity)
        else if (_.sum(Game.getObjectById(containerIDs[2]).carry < Game.getObjectById(containerIDs[2]).carryCapacity)) {
        
        if(creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            goto(creep, stateChanged, creep.room.storage);
        }
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
            console.log('transporter '+ creep.name + ' wants to idle');
            var idlePos = creep.room.controller; //TODO
               goto(creep, stateChanged, idlePos );
               //creep.move(TOP | BOTTOM);
               
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

function getClosestLowEnergyTower(creep, energyLimit) {
    var closestArray = [];
    for(var i = 0; i < towerIDs.length; ++i) {
        var tower = Game.getObjectById(towerIDs[i]); 
        if(tower.energy < tower.energyCapacity - energyLimit) {
            closestArray[closestArray.length] = tower;
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