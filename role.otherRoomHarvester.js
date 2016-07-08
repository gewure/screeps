var untilPathRecalc = 2;

var roleOtherRoomHarvester = {
    run: function(creep, sourceID, storageID, sourceFlagName) {
        if(creep.memory.state == undefined) creep.memory.state = 'harvest';
        if(creep.room.name == creep.memory.spawnRoomName) {
            //find container to store energy in
            if(creep.carry.energy != 0) {
                creep.memory.state = 'transport';
                if(creep.transfer(Game.getObjectById(storageID), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    goto(creep, hasStateChanged(creep), Game.getObjectById(storageID));
                }
            //go to other room
            } else {
                creep.memory.state = 'harvest';
                var s = Game.flags[sourceFlagName];
                goto(creep, hasStateChanged(creep), s);
            }
         
        //creep is in other room   
        } else {
            if(creep.carry.energy < creep.carryCapacity && creep.ticksToLive > 80) {
                creep.memory.state = 'harvest';
                var sou = Game.getObjectById(sourceID);
                if(creep.harvest(sou) == ERR_NOT_IN_RANGE) {
                    goto(creep, hasStateChanged(creep), sou);
                }
            //walk back
            } else {
                creep.memory.state = 'transport';
                goto(creep, hasStateChanged(creep), Game.getObjectById(storageID));
            }
        }
        creep.memory.stateBefore = creep.memory.state;
    }
};

function isCreepAtEdge(creep) {
    if (creep.pos.x == 0 || creep.pos.x == 49 || creep.pos.y == 0 || creep.pos.y == 49) return true;
    else return false;
}

function goto(creep, stateChanged, target) {
    // if room changed, recalc
    if(creep.memory.roomBefore == undefined) creep.memory.roomBefore = creep.room.name;
    
    var tempPath = undefined;
    if(isCreepAtEdge(creep)) {
        creep.moveTo(roomChangeDirection(creep, creep.room.name));
        creep.memory.path = undefined;
        //console.log('move direction: ' + roomChangeDirection(creep.pos.x - creep.memory.prevX, creep.pos.y - creep.memory.prevY) + ' for creep: [' + creep.name + ']');
        
    } else if(creep.memory.path == undefined || stateChanged || creep.memory.pathBlocked) {
        creep.memory.path = creep.pos.findPathTo(target);
        if(creep.memory.pathBlocked) creep.memory.pathBlocked = false;
    }

    var gotoResult = undefined;
    if(creep.memory.roomBefore == creep.room.name && (gotoResult = creep.moveByPath(creep.memory.path)) != -11) {
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

function roomChangeDirection(creep, nextRoom) {
    var x = creep.pos.x;
    var y = creep.pos.y;
    if (creep.pos.x == 0) x = 48;
    if (creep.pos.x == 49) x = 1;
    if (creep.pos.y == 0) y = 48;
    if (creep.pos.y == 49) y = 1;
    
    return new RoomPosition(x, y, nextRoom);
}

function hasStateChanged(creep) {
    if(creep.memory.state != creep.memory.stateBefore)
        return true;
    else return false;
}
module.exports = roleOtherRoomHarvester;