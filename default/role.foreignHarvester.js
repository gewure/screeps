/*
    give him 2 flags and its ok.
*/

var untilPathRecalc = 3;

var roleForeignHarvester = {
    
    run: function(creep, sourceFlag, contFlag) {
        
        //creep.memory.room=homeRoom;
        //hacks: TODO generify this! 
        try {
            var testSource = Game.rooms['E27N3'].find(FIND_SOURCES);
        } catch(otherRoomException) {
            
        }
        var source= Game.flags[sourceFlag];
        var cont = Game.flags[contFlag];
        
        if(creep.ticksToLive==40) { //RESPAWNS himself
            Game.spawns.Leningrad.createCreep([WORK, WORK, WORK,CARRY,CARRY, CARRY, MOVE,MOVE, MOVE, MOVE], undefined, {role:'foreignHarvester'});
        }
        
        // statemachine, expensive version
        if(creep.carry.energy == 0) {
            creep.memory.goHarvest = true;
            creep.memory.goTransport = false;
        } 
        if(creep.carry.energy == creep.carryCapacity) {
            creep.memory.goTransport == true;
            creep.memory.stillHarvest = false;
   
        } 
        if(creep.carry.energy > 0  && creep.carry.energy < creep.carryCapacity) {
            creep.memory.stillHarvest = true;
        } else {
            creep.memory.stillHarvest = false;
            creep.memory.goHavest = true;
        }
        
        if(creep.memory.goTransport) {
            
        }
        
        if(creep.memory.stateChange) {
            //decrease sources.worker memory counter
        
           // creep.say(testSource[0].memory.workers+'--');
            //testSource[0].memory.workers-=1;
        } 
        // -- end statemachine
       
        //creep has no energy, go harvest
        if(creep.carry.energy < creep.carryCapacity) {
            
            //move to flag, because other roomm..
            if(!creep.pos.isNearTo(source)) {
                creep.moveTo(source, {reusePath:10}); ///////<----------------
            } 
            
            
            if(creep.pos.isNearTo(source)) { //not source, sourceflag ;9
            
                var sources = creep.room.find(FIND_SOURCES);
                
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0],{reusePath:5});
                }
                if(creep.carry.energy == creep.carryCapacity) {
                    creep.memory.stillHarvest = false;
                }
            } else {
               
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
                        return ((structure.structureType == STRUCTURE_STORAGE ||structure.structureType == STRUCTURE_CONTAINER)&& (structure.store[RESOURCE_ENERGY] +creep.carry.energy < structure.storeCapacity ));}
                }); 
                
                if(creep.transfer(stor, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(stor, {reusePath:5}); //TODO: replace with path
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