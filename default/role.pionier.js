/*
    ddoes what a pioneer does
*/

var sourceID = ''; // not used 
var containerID = '5794449a93a10c621525fc8a'; // pionier takes from all containers, but he won't let this one fill up > 1800
var flagName = 'room3_2';

var exeRoom = 'E28N3';
var homeRoom = 'E31N2'; // not used
var exeX = 34;
var exeY = 24;

var minWallHitpoints = 400000;
var minRampartHitpoints = 400000;
var minRoadPoints = 4000;
var minContainerPoints = 200000;

var source = sourceID;
var container = containerID;
var untilPathRecalc = 3;

var minContainerCont = 300;

var rolePionier = {
    
    run: function(creep) {
        
       //var enemiesFound = creep.pos.findInRange(FIND_HOSTILE_CREEPS);
        
          //if(enemiesFound) {
                
                    //creep.moveTo(Game.flags['exe']);
                    
                  /*  var closestRamp = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                                structure.structureType == STRUCTURE_ROAD) 
                    }, algorithm:'astar'});  */
                    
                    //creep.moveTo(closestRamp);
                
           // }
        
         if(creep.memory.freshSpawn == undefined) {

            creep.memory.freshSpawn = true;
        } else {
            creep.memory.freshSpawn = false;
        }
        
        creep.memory.room=homeRoom;
        creep.memory.exeX=exeX;
        creep.memory.exeY=exeY;

      

        
        //##################### statemachine
        //console.log(creep.room);
        if(creep.room.name != exeRoom) {
           /* if(creep.carry.energy ==0) {
                if(creep.withdraw(Game.rooms.E31N2.storage, RESOURCE_ENERGY)==ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.rooms.E31N2.storage);
                }
            } else { */
                moveToRoom(creep);
                 if(!creep.pos.isNearTo(Game.flags[flagName])) {
                   creep.moveTo(Game.flags[flagName],  {reusePath:8});
                 }
            //}

        } else {
            
            if(creep.memory.state=='harvest') {
                    goHarvest(creep);
            }
            
            if(creep.memory.state=='build') {
                if(creep.carry.energy != 0) {
                    goBuild(creep);
                }
            }
            if(creep.carry.energy == 0) {
                creep.memory.state ='harvest';
            }
        }
        //##############################
    
	}
};


//####################################################
// harvesting
function goHarvest(creep) {
  
    if(creep.carry.energy == creep.carryCapacity) {
       // console.log('pioneer ' + creep.name +' harvest():  creep.carry.energy == creep.carryCapacity');
        creep.memory.state='build';
        return;
    } else {

        var sources = creep.room.find(FIND_SOURCES);
          var containers = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType == STRUCTURE_CONTAINER) && (structure.store[RESOURCE_ENERGY] > creep.carryCapacity + 800 || structure.id == containerID && structure.store[RESOURCE_ENERGY]> 200));

                }
        });
        //creep.say(creep.pos.findPathTo(sources[1]).length);
        //var retval = creep.moveTo(sources[1]);
        //creep.say(retval);
        if(containers!=undefined) {
            if( ( creep.carry.energy == 0 && creep.pos.getRangeTo(sources[0]) > 2 && creep.moveTo(sources[0])==0 ) || ( containers.id == containerID && containers.store[RESOURCE_ENERGY]>= 1700)) {
                //creep.say('container!');
                creep.say(containers.store[RESOURCE_ENERGY]);
                if(creep.withdraw(containers, RESOURCE_ENERGY)==ERR_NOT_IN_RANGE) {
                    creep.moveTo(containers);
                }
            } else {
                creep.say('harvest');
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            }
        } else {
            creep.say('harvest');
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
       
    }
}

// building
function goBuild(creep) {
    //console.log(' pioner ::: build()');
    
     var ramp = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            return (
                    structure.structureType == STRUCTURE_RAMPART && structure.hits < 1000);
        }, algorithm:'dijkstra'}); 
                    
        if(ramp) {
            creep.say('ramp');
            if(creep.repair(ramp) == ERR_NOT_IN_RANGE) {
                creep.moveTo(ramp);
            }
        }
        
        var constructionsite = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {algorithm:'djikstra'});
        //console.log('pionier ::: ' + constructionsite);
        
        if(constructionsite) { // found a nearby site..
            creep.say('build');
            creep.memory.tempWorksite=constructionsite;
            if(creep.carry.energy > 0) {
                //console.log('yes, im bigger than > 0');
                if(constructionsite.progress < constructionsite.progressTotal) {
                    //console.log('pionier: XXXXX '+constructionsite.progress + ' from '+ constructionsite.progressTotal);
                    if(creep.build(constructionsite) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(constructionsite);
                    } else {
                        if(creep.carry.energy != 0) {
                             creep.build(constructionsite);
                             //creep.moveTo(constructionsite);
                             randomMove(creep, constructionsite);

                        }
                    }
                }
            }  

               // creep.moveTo(39,19);
                //searchNewTarget(creep);
               
            
        } else { // found no nearby side, repair something! 
            var ramp = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            return (
                    structure.structureType == STRUCTURE_RAMPART && structure.hits < 2000);
        }, algorithm:'dijkstra'}); 
                    
        if(ramp) {
            creep.say('ramp');
            if(creep.repair(ramp) == ERR_NOT_IN_RANGE) {
                creep.moveTo(ramp);
            }
        }
       
            var closestDamagedStructure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_ROAD && structure.hits < minRoadPoints) || 
                                (structure.structureType == STRUCTURE_WALL && structure.hits < minWallHitpoints) || 
                                (structure.structureType == STRUCTURE_RAMPART && structure.hits < minRampartHitpoints) ||
                                (structure.structureType == STRUCTURE_CONTAINER && structure.hits < minContainerPoints));
                    }, algorithm:'dijkstra'}); 
                    
                    
            if(closestDamagedStructure) {
                creep.say('repairing');
               // console.log('there is damaged structures: ' + closestDamagedStructure + ' with ' + closestDamagedStructure.hits + '/'+closestDamagedStructure.hitsMax);
                if(creep.repair(closestDamagedStructure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestDamagedStructure);
                }
            } else {
                 if(!creep.pos.isNearTo(Game.flags[flagName])) {
                    creep.moveTo(Game.flags[flagName]); 
                }
            }
           
        //console.log('constuction site : '+constructionsite + ' ' + constructionsite.progress + '/' + constructionsite.progressTotal);
        
          // creep.memory.tempWorksite=undefined;
        }
   
    if(creep.carry.energy == 0) {
        console.log('WTF');
        creep.memory.state='harvest';
    }
}

// moving
function moveToRoom(creep) {
    creep.say('move');
     

    if(creep.pos.room == exeRoom) {
        return;
    } else {
        console.log(' pioner moves to room: '+exeRoom);
         if(!creep.pos.isNearTo(Game.flags[flagName])) {
            creep.moveTo(Game.flags[flagName], {reusePath:3}); 
        } else {
            creep.memory.state='harvest'
            return;
        }
    }
}


//############################################## helping functions
function harvestSource(creep, stateChanged) {
   console.log("HarvestSource!");
    if(source.energy > 0) {
        //console.log(creep.harvest(source) + '  '+ creep);
      if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source);
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

function searchNewTarget(creep) {
    
    var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {algorithm:'dijkstra'});
	
	if(constructionSite) {    
    	creep.memory.tempWorksite = constructionSite.id;
    	//console.log('OK   ' + constructionSite);
	} else {
	        
        var lowLifeTargets = creep.room.find(FIND_STRUCTURES, {
            filter: (object) => {return (object.hits < object.hitsMax && object.structureType != STRUCTURE_ROAD);}, algorithm:'dijkstra'
            });
        
        lowLifeTargets.sort((a,b) => a.hits - b.hits);
        
        if(lowLifeTargets.length > 0) {
            creep.memory.tempWorksite = lowLifeTargets[0].id;
        }
        
    }
}

function randomMove(creep, target) {
    var distance = creep.pos.getRangeTo(target);
    var direction = creep.pos.getDirectionTo(target);
    var oppositeDir = target.pos.getDirectionTo(creep);
    
   // console.log('creep ' + creep.name + ': randomMove() distance '+distance + ' direction: ' + direction);
    var random = Math.ceil(Math.random()*8);

    if(distance == 1) {
        if(random != direction) {
           if(creep.move(oppositeDir)==ERR_NO_PATH) {
            creep.move(random);
        }
        }
    } else if(distance == 3) {
        creep.move(direction);
    } else if(distance == 2) {
         if(random != direction && random!=oppositeDir) {
           creep.move(random);
        }
    } else if(distance == 0) {
        if(creep.move(oppositeDir)==ERR_NO_PATH) {
            creep.move(random);
        }
    } else if (distance > 3 ) {
        creep.move(direction);
    }
}

module.exports=rolePionier;

