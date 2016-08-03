var storageID = '5785398b91941a441c38dd7e';
var containerIDs = ['57838ab529a954705ae3d17b', '5782574e6405edfc66d18381'];
var contStorIDs = ['57838ab529a954705ae3d17b', '5782574e6405edfc66d18381', '5785398b91941a441c38dd7e'];
var towerIDs = ['578165832b0f16cb03ea73e4'];

var container = null;
var untilPathRecalc = 2;
var reFillFactorFullContainer = 10;
var minEnergyLimit = 100;


var roleOtherRoomTransporter = {
    
    /** @param {Creep} creep **/
    run: function(creep, contIDs, contStorIDs, towIDs) {
        containerIDs = contIDs;
        containerIDsWStorage = contStorIDs;
        towerIDs = towIDs;
        
        /* if(creep.pos.room != 'E31N1') {
            creep.memory.isInOtherRoom=false;
        } else {
            creep.memory.isInOtherRoom=true;
        } */
        
        //GOTO OTHER ROOM
      /*  if(!creep.pos.isNearTo(Game.flags['extraResource']) && !creep.memory.isInOtherRoom) {
            console.log('[otherRoomTransporter] is in the wrong room ..');
            
            creep.moveTo(Game.flags['extraResource']);
            creep.memory.isInOtherRoom=false;
        } else {
            creep.memory.isInOtherRoom=true;
            console.log('allahuaakbah am in the room');
        } */
        
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
            if(creep.ticksToLive > 30) {
                creep.memory.state = 'fill';
                var stateChanged = hasStateChanged(creep);
                fillFromContainer(creep, stateChanged, activeCarryCount);
            }
            
             //###################################### death logic
        	    if(creep.ticksToLive <= 35) {
        	        
            	     var targets = creep.room.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return ( structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION ||
                                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                            }
                            });
                            
                    if(targets.length > 0) {
                        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0]);
                        }
                    }
        	    }
	    //####################################
        } 
        creep.memory.stateBefore = creep.memory.state;
	}
};

function fillFromContainer(creep, stateChanged, activeCarryCount) {
    
    var emptyExtensions = creep.room.find(FIND_MY_STRUCTURES, {
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
    } else {
        checkForTowerFill(creep, stateChanged, activeCarryCount);
    }
}

function checkForTowerFill(creep, stateChanged, activeCarryCount) {
    var closestTowerLowEnergy = getClosestLowEnergyTower(creep, activeCarryCount * 50);

    try {
        
        
        if(closestTowerLowEnergy != null) {
            fillTower(creep, closestTowerLowEnergy, stateChanged);
                
        } else if(_.sum(creep.room.storage.store) < creep.room.storage.storeCapacity) {
            
            if(creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                goto(creep, stateChanged, creep.room.storage);
            }
        }
    } catch (noStorageException) {
        console.log('no storage yet exception on transporter')
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
        if(container.store[RESOURCE_ENERGY] > minEnergyLimit) 
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

module.exports = roleOtherRoomTransporter;