var roomStat = require('roomStatistics');
var utils = require('utils');

//config
var northSourceID = '576a9c7f57110ab231d892f6';
var containerNorthID = '57796949720916567dc376ca';

var southSourceID = '576a9c7f57110ab231d892f7';
var containerSouthID = '57796949720916567dc376ca';

var source = undefined;
var container = undefined;
var untilPathRecalc = 3;

var roleContHarv1 = {
    /** @param {Creep} creep **/
    run: function(creep) {
        
        //#### room stat
        //utils.creepSay(creep, '' +Math.ceil(roomStat.getTotalEnergy(creep.room)/1000)+'k', 3);
        
        if(creep.ticksToLive==42) {
            Game.spawns.ImNoobPlzDontKill.createCreep([WORK, WORK, WORK,WORK, WORK, CARRY, MOVE], undefined, {role:'contHarv1'});
        }
        if(creep.ticksToLive==1){
            container = Game.getObjectById(containerNorthID);
             if(creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container); //TODO: replace with path
             }
        }
    
        
	    try {
            if(creep.memory.state == undefined) {
                creep.memory.state = 'harvest';
            } else {
                creep.memory.state = 'idle';
                creep.memory.mineOccupied = true;
            }
            
            source = northSourceID;
            container = containerNorthID;
            
            if(creep.memory.role == 'contHarv1') {
                source = Game.getObjectById(northSourceID);
                container = Game.getObjectById(containerNorthID);
            } else {
                source = Game.getObjectById(southSourceID);
                container = Game.getObjectById(containerSouthID);
            } 
        
            //creep has no energy, go harvest
            if(creep.carry.energy < creep.carryCapacity) {
                creep.memory.state = 'harvest';
                var stateChanged = hasStateChanged(creep);
                //gotoSource(creep, stateChanged);
                harvestSource(creep, stateChanged);
            //creep can't carry more, goto container if it is not full and fill
            } else if(creep.carry.energy == creep.carryCapacity && _.sum(container.store) < container.storeCapacity) {
               // creep.say('here');
                creep.memory.state = 'fill';
                var stateChanged = hasStateChanged(creep);
                fillContainer(creep, stateChanged);
            //container is full
            } else if( _.sum(container.store) == container.storeCapacity || creep.memory.mineOccupied) {
                creep.memory.state = 'idle';
                var stateChanged = hasStateChanged(creep);
                
                var containerSubstitute = creep.pos.findClosestByPath(Structure)
            } else if(creep.memory.mineOccupied && creep.memory.state=='harvesting' && creep.memory.stateBefore=='harvesting') {
                creep.memory.state='idle';
                creep.memory.stateBefore='idle';
                creep.memory.mineOccupied = false;
            }
	    } catch (HarvesterException) {
	        // bla bla
	    }
        creep.memory.stateBefore = creep.memory.state;
	}
};

function harvestSource(creep, stateChanged) {

    if(source.energy > 0) {
        //console.log(creep.harvest(source) + '  '+ creep);
      if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
        gotoSource(creep, stateChanged);
      } else {
          creep.memory.mineOccupied = false;
      }
      
    //idle to reduce cpu load  
    } else {
        if(!creep.pos.isNearTo(source)) {
            creep.moveTo(source);
        }
    }
}

function gotoSource(creep, stateChanged) {
    if(creep.memory.sourcePath == undefined || stateChanged) {
        var path = newSourcePath(creep);
        creep.memory.sourcePath = path;
    }
    
    var gotoResult = 0;
    if((gotoResult = creep.moveByPath(creep.memory.sourcePath)) != -11) {
        //if path is blocked, count
        if(creep.pos.x == creep.memory.prevX && creep.pos.y == creep.memory.prevY) {
            if(creep.memory.pathRecalcCount == undefined) {
                creep.memory.pathRecalcCount = 0;
            }
            
            if(++creep.memory.pathRecalcCount >= untilPathRecalc) {
                //only recalc if on the way to the source, else second creep waiting to harvest will recalc everytime
                if(creep.memory.state != 'harvest') {
                    creep.memory.sourcePath = undefined;
                } else {
    
                    //if the other creep died, recalc path to start harvest
                    var contHarv = _.filter(Game.creeps, (cr) => cr.memory.role == creep.memory.role);
                    if(contHarv.length <= 1) {
                        creep.memory.sourcePath = undefined;
                    }
                }
                creep.memory.pathRecalcCount = 0;
            }
        } else {
            creep.memory.pathRecalcCount = 0;
        }
        creep.memory.prevX = creep.pos.x;
        creep.memory.prevY = creep.pos.y;
    }
}

function hasStateChanged(creep) {
    if(creep.memory.state != creep.memory.stateBefore)
        return true;
    else return false;
}

function newSourcePath(creep) {
    return creep.pos.findPathTo(source, {algorithm: 'astar'});
}

function fillContainer(creep, stateChanged) {
    if(creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(container); //TODO: replace with path
    }
    if(creep.pos.isNearTo(source)) {
        creep.harvest(source);
    }
}

module.exports = roleContHarv1;