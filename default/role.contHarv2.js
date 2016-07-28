var roomStat = require('roomStatistics');
var utils = require('utils');

var northSourceID = '576a9c7f57110ab231d892f6';
var containerNorthID = '57796949720916567dc376ca';

var southSourceID = '576a9c7f57110ab231d892fb';
var containerSouthID = '577efebce58c81923d18ea3f';
var linkID = '5790e50543f1b3f2295aaf0c';

var source = undefined;
var container = undefined;
var untilPathRecalc = 3;

var roleContHarv2 = {
    /** @param {Creep} creep **/
    run: function(creep) {
        
       // utils.creepSay(creep, '' +Math.ceil(roomStat.getTotalEnergy(creep.room)/1000)+'k', 3);
        
	      if(!creep.pos.isNearTo(Game.flags['extraResource'])) {
            console.log(creep.name + '[contHarv1] im in the wrong room ..');
            creep.move(BOTTOM);
            creep.moveByPath(Game.flags['extraResource']);
         
        }
        
        if(creep.ticksToLive==36) { // respawn yourself! 
            Game.spawns.StPetersburg.createCreep([WORK, WORK, WORK,WORK, WORK, CARRY, MOVE], undefined, {role:'contHarv2'});
        }
        if(creep.ticksToLive==1) {
            container = Game.getObjectById(containerSouthID);
             if(creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container); //TODO: replace with path
             }
        }
        
        if(creep.memory.state == undefined) {
            creep.memory.state = 'harvest';
        } else {
             creep.memory.state = 'idle';
            creep.memory.mineOccupied = true;
        }
        
        source = southSourceID;
        container = containerSouthID;
        var link = Game.getObjectById(linkID);
        
        if(creep.memory.role == 'contHarv2') {
            source = Game.getObjectById(southSourceID);
            container = Game.getObjectById(containerSouthID);
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
        } else if(creep.carry.energy == creep.carryCapacity && link.energy < link.energyCapacity) {
           // creep.say('here');
            creep.memory.state = 'fill';
            var stateChanged = hasStateChanged(creep);
            //fillContainer(creep, stateChanged);
            
            if(link.energy <= 750) {
                if(creep.transfer(link, RESOURCE_ENERGY)==ERR_NOT_IN_RANGE) {
                    creep.moveTo(link);
                }
                creep.harvest(source);
            }
        //container is full
        } else if( link.energy == link.energyCapacity || creep.memory.mineOccupied) {
            creep.memory.state = 'idle';
            var stateChanged = hasStateChanged(creep);
            
          var containerSubst = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER /*|| structure.structureType == STRUCTURE_LINK*/) && _.sum(structure.energy) < _.sum(structure.energyCapacity)+creep.carry.energy;
                    }
                    });
        if(containerSubst) {
            if(creep.transfer(containerSubst, RESOURCE_ENERGY, creep.carry.energy) == ERR_NOT_IN_RANGE) {
                creep.moveTo(containerSubst);
            }
        }
        } else if(creep.memory.mineOccupied && creep.memory.state=='harvesting' && creep.memory.stateBefore=='harvesting') {
            creep.memory.state='idle';
            creep.memory.stateBefore='idle';
            creep.memory.mineOccupied = false;
        }
        creep.memory.stateBefore = creep.memory.state;
	}
};

function harvestSource(creep, stateChanged) {

    if(source.energy > 0) {
      if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
        gotoSource(creep, stateChanged);
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

module.exports = roleContHarv2;