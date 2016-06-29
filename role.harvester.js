var leftMine= '576a9cb857110ab231d899fa';
var rightMine='576a9cb857110ab231d899f8';
var state = 'spawned';
var isDecided=true;

var idleX = 35;
var idleY =28;

var roleHarvester = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
        
        /*if(isDecided) {
        var random = Math.random()*10;
        if(random % 2==0) {
            creep.moveTo(12,21); //left
        } else {
            creep.moveTo(27, 21); // right
        }
        isDecided = false;
        } */
        
       // death is awaiting
        if(creep.ticksToLive < 5) {
            state = 'very old';
            console.log(creep.name + " dies soon. state: " + state);
        }
        
        // OUT OF ENERGY!
	    if(creep.carry.energy < creep.carryCapacity) {
            
            var source = creep.pos.findClosestByPath(FIND_SOURCES);
            console.log('harvester ' + creep.name + ' goes mining at '+ source);
      
            //closestSource = Game.getObjectById(leftMine);
            //MOVE TO THE CLOSES SOURCE TODO: alternatev left -right random
            if(creep.harvest(source)==ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        // FILLED WITH ENERGY -> Bring back energy
        else {
            var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) &&
                            structure.energy < structure.energyCapacity;
                    }, algorithm:'dijkstra'
            });
            
            console.log('harvester '+ creep.name + ' wants to transport resources to'+ target);
            
            //IF the closest Structure has room for loaded energy
            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);

                }
            } else {
                creep.moveTo(idleX, idleY);
            }
        }   
                
            /* all structures
            var lagerStructs = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_CONTAINER) && structure.energy < structure.energyCapacity;
                 }, algorithm:'dijkstra'
            });
        
        //BUILDER ROLE
        //if there are NO more lager-rooms availabe -> become a builder with minerals!
        if(lagerStructs.length == 0) {    
            
                console.log(creep.name + ' decided to be a builder for this mission');
                // no energy left 
        	    if(creep.memory.building && creep.carry.energy == 0) {
                    creep.memory.building = false;
        	    }
        	    
        	    // still energy
        	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
        	        creep.memory.building = true;
        	    }
        	    
        	    if(creep.memory.building) {
                    //alternatetivly: build!
        	        var buildTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
        	        
                    if(buildTargets.length && creep.energyAvailable > 0) {
                        if(creep.build(buildTargets[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(buildTargets[0]);
                        }
                    }
        	    }
        } */
    
	}
};

module.exports = roleHarvester;