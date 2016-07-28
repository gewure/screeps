/*var leftMine= '576a9cb857110ab231d899fa';
var rightMine='576a9cb857110ab231d899f8';
var controlSource = leftMine; //left mine
var state = 'spawned'; */

var containerID = '577acd04d33b4b4d0f4bf616';
var linkID = '5790ce3942b995c61809fa8d';
var secondContainerID = '577acd04d33b4b4d0f4bf616';
var container = undefined;
var untilPathRecalc = 2;
var meanPathLengthController = 20;

var minContVal = 200;

var roleUpgrader = {
    
    run: function(creep) {
        
      //###################################### death logic
	   /* if(creep.ticksToLive <= 35) {
	        
    	     var targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ( structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_TOWER) && _.sum(structure.energy) < structure.energyCapacity;
                    }
                    });
                    
            if(targets.length > 0) {
                creep.moveTo(targets[0]);
                if(creep.transfer(targets[0], RESOURCE_ENERGY, creep.carry.energy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
	    }*/
	    //####################################
        
         if(creep.memory.state == undefined) {
            creep.memory.state = 'fill';
        }
        
         if(creep.memory.stillWork == undefined) {
            creep.memory.stillWork = false;
        }
        
        container = Game.getObjectById(containerID);
        var link = Game.getObjectById(linkID);

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

            fillFromContainer(creep, stateChanged, creep.carryCapacity,link);
                        creep.moveTo(link);

            //upgradeContr(creep, stateChanged); 

        //container is empty
        /*
            TODO: creeps nehmen trotzem gleich viel mit. wahrschienlich weil sie ein paar mal eine kleinere menge aufnehmen. flag benötigt!
        */
        } else if(creep.carry.energy < creep.carryCapacity && creep.ticksToLive < 50) {
            creep.memory.state = 'fill';
            var stateChanged = hasStateChanged(creep);
            var activeWorkParts = getActiveBodyPartCount(creep, WORK);
            var energyAmount = creep.ticksToLive / activeWorkParts;
            fillFromContainer(creep, stateChanged, creep.carryCapacity, link);

        }
        
        creep.memory.stateBefore = creep.memory.state;
	}
};

function fillFromContainer(creep, stateChanged, energyAmount,link) {
    if(link.energy > minContVal) {
     
        if(creep.withdraw(link, RESOURCE_ENERGY, energyAmount - creep.carry.energy) == ERR_NOT_IN_RANGE) {
            if(creep.pos.getRangeTo(link) == 0){
                creep.moveTo(36,36);
            } else {
                if(creep.move(creep.pos.getDirectionTo(link)) == ERR_NO_PATH) {
                    creep.move(creep.pos.getDirectionTo(link));
                }
            }
        }//else goto(creep, stateChanged, link);
    } else {
        /*if(_.sum(container.store) > minContVal) {
            //mit nearto ersetzten
            if(creep.pos.isNearTo(container)) {
                container.transfer(creep, RESOURCE_ENERGY, energyAmount - creep.carry.energy);
                
            } else goto(creep, stateChanged, container);
    
        //idle to reduce cpu load  
        } else {
            var container2 = Game.getObjectById(secondContainerID);
            if(container2.store.energy> 0) {
               if(container2.transfer(creep, RESOURCE_ENERGY, energyAmount - creep.carry.energy)==ERR_NOT_IN_RANGE) {
                   creep.moveTo(container2);
               }
            }
        } */
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