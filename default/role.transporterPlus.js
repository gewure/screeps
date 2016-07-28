var fillPerc = 0.5;
var towerFillPerc = 0.8;
var roleTransporterPlus = { 
      run: function(creep) {
          //////////////////////////////////////////////
        
        if(creep.ticksToLive < 10) {
              var targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_CONTAINER) && (structure.store[RESOURCE_ENERGY] + creep.carry.energy < structure.storeCapacity));
                    }
                });
                creep.transfer(targets,RESOURCE_ENERGY);
        }
        
        if(creep.memory.dist && creep.carry.energy == 0 ) {
            creep.memory.dist = false;
            
            var fullCont = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_CONTAINER) && (structure.energy > structure.energyCapacity*fillPerc) );
                    }
            });
            if(creep.withdraw(fullCont, RESOURCE_ENERGY)==ERR_NOT_IN_RANGE) {
                creep.say('cont--');
                creep.moveTo(fullCont, {reusePath: 5});
            }
        
        }
        
        if(!creep.memory.dist && creep.carry.energy == creep.carryCapacity ) {
            creep.memory.dist = true;
        }
        
        if(creep.carry.energy < creep.carryCapacity && !creep.memory.dist) {
            var fullCont = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_CONTAINER) && (structure.store[RESOURCE_ENERGY] > structure.storeCapacity*fillPerc) );
                    }
            });
                        //creep.say('yo');

            if(creep.withdraw(fullCont, RESOURCE_ENERGY)==ERR_NOT_IN_RANGE) {
                creep.moveTo(fullCont, {reusePath: 5});
            }
        }
        else if(creep.memory.dist) {
            var targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (((structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity *towerFillPerc )||
                                structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN) && (structure.energy < structure.energyCapacity) );
                    }
            });
            
            if(targets) {
                if(targets.structureType == STRUCTURE_TOWER ) {
                    if(targets.energy < targets.energyCapacity * towerFillPerc ) { // to tower
                        if(creep.carry.energy > 0) {
                            creep.say('tower');
                            
                            if(creep.transfer(targets, RESOURCE_ENERGY)==ERR_NOT_IN_RANGE) {
                                creep.moveTo(targets, {reusePath:2});
                            }
                            //creep.memory.dist=false;
                            /*creep.say('tower harv');
                            if(creep.harvest(sources[0])==ERR_NOT_IN_RANGE) { // changed to 0 because its good
                                creep.moveTo(sources[0]);
                            } */
                        }   
                    } else { // to distribution
                        /*var targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return ((structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && (structure.energy  < structure.energyCapacity));
                            }
                        }); */
                        
                    
                            creep.say('dist');
                             if(creep.carry.energy > 0) {
                                if(creep.transfer(targets, RESOURCE_ENERGY)==ERR_NOT_IN_RANGE) {
                                    creep.moveTo(targets, {reusePath:3});
                                }
                           
                        } else { //to storage
                            var targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                                filter: (structure) => {
                                    return ((structure.structureType == STRUCTURE_SPAWN ) && (structure.energy + creep.carry.energy < structure.energyCapacity));
                                }
                            });
                            if(targets) {
                                creep.say('spawn');
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
                     
                    }
                }  
                
            } else {
                creep.say('stor++');
               var stor = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return ((structure.structureType == STRUCTURE_STORAGE) && (structure.store[RESOURCE_ENERGY] + creep.carry.energy < structure.storeCapacity));
                        }
            });
                
                 if(stor) {
                      if(creep.carry.energy > 0) {
                        
                            creep.moveTo(stor, {reusePath:4});
                            creep.transfer(stor, RESOURCE_ENERGY);
                      
                    }
                } 
            
            }
        } else { 
             var targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return ((structure.structureType == STRUCTURE_STORAGE) && (structure.store[RESOURCE_ENERGY] + creep.carry.energy < structure.storeCapacity));
                        }
            });
                
             if(targets) {
                  if(creep.carry.energy > 0) {
                    
                        creep.moveTo(targets);
                        creep.transfer(targets, RESOURCE_ENERGY);
                }
                } 
        }


          
          
          //////////////////////////////////////////////
          
          
          
      }
    
}

module.exports = roleTransporterPlus;