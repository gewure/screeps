/*var leftMine= '576a9cb857110ab231d899fa';
var rightMine='576a9cb857110ab231d899f8';

var controlSource = leftMine; //left mine
var state = 'spawned'; */

var containerID = '5773f5d774e2c6695fefdb07';
var container = undefined;
var untilPathRecalc = 2;
var meanPathLengthController = 20;

var roleUpgrader = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
        
         if(creep.memory.state == undefined) {
            creep.memory.state = 'fill';
        }
        
         if(creep.memory.stillWork == undefined) {
            creep.memory.stillWork = false;
        }
        
        container = Game.getObjectById(containerID);
        
        //creep can't carry more, goto controller
        if(creep.carry.energy == creep.carryCapacity || creep.memory.stillWork) {
            creep.memory.state = 'work';
            var stateChanged = hasStateChanged(creep);
            upgradeContr(creep, stateChanged); 
        //creep has no energy, go container
        } else if(creep.carry.energy < creep.carryCapacity && creep.ticksToLive > 50) {
            creep.memory.state = 'fill';
            var stateChanged = hasStateChanged(creep);
            var activeCarryParts = getActiveBodyPartCount(creep, CARRY);
            fillFromContainer(creep, stateChanged, activeCarryParts * 50);
            
        //container is empty
        /*
            TODO: creeps nehmen trotzem gleich viel mit. wahrschienlich weil sie ein paar mal eine kleinere menge aufnehmen. flag benötigt!
        */
        } else if(creep.carry.energy < creep.carryCapacity && creep.ticksToLive < 50) {
            creep.memory.state = 'fill';
            var stateChanged = hasStateChanged(creep);
            var activeWorkParts = getActiveBodyPartCount(creep, WORK);
            var energyAmount = creep.ticksToLive / activeWorkParts;
            fillFromContainer(creep, stateChanged, energyAmount);
        }
        
        creep.memory.stateBefore = creep.memory.state;
	}
};

function fillFromContainer(creep, stateChanged, energyAmount) {
    if(_.sum(container.store) > 0) {
        //mit nearto ersetzten
        if(creep.pos.isNearTo(container)) {
            container.transfer(creep, RESOURCE_ENERGY, energyAmount - creep.carry.energy);
        } else goto(creep, stateChanged, container);

    //idle to reduce cpu load  
    } else {
        if(!creep.pos.isNearTo(container)) {
            goto(creep, stateChanged, container);
        }
    }
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

function hasStateChanged(creep) {
    if(creep.memory.state != creep.memory.stateBefore)
        return true;
    else return false;
}

function newPath(creep, target) {
    return creep.pos.findPathTo(target, {algorithm: 'astar'});
}

function upgradeContr(creep, stateChanged) {
   
    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        goto(creep, stateChanged, creep.room.controller);
    }
    if(creep.carry.energy > 0) {
        creep.memory.stillWork = true;
    } else {
        creep.memory.stillWork = false;
    }
}

module.exports = roleUpgrader;