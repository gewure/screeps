var untilPathRecalc = 1;

var harvestInRoom = false;

var rolePioneer = {
    run: function(creep, storageID, roomFlagName, fleeTarget, harvestRoomName) {
        if(Memory.tempPioSource2Busy == undefined) Memory.tempPioSource2Busy = false;
        
        checkSourceDeadCreep();
        if(!checkFlee(creep, storageID, fleeTarget, harvestRoomName)) {
            if(creep.memory.reHarvest == undefined) creep.memory.reHarvest = false;
            if(creep.memory.state == undefined) creep.memory.state = 'fill';
            if(creep.room.name == creep.memory.spawnRoomName) {
                //find container 
                if(creep.carry.energy == 0 && creep.ticksToLive > 80) {
                    creep.memory.state = 'fill';
                    if(Game.getObjectById(storageID).transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        goto(creep, hasStateChanged(creep), Game.getObjectById(storageID));
                    }
                //go to other room
                } else if (creep.ticksToLive > 80) {
                    creep.memory.state = 'build';
                    var s = Game.flags[roomFlagName];
                    goto(creep, hasStateChanged(creep), s);
                }
             
            //creep is in other room   
            } else {
                if(creep.carry.energy > 0 && creep.memory.reHarvest == false) {
                    creep.memory.state = 'build';
                    preCheckStates(creep);
                    buildingState(creep);
                    
                //walk back
                } else {
                    //harvest energy
                    if(harvestInRoom) {
                        var source1 = Game.getObjectById('576a9cd857110ab231d89d0a');
                        var source2 = Game.getObjectById('576a9cd857110ab231d89d08');
                        
                       // var targetSource = (source1.energy > 0) ? source1 : source2;
                        
                        //SPECIAL
                        if((!Memory.tempPioSource2Busy || Memory.tempPioSource2BusyCreep == creep.id) && source2.energy > 0) {
                            if(creep.pos.isNearTo(source1) && source1.energy > 0) {
                                targetSource = source1;
                            } else {
                                targetSource = source2;
                                Memory.tempPioSource2Busy = true;
                                Memory.tempPioSource2BusyCreep = creep.id;
                            }
                            
                        } else {
                            targetSource = source1;
                        }
                        
                        //SPECIAL END
                        creep.memory.state = 'fill';
                        var ret = undefined;
                        if((ret = creep.harvest(targetSource)) == ERR_NOT_IN_RANGE) {
                            goto(creep, hasStateChanged(creep), targetSource);
                        } else if(ret == OK) {
                            if(creep.carry.energy < creep.carryCapacity) {
                                creep.memory.reHarvest = true;
                            } else {
                                creep.memory.reHarvest = false;
                                if(Memory.tempPioSource2BusyCreep != undefined && creep.id == Memory.tempPioSource2BusyCreep) {
                                    Memory.tempPioSource2Busy = false;
                                    Memory.tempPioSource2BusyCreep = undefined;
                                }
                            }
                        }
                    } else {
                        creep.memory.state = 'fill';
                        goto(creep, hasStateChanged(creep), Game.getObjectById(storageID));
                    }
                }
            }
            creep.memory.stateBefore = creep.memory.state;
        }
    }
};

//SPECIAL
function checkSourceDeadCreep() {
    var ok = false;
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(Memory.tempPioSource2BusyCreep != undefined && Memory.tempPioSource2BusyCreep == creep.id) {
            ok = true;
            break;
        }
    }
    if(!ok) {
        Memory.tempPioSource2BusyCreep = undefined;
        Memory.tempPioSource2Busy = false;
    }
}
//SPECIAL END

function preCheckStates(creep) {
    if(creep.memory.building == undefined) {
        creep.memory.building = true; //only true to trigger harvest
    }
        
    //if currently in building state and without energy, reset worksite and goto harvest
	if(creep.memory.building && creep.carry.energy == 0) {
        creep.memory.building = false;
        creep.memory.tempWorksite = undefined;
           
    //if currently harvesting and cargo is full, or previously finished a worksite, search a new one
	} else if((!creep.memory.building && creep.carry.energy == creep.carryCapacity) || creep.memory.researchLoc) {
	    if(creep.memory.researchLoc) {
	        creep.memory.researchLoc = false;
	    }
	    
	    creep.memory.building = true;
	    searchNewTarget(creep);
	}
}

function isCreepAtEdge(creep) {
    if (creep.pos.x == 0 || creep.pos.x == 49 || creep.pos.y == 0 || creep.pos.y == 49) return true;
    else return false;
}

function goto(creep, stateChanged, target) {
    // if room changed, recalc
    if(creep.memory.roomBefore == undefined) creep.memory.roomBefore = creep.room.name;
    
    var tempPath = undefined;
    if(creep.memory.roomBefore != creep.room.name || creep.memory.path == undefined || stateChanged || creep.memory.pathBlocked) {
        creep.memory.path = creep.pos.findPathTo(target, {ignoreCreeps: ((creep.memory.pathBlocked != undefined) ? !creep.memory.pathBlocked : true)});
        if(creep.memory.pathBlocked) creep.memory.pathBlocked = false;
    }

    var gotoResult = undefined;
    if((gotoResult = creep.moveByPath(creep.memory.path)) != -11) {
        //if path is blocked, count
        if(creep.pos.x == creep.memory.prevX && creep.pos.y == creep.memory.prevY) {
            
            if(creep.memory.pathRecalcCount == undefined) creep.memory.pathRecalcCount = 0;
            if(creep.memory.pathBlocked == undefined) creep.memory.pathBlocked = false;

            if(++creep.memory.pathRecalcCount >= untilPathRecalc) {
                creep.memory.pathBlocked = true;
                creep.memory.pathRecalcCount = 0;
            }
        } else {
            creep.memory.pathRecalcCount = 0;
        } 
        creep.memory.prevX = creep.pos.x;
        creep.memory.prevY = creep.pos.y;
    }
    
    creep.memory.roomBefore = creep.room.name;
    return gotoResult;
}

//if creep is in building state
function buildingState(creep) {
    var target = Game.getObjectById(creep.memory.tempWorksite);
    //if target exists
    if(target) {
        //if target is finished search a new location
        if(target.hits - target.hitsMax == 0) {
            creep.memory.building = false;
            if(creep.carry.energy > 0) {
                creep.memory.researchLoc = true;
            }
        //if not finished, proceed with build/repair
        } else {
            buildRepair(creep, target);
        }
    //if the target does not exist anymore (destroyed, despawned, whatever)
    } else {
        creep.memory.building = false;
        creep.memory.tempWorksite = undefined;
        creep.memory.researchLoc = true;
    }
}

function buildRepair(creep, target) {
    if(creep.build(target) == ERR_NOT_IN_RANGE) {
        goto(creep, hasStateChanged(creep), target);
    } else if(creep.build(target) == ERR_INVALID_TARGET) {
        //if building failed, it should be something to repair..                
        if(creep.repair(target) == ERR_NOT_IN_RANGE) {
            goto(creep, hasStateChanged(creep), target);
        }
    } else {
        creep.build(target);
    }
}

function searchNewTarget(creep) {
    
    var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, 
    {
        //filter: (structure) => {return (structure.structureType != STRUCTURE_TERMINAL);},
    algorithm:'dijkstra'});
	
	if(constructionSite) {    
    	creep.memory.tempWorksite = constructionSite.id;
    	//console.log('OK   ' + constructionSite);
	} else {
	        
        var lowLifeTargets = creep.room.find(FIND_STRUCTURES, {
            filter: (object) => {return (object.hits < object.hitsMax && object.structureType == STRUCTURE_ROAD);}, algorithm:'dijkstra'
            });
        
        //lowLifeTargets.sort((a,b) => a.hits - b.hits);
        
        if(lowLifeTargets.length > 0) {
            creep.memory.tempWorksite = lowLifeTargets[0].id;
        }
        
    }
}

function hasStateChanged(creep) {
    if(creep.memory.state != creep.memory.stateBefore)
        return true;
    else return false;
}

function checkSuicide(creep) {
   var npcs = creep.room.find(FIND_HOSTILE_CREEPS, {
            filter: (object) => {return (object.owner != 'Atlan');}, algorithm:'astar'
    });
            
    if(npcs.length > 0) {
        creep.suicide();
        return true;
    }
    return false;
}


function checkFlee(creep, storageID, fleeTarget, harvestRoomName) {
    
    if(Memory.invaderInHarvestRoom[harvestRoomName] == true) {
        fleeAction(creep, storageID, fleeTarget);
        return true;
    }
    return false;
}

//RUN, you fools!
function fleeAction(creep, storageID, fleeTarget) {
    if(creep.ticksToLive < 40 && creep.carry.energy > 0) {
        if(creep.transfer(storageID, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.memory.path = undefined;
            goto(creep, hasStateChanged(creep), Game.getObjectById(storageID));
        }
    } else {
        if(!creep.pos.isNearTo(fleeTarget[0], fleeTarget[1])) {
            creep.memory.path = undefined;
            goto(creep, hasStateChanged(creep), new RoomPosition(fleeTarget[0], fleeTarget[1], creep.memory.spawnRoomName));
        }
    }
}
module.exports = rolePioneer;