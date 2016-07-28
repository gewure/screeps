/*
    give him 2 flags and its ok.
*/

var untilPathRecalc = 3;

var roleForeignHarvester = {
    
    run: function(creep, sourceFlag, contFlag) {
        
        //creep.memory.room=homeRoom;
        
        var source= Game.flags[sourceFlag];
        var cont = Game.flags[contFlag];
        
        if(creep.ticksToLive==40) { //RESPAWNS himself
            Game.spawns.Leningrad.createCreep([WORK, WORK, WORK,CARRY,CARRY, CARRY, MOVE,MOVE, MOVE, MOVE], undefined, {role:'foreignHarvester'});
        }
        
        if(creep.ticksToLive==1){
            container = Game.getObjectById(containerID);
             if(creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container, {reusePath:10}); //TODO: replace with path
             }
        }
        //creep has no energy, go harvest
        if(creep.carry.energy < creep.carryCapacity) {
            
            //move to flag, because other roomm..
            if(!creep.pos.isNearTo(source)) {
                creep.moveTo(source, {reusePath:10}); ///////<----------------
            } 
            
            if(creep.pos.isNearTo(source)) {
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0],{reusePath:10});
                }
            }

        //creep can't carry more, goto container TODO: check for full!!
        } else if(creep.carry.energy == creep.carryCapacity ) {
        
            if(!creep.pos.isNearTo(cont)) {
                creep.moveTo(cont, {reusePath:4});
                //isInHomeRoom = true;
               //creep.memory.room=homeRoom;
                //console.log(creep.name + " entere Home Room");
            } else {
                var stor = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE);}
                }); 
                
                if(creep.transfer(stor, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(stor, {reusePath:8}); //TODO: replace with path
                }
            }
	    }
    }
};



//############################################## helping functions
function harvestSource(creep, stateChanged) {
    console.log("HarvestSource!");
    if(source.energy > 0) {
        //console.log(creep.harvest(source) + '  '+ creep);
      if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
          console.log("err not in range");
            //gotoSource(creep, stateChanged);
      }
      
    //idle to reduce cpu load  
    } else {
        if(!creep.pos.isNearTo(source)) {
            creep.moveTo(source, {reusePath:4});
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
                        console.log("olalalalala");
                    //if the other creep died, recalc path to start harvest
                   //var contHarv = _.filter(Game.creeps, (cr) => cr.memory.role == creep.memory.role);
                   // if(contHarv.length <= 1) {
                        creep.memory.sourcePath = undefined;
                  //  }
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

module.exports = roleForeignHarvester;