var untilPathRecalc = 1;

var roleOtherRoomHarvester = {
    run: function(creep, sourceID, storageID, roomFlagName, enemiesInRoom, fleeTarget, harvestRoomName) {
        if(Memory.tempPioSource2Busy == undefined) Memory.tempPioSource2Busy = false;
        
        checkSourceDeadCreep();
        if(!checkFlee(creep, storageID, enemiesInRoom, fleeTarget, harvestRoomName)) {
            if(creep.memory.reHarvest == undefined) creep.memory.reHarvest = false;
            if(creep.memory.state == undefined) creep.memory.state = 'harvest';
            
            if(creep.room.name == creep.memory.spawnRoomName) {
                //find container 
                if(creep.carry.energy > 0) {
                    creep.memory.state = 'deliver';
                    if(creep.transfer(Game.getObjectById(storageID), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        goto(creep, hasStateChanged(creep), Game.getObjectById(storageID));
                    }
                //go to other room
                } else if (creep.ticksToLive > 80) {
                    creep.memory.state = 'harvest';
                    var s = Game.flags[roomFlagName];
                    goto(creep, hasStateChanged(creep), s);
                }
             
            //creep is in other room   
            } else {                
                if(creep.carry.energy < creep.carryCapacity && creep.ticksToLive > 80) {
                    creep.memory.state = 'harvest';
                    var source = Game.getObjectById(sourceID);
                    var result = undefined;
                    if((result = creep.harvest(source)) == ERR_NOT_IN_RANGE || (result == ERR_NOT_ENOUGH_RESOURCES && !creep.pos.isNearTo(source))) {
                        goto(creep, hasStateChanged(creep), source);
                    }
                //walk back
                } else {
                    creep.memory.state = 'deliver';
                    goto(creep, hasStateChanged(creep), Game.getObjectById(storageID));
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
    } else if(gotoResult == OK && creep.pos.isNearTo(creep.memory.path[creep.memory.path.length])) {
        console.log('RECALC PATH \'CAUSE CREEP CHANGED ROOM');
        creep.memory.path = undefined;
    } 
    
    creep.memory.roomBefore = creep.room.name;
    return gotoResult;
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
            
    if(npcs.length > 0 && creep.pos.roomName != creep.memory.spawnRoomName) {
        creep.suicide();
        return true;
    }
    return false;
}

function checkFlee(creep, storageID, enemies, fleeTarget, harvestRoomName) {
    
    if((enemies != undefined && enemies.length > 0) || (enemies == undefined && Memory.invaderInHarvestRoom[harvestRoomName] == true)) {
        fleeAction(creep, storageID, fleeTarget);
        return true;
    }
    return false;
}

//RUN, you fools!
function fleeAction(creep, storageID, fleeTarget) {
    if(creep.ticksToLive < 40 && creep.carry.energy > 0) {
        if(creep.transfer(storageID, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            goto(creep, hasStateChanged(creep), Game.getObjectById(storageID));
        }
    } else {
        if(!creep.pos.isNearTo(fleeTarget[0], fleeTarget[1])) {
            goto(creep, hasStateChanged(creep), new RoomPosition(fleeTarget[0], fleeTarget[1], creep.memory.spawnRoomName));
        }
    }
}
module.exports = roleOtherRoomHarvester;