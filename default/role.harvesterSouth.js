
var roleHarvesterSouth = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        //var sources = creep.pos.findClosestByPath(FIND_SOURCES);
        var tolerance = 7;
      
        
        /*if(!sources) {
            sources = creep.pos.findClosestByRange(FIND_SOURCES);
        } */
        
        if(creep.ticksToLive == 30) {
            // respawn it..
            Game.spawns.Leningrad.createCreep([MOVE,MOVE, CARRY, CARRY, MOVE, CARRY,MOVE, CARRY,CARRY,MOVE, WORK, WORK, WORK,WORK], undefined, {role:'harvesterSouth'});
            console.log('Room3 makes a new Harvester...');
        }
        if(creep.ticksToLive == 1) {
              var targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_CONTAINER) && (structure.store[RESOURCE_ENERGY] + creep.carry.energy < structure.storeCapacity));
                    }
                });
                creep.transfer(targets,RESOURCE_ENERGY);
        }
        
        if(creep.memory.dist && creep.carry.energy == 0 ) {
            var sources = creep.room.find(FIND_SOURCES);

            creep.memory.dist = false;

            if((sources[1].energy/10  > sources[1].ticksToRegeneration -tolerance)) {
                //creep.say('s0: '+sources[0].energy/10/sources[0].ticksToRegeneration);
                 source = creep.pos.findClosestByPath(FIND_SOURCES);
                 if(source.energy <1) {
                     source = sources[1];
                 }
                 creep.say('searchin..');
            } else if((sources[0].energy/10  > sources[0].ticksToRegeneration - tolerance)){
                //creep.say('s1: '+sources[1].energy/10/sources[1].ticksToRegeneration);
                source = sources[1];
                creep.say('s1 OK');

            } else {
                if(sources[1].energy > sources[0].energy*1.1) {
                    source = sources[1];
                    creep.say('s0 OK');
                } else {
                    source = creep.pos.findClosestByPath(FIND_SOURCES);
                    creep.say('s1 OK');
                }
            }
        
        }
        
        //if(!creep.memory.dist && creep.carry.energy == creep.carryCapacity ) {
          //  creep.memory.dist = true;
        //}
        
        if(creep.carry.energy < creep.carryCapacity && !creep.memory.dist) {
            var source =creep.pos.findClosestByPath(FIND_SOURCES);
            if(source.energy == 0) {
               var newS = creep.room.find(FIND_SOURCES)[1];
                if(newS != source) {
                    source = newS;
                } 
            
            }
            //creep.say('sources');
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        else if(creep.memory.dist) {
            //is besides a full link
            var link = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_LINK);
                    }
            });
            //creep.say(link);
            if(link)
            if(creep.pos.isNearTo(link)) {
                creep.say('link');
                if(link.energy < link.energyCapacity *0.6) {
                    creep.transfer(link, RESOURCE_ENERGY, creep.carry.energy);
                }
            }
            
            var targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_TOWER ||
                                structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN) && (structure.energy < structure.energyCapacity) );
                    }
            });
            if(targets) {
                if(targets.structureType == STRUCTURE_TOWER ) {
                    if(targets.energy < targets.energyCapacity * 0.5 ) { // to tower
                        if(creep.carry.energy > creep.carryCapacity*0.26) {
                            creep.say('tower');
                            
                            if(creep.transfer(targets, RESOURCE_ENERGY, creep.carry.energy)==ERR_NOT_IN_RANGE) {
                                creep.moveTo(targets);
                            }
                            //creep.memory.dist=false;
                            /*creep.say('tower harv');
                            if(creep.harvest(sources[0])==ERR_NOT_IN_RANGE) { // changed to 0 because its good
                                creep.moveTo(sources[0]);
                            } */
                        }   
                    } else { // to container
                        var targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return ((structure.structureType == STRUCTURE_CONTAINER) && (structure.store[RESOURCE_ENERGY] + creep.carry.energy < structure.storeCapacity));
                            }
                        });
                        
                        if(targets) {
                            creep.say('cont');
                             if(creep.carry.energy > 0) {
                                if(creep.transfer(targets, RESOURCE_ENERGY)==ERR_NOT_IN_RANGE) {
                                    creep.moveTo(targets);
                                }
                            }
                        } else { //to storage
                            var targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                                filter: (structure) => {
                                    return ((structure.structureType == STRUCTURE_STORAGE) && (structure.store[RESOURCE_ENERGY] + creep.carry.energy < structure.storeCapacity));
                                }
                            });
                            if(targets) {
                                creep.say('stor');
                                if(creep.carry.energy > 0) {
                                    if(creep.transfer(targets, RESOURCE_ENERGY)==ERR_NOT_IN_RANGE) {
                                        creep.moveTo(targets);
                                    }
                                }
                            }
                        }
                    }
                } else if(targets.structureType != STRUCTURE_TOWER) { // To all other things
                    if(creep.carry.energy > 0) {
                        creep.say('dist');
                        
                        if(creep.transfer(targets, RESOURCE_ENERGY)==ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets);
                        }
                        if(creep.carry.energy == 0)
                        if(creep.harvest(source)==ERR_NOT_IN_RANGE) {
                            creep.moveTo(source);
                        } 
                    }
                }  
                
            } else {
                
                var targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return ((structure.structureType == STRUCTURE_CONTAINER) && (structure.store[RESOURCE_ENERGY] + creep.carry.energy < structure.storeCapacity));
                                   
                        }
                });
                
                 if(targets) {
                      if(creep.carry.energy > 0) {
                        
                            creep.moveTo(targets);
                            creep.transfer(targets, RESOURCE_ENERGY);
                      
                    }
                } 
            
            }
        } else { 
             var targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return ((structure.structureType == STRUCTURE_CONTAINER) && (structure.store[RESOURCE_ENERGY] + creep.carry.energy < structure.storeCapacity));
                        }
            });
                
             if(targets) {
                  if(creep.carry.energy > 0) {
                    
                        creep.moveTo(targets);
                        creep.transfer(targets, RESOURCE_ENERGY);
                }
                } 
        }
    }
};

module.exports = roleHarvesterSouth;