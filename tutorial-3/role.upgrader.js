module.exports = {
    
  
        /** @param {Creep} creep **/
        run: function(creep) {
            
             //###################################### death logic
        	    if(creep.ticksToLive < 30) {
        	        
            	     var targets = creep.room.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return ( structure.structureType == STRUCTURE_CONTAINER ||
                                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                            }
                            });
                            
                    if(targets.length > 0) {
                        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0]);
                        }
                    }
        	    }
	    //####################################
                
            if(creep.memory.upgrading && creep.carry.energy == 0) {
                creep.memory.upgrading = false;
    	    }
    	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
    	        creep.memory.upgrading = true;
    	    }
                
            
            if(creep.memory.upgrading){
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            } else {
    	   
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[1]);
                }
            }
            
    
        }
}
    