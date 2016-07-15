var untilPathRecalc = 1;

var roleReserver = {
    run: function(creep, storageID, controllerFlagName, fleeTarget, harvestRoomName) {
        
        if(!checkFlee(creep, storageID, fleeTarget, harvestRoomName)) {
            if(creep.memory.state == undefined) creep.memory.state = 'fill';
            if(creep.room.name == creep.memory.spawnRoomName) {
    
                creep.memory.state = 'upgrade';
                var s = Game.flags[controllerFlagName];
                goto(creep, hasStateChanged(creep), s);
             
            //creep is in other room   
            } else {
                creep.memory.state = 'upgrade';
                if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    goto(creep, hasStateChanged(creep), creep.room.controller);
                }
                
            }
            creep.memory.stateBefore = creep.memory.state;
        }
    }
};

function isCreepAtEdge(creep) {
    if (creep.pos.x == 0 || creep.pos.x == 49 || creep.pos.y == 0 || creep.pos.y == 49){console.log('AT EDGE'); return true;}
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

function hasStateChanged(creep) {
    if(creep.memory.state != creep.memory.stateBefore)
        return true;
    else return false;
}

function checkSuicide(creep) {
   var npcs = creep.room.find(FIND_HOSTILE_CREEPS, {
            filter: (object) => {return (object.owner.username == 'Invader');}, algorithm:'astar'
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
module.exports = roleReserver;