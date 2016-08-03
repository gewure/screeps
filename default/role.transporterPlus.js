var fillPerc = 0.4;
var towerFillPerc = 0.8;
var minStorVal = 100000;
var roleTransporterPlus = { 
    name: 'transporterPlus',
      run: function(creep) {
          //////////////////////////////////////////////
        
        if(creep.ticksToLive < 10) {
                creep.say('yep');
              var targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_CONTAINER) && (structure.store[RESOURCE_ENERGY] + creep.carry.energy < structure.storeCapacity));
                    }
                });
                creep.transfer(targets,RESOURCE_ENERGY);
        }
        
        if(creep.memory.dist && creep.carry.energy == 0 ) {
            creep.memory.dist = false;
            
             
            if(creep.carry.energy < creep.carryCapacity) {
                var fullCont = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return ((structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE ) && (structure.energy > structure.energyCapacity*fillPerc) );
                        }
                });
               
                if(fullCont) {
                    if(creep.withdraw(fullCont, RESOURCE_ENERGY)==ERR_NOT_IN_RANGE) {
                        creep.say('cont--');
                        creep.moveTo(fullCont, {reusePath: 3});
                    }
                } else {
                    
                }
            }  
        }
            
        
        
        
        if(!creep.memory.dist && creep.carry.energy == creep.carryCapacity ) {
            creep.memory.dist = true;
        }
        
        if(creep.carry.energy < creep.carryCapacity && !creep.memory.dist) {
            
                var droppedRes = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                            filter: (resource) => {
                                return (resource.amount > creep.pos.findPathTo(resource).length *2.10);
                            }, algorithm:'dijkstra'
                });
            
                if( droppedRes && (creep.carry.energy < creep.carryCapacity*0.6) ) {
    
                    creep.say('pickup');
                    if(creep.pickup(droppedRes)==ERR_NOT_IN_RANGE) {
                        creep.moveTo(droppedRes);
                    }
                    
                    /* if(creep.pos.roomName != homeRoom) { // this may happen, sadly
                        creep.say('home!');
                        creep.moveTo(Game.flags['room3ctrl'], {reusePath:5});
                    } */
                } else {
                    var fullCont = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return ((structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE ) && (structure.store[RESOURCE_ENERGY] > structure.storeCapacity*fillPerc) );
                            }
                    });
                    if(fullCont!=undefined) {
                            creep.say('fullcont');

                        if(creep.withdraw(fullCont, RESOURCE_ENERGY)==ERR_NOT_IN_RANGE) {
                            creep.say('cont--');
                            creep.moveTo(fullCont, {reusePath: 3});
                        }
                    } else {
                        creep.say('stor--');
                        if(creep.room.storage.store[RESOURCE_ENERGY]>creep.room.storage.storeCapacity*fillPerc) {
                             if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY,creep.carryCapacity)==ERR_NOT_IN_RANGE) {
                                creep.moveTo(creep.room.storage, {reusePath: 2});
                             }
                        } else {
                            creep.say('low E');
                        }
                    }
                } 
        } else if(creep.memory.dist) {
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
                            creep.say('storage');
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
        } else { // if dropped resources and nothing to do : collect them
           
        }


          
    }
    
}

module.exports = roleTransporterPlus;