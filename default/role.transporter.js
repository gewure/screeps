var storageID = '577b2f88e03b2946707baba5';
var containerIDs = ['57796949720916567dc376ca', '5779cfd7986f591c34eadf9a', '5779b1268eef705e48c33a6e', '577acd04d33b4b4d0f4bf616', '577af4e8502328d4276d1a7d'];
var contStorIDs = ['57796949720916567dc376ca', '5779b1268eef705e48c33a6e', '5779cfd7986f591c34eadf9a', '577acd04d33b4b4d0f4bf616','577af4e8502328d4276d1a7d', '577b2f88e03b2946707baba5'];
var towerIDs = ['5779f6286ce428014acf2e71', '577ecaedd47f7a6d1f04ec04'];
var baseLinkID = ['577f2b75f5dd02623e306006'];

var container = null;
var untilPathRecalc = 2;
var reFillFactorFullContainer = 1;
var minEnergyLimit = 1000;
var minLinklimit = 300;
var minLinkAmount =250;

var roleTransporter = {
    
    /** @param {Creep} creep **/
    run: function(creep, contIDs, contStorIDs, towIDs, storageID) {
        containerIDs = contIDs;
        containerIDsWStorage = contStorIDs;
        towerIDs = towIDs;
        var link = Game.getObjectById(baseLinkID);
        var stor = Game.getObjectById(storageID);
        
        if(creep.memory.state == undefined) creep.memory.state = 'fill';
        if(creep.memory.stillDistribute == undefined) creep.memory.stillDistribute = false;
        
        var activeCarryCount = getActiveBodyPartCount(creep, CARRY);
        
        
        //creep can't carry more, getClosest controller
        if(creep.carry.energy == creep.carryCapacity || (creep.memory.stillDistribute && creep.carry.energy > 0)) {
            creep.memory.state = 'distribute';
            var stateChanged = hasStateChanged(creep);
            if(!distribute(creep, stateChanged, activeCarryCount)) {
                if(link.energy < minLinkAmount && creep.memory.state!='distribute') {
                    creep.say('yep, ');
                    if(creep.carry.energy == 0) {
                        if(creep.withdraw(stor, RESOURCE_ENERGY)==ERR_NOT_IN_RANGE) {
                            creep.moveTo(stor);
                        }
                    } else {
                        if(creep.carry.energy == creep.carryCapacity) {
                            if(creep.transfer(link,RESOURCE_ENERGY, creep.carry.energy)== ERR_NOT_IN_RANGE) {
                                creep.moveTo(link);
                            }
                        }
                    }
                }
            }
            
            
        //creep has no energy, go to container
        } else if(creep.carry.energy < creep.carryCapacity) {
            //only collect if creep has more than x ticks to live
            if(creep.ticksToLive > 30) {
                creep.memory.state = 'fill';
                var stateChanged = hasStateChanged(creep);
                //console.log('FILL FROM CONTAINER');
                
                fillFromContainer(creep, stateChanged, activeCarryCount);
            }
            
            
        }
        creep.memory.stateBefore = creep.memory.state;
	}
};

function fillFromContainer(creep, stateChanged, activeCarryCount) {
        //creep.say('neurosis');
    var emptyExtensions = creep.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
        return (structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
    }, algorithm:'dijkstra'});
    
    if(emptyExtensions.length > 0) {
        var container = getClosestHighEnergyContainer(creep, minEnergyLimit, containerIDs);
                console.log('TRANSPORTER :' + container);
        var stor = Game.getObjectById(storageID);

        if(container) {
            if(container.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                goto(creep, stateChanged, container);
            }
        } else {
         container = getClosestHighEnergyContainer(creep, minEnergyLimit, containerIDs);
            if(creep.withdraw(stor, RESOURCE_ENERGY)==ERR_NOT_IN_RANGE) {
                goto(creep, stateChanged, stor);
            }
        }
    } else {
        var container = getClosestHighEnergyContainer(creep, minEnergyLimit, containerIDs);
        var link = Game.getObjectById(storageID);
        //console.log(container);
        if(link) { // find containers > limit
            if(link.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                goto(creep, stateChanged, link);
            }
        } else  { // no container > limit, go to link!
            if(link.transferEnergy(creep, creep.carryCapacity) == ERR_NOT_IN_RANGE) {
             goto(creep, stateChanged, link);
            }
        }
    }
}

function distribute(creep, stateChanged, activeCarryCount) {
    creep.say('distribute');
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

        if(closestTowerLowEnergy != null) {
            fillTower(creep, closestTowerLowEnergy, stateChanged);
                
        } else if(_.sum(creep.room.storage.store) < creep.room.storage.storeCapacity) {
            
            if(creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                goto(creep, stateChanged, creep.room.storage);
            }
        }
   
}

function fillTower(creep, tower, stateChanged) {
    
    //fill from storage
    if(creep.carry.energy < creep.carryCapacity) {
        
        var container = getClosestHighEnergyContainer(creep, minEnergyLimit, containerIDs);
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
        if(container.store.energy > minEnergyLimit) 
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

module.exports = roleTransporter;