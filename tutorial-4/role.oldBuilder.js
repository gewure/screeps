
var containerID = '5775d7690905cd942b576c92';
var untilPathRecalc = 2;
var meanPathLengthController = 20;
var roleOldBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        container = Game.getObjectById(containerID);

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
	        
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else { //repair
            
             var freshWallOrRamp = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                        filter: (structure) => {
                            return ((structure.structureType == STRUCTURE_WALL && structure.hits ==1) ||
                                    (structure.structureType == STRUCTURE_RAMPART && structure.hits ==1));
                }, algorithm:'dijkstra'}); 
    

                if(creep.repair(freshWallOrRamp) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(freshWallOrRamp);
                } 
            
            console.log('repairing something');
                var closestDamagedStructure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                        filter: (structure) => {
                            return ((structure.structureType == STRUCTURE_WALL && structure.hits < (1/30000)*structure.hitsMax) ||
                                    (structure.structureType == STRUCTURE_RAMPART && structure.hits < (1/20)*structure.hitsMax));
                }, algorithm:'dijkstra'}); 
    

                if(creep.repair(closestDamagedStructure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestDamagedStructure);
                } 
            }
            
	    } else {
	       // not building
	       if(creep.carry.energy < creep.carryCapacity && creep.ticksToLive > 50) {
                creep.memory.state = 'fill';
                var stateChanged = hasStateChanged(creep);
                var activeCarryParts = getActiveBodyPartCount(creep, CARRY);
                fillFromContainer(creep, stateChanged, activeCarryParts * 50);
                
            //container is empty
            /*
                TODO: creeps nehmen trotzem gleich viel mit. wahrschienlich weil sie ein paar mal eine kleinere menge aufnehmen. flag benötigt!
            */
            }
	    } 
	    
	    

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
module.exports = roleOldBuilder;
        