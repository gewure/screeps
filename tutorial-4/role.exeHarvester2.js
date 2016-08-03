
var sourceID = '576a9cb857110ab231d899fc'; 
var containerID = '5774a3eee708dff8010e0735';

var exeRoom = 'E36S29';
var homeRoom = 'E36S28';
var exeX = 26;
var exeY = 9;

var isInHomeRoom = true;
var source = sourceID;
var container = containerID;
var untilPathRecalc = 3;

var roleExeHarvester2 = {
    
    run: function(creep) {
        
        creep.memory.room=homeRoom;
        creep.memory.exeX=exeX;
        creep.memory.exeY=exeY;

        if(creep.ticksToLive <= 40) {
            if(!creep.pos.isNearTo(Game.flags['exeContainer'])) {
                creep.moveTo(Game.flags['exeContainer']); ///////<----------------
            } 
        }
        //creep has no energy, go harvest
        if(creep.carry.energy < creep.carryCapacity) {
            
            //move to flag, because other roomm..
            if(!creep.pos.isNearTo(Game.flags['extraResource2'])) {
                creep.moveTo(Game.flags['extraResource2']); ///////<----------------
            } 
            
            if(creep.pos.isNearTo(Game.flags['extraResource2'])) {
                isInHomeRoom = false;
                creep.memory.room=exeRoom;
                console.log(creep.name + ' is in other room');
            }

            if(!isInHomeRoom && creep.memory.room == exeRoom) {
                
                var sources = creep.room.find(FIND_SOURCES);
                
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0]);
                } else {
                    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0]);
                    }
                }
                
            }
            
        //creep can't carry more, goto container TODO: check for full!!
        } else if(creep.carry.energy == creep.carryCapacity ) {
            creep.memory.state = 'fill';
            var stateChanged = hasStateChanged(creep);
            
            creep.moveTo(Game.flags['exeContainer2']); /////<------------------
            
            if(creep.pos.isNearTo(Game.flags['exeContainer2']) && creep.memory.room != homeRoom) {
                isInHomeRoom = true;
                creep.memory.room=homeRoom;
                console.log(creep.name + " entere Home Room");
            }
            
            var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER);}
            }); 
            
            if(creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container); //TODO: replace with path
            }

        //container is full
        } else if( _.sum(container.store) == container.storeCapacity) {
            creep.memory.state = 'idle';
            var stateChanged = hasStateChanged(creep);
        }
        //creep.memory.stateBefore = creep.memory.state;
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

module.exports = roleExeHarvester2;