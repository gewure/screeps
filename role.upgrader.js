var containerID = '';
var container = undefined;
var untilPathRecalc = 2;
var nearDeadTicksEnergyReduce = 5;

var roleUpgrader = {
    
    /** @param {Creep} creep **/
    run: function(creep, contID) {
        containerID = contID;
        if(creep.memory.nearDead == undefined) creep.memory.nearDead = false;
        if(creep.memory.state == undefined) creep.memory.state = 'fill';
        if(creep.memory.stillWork == undefined) creep.memory.stillWork = false;
        if(creep.memory.filledNearDead == undefined) creep.memory.filledNearDead = false;
        
        container = Game.getObjectById(containerID);
        
        //creep can't carry more, goto controller
        if(creep.carry.energy == creep.carryCapacity || creep.memory.stillWork || (creep.memory.nearDead && creep.memory.filledNearDead)) {
            creep.memory.state = 'work';
            creep.memory.nearDead = false;
            var stateChanged = hasStateChanged(creep);
            upgradeContr(creep, stateChanged); 
        //creep has no energy, go container
        } else if(creep.carry.energy < creep.carryCapacity && creep.ticksToLive > nearDeadTicksEnergyReduce) {
            creep.memory.state = 'fill';
            creep.memory.nearDead = false;
            var stateChanged = hasStateChanged(creep);
            var activeCarryParts = getActiveBodyPartCount(creep, CARRY);
            fillFromContainer(creep, stateChanged, activeCarryParts * 50);
            
        //container is empty
        } else if(creep.carry.energy < creep.carryCapacity && creep.ticksToLive <= nearDeadTicksEnergyReduce) {
            creep.memory.state = 'fill';
            creep.memory.nearDead = true;
            var stateChanged = hasStateChanged(creep);
            var activeWorkParts = getActiveBodyPartCount(creep, WORK);
            var energyAmount = creep.ticksToLive / activeWorkParts;
            fillFromContainer(creep, stateChanged, energyAmount);
        }
        
        creep.memory.stateBefore = creep.memory.state;
	}
};

function fillFromContainer(creep, stateChanged, energyAmount) {
    if(container.energy > 0) {
        if(creep.pos.isNearTo(container)) {
            var result = container.transferEnergy(creep, energyAmount - creep.carry.energy);
            if(creep.memory.nearDead)
                creep.memory.filledNearDead = true;
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
    return gotoResult;
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
    
    var result = creep.upgradeController(creep.room.controller); 
    if(result == ERR_NOT_IN_RANGE) {
        goto(creep, stateChanged, creep.room.controller);

    //delete this part to allow more than one upgrader to get energy from the container/link
    } else if(result == OK) {
        var energyAmount = 0;
        var activeWorkParts = getActiveBodyPartCount(creep, WORK);
        if(creep.ticksToLive < nearDeadTicksEnergyReduce) {
            energyAmount = creep.ticksToLive / activeWorkParts;
        } else {
            energyAmount = getActiveBodyPartCount(creep, CARRY) * 50;
        }
         fillFromContainer(creep, stateChanged, energyAmount);
    }
    if(creep.carry.energy > 0) {
        creep.memory.stillWork = true;
    } else {
        creep.memory.stillWork = false;
    }
}

module.exports = roleUpgrader;