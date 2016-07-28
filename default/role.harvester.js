var homeRoom = 'E28N3';
var minStorVal = 100000;
var contMinPerc = 0.8;
var minLink = 300;

var roleHarvester = { // IS A UPGRADER NOW

    /** @param {Creep} creep **/
    run: function(creep) {
         
        if(creep.pos.roomName != homeRoom) {
            creep.say('home!');
            creep.moveTo(Game.flags['room3ctrl']);
        }
         
        if(creep.ticksToLive == 10) {
            // respawn it..
            //Game.spawns.Leningrad.createCreep([MOVE,MOVE,MOVE,MOVE, CARRY, CARRY, CARRY, CARRY,WORK, WORK, WORK, WORK], undefined, {role:'harvester'});
            console.log('Room3 makes a new upgrader...');
    
        }
        if(creep.ticksToLive < 15) {
            creep.say('i die');
             /* var targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_CONTAINER) && (structure.store[RESOURCE_ENERGY] + creep.carry.energy < structure.storeCapacity));
                    }
                });
                
                if(creep.transfer(targets,RESOURCE_ENERGY)==ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets);
                } */
        }
        

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
        }
        
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
        }
        
     
        if(creep.memory.upgrading) { // upgrading

            if((creep.ticksToLive%10)==0){creep.say('up: '+creep.room.controller.progress/creep.room.controller.progressTotal);}
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {reusePath:5});
            }
        } else { // org harvesting
           
                var droppedRes = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                            filter: (resource) => {
                                return (resource.amount > creep.pos.findPathTo(resource).length *7.10);
                            }, algorithm:'dijkstra'
                });
            
            if(droppedRes && (creep.carry.energy < creep.carryCapacity*0.6) ) {
                            

                creep.say('pickup');
                if(creep.pickup(droppedRes)==ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedRes);
                }
                
                 if(creep.pos.roomName != homeRoom) { // this may happen, sadly
                    creep.say('home!');
                    creep.moveTo(Game.flags['room3ctrl'], {reusePath:5});
                }
            } else {
                if(creep.carry.energy < creep.carryCapacity) {
                    
                    //is besides a full link
                    var link = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return ((structure.structureType == STRUCTURE_LINK) && structure.energy > minLink);
                            }
                    });
                 
                    if(link)
                    if(link.energy > minLink) {
                        if(creep.pos.getRangeTo(link)<3) { //TODO
                            creep.moveTo(link, {reusePath:10});
                            if(creep.pos.isNearTo(link)) {
                                creep.say('link--');
                        
                                creep.withdraw(link, RESOURCE_ENERGY, creep.carry.energy);
                            }
                        }
                    }
                    
                    // else containers
                    var containers = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return ((structure.structureType == STRUCTURE_CONTAINER) && (structure.store[RESOURCE_ENERGY] > structure.storeCapacity*contMinPerc));
                            }
                    });
                    
                    if(containers) {
                        creep.say(containers.store[RESOURCE_ENERGY]);
                         if(creep.withdraw(containers, RESOURCE_ENERGY)==ERR_NOT_IN_RANGE) {
                             creep.moveTo(containers, {reusePath:3});
                         }
              
                    } else {
                        //var stor = creep.room.find(STRUCTURE_STORAGE);
                        var stor = Game.rooms.E28N3.storage;
                        creep.say('stor--');
                        if(stor)
                        if(stor.store[RESOURCE_ENERGY] > minStorVal) {
                            if(creep.withdraw(stor, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(stor, {reusePath:4});
                            }
                        } else {
                            var sources = creep.room.find(FIND_SOURCES);

                            creep.say('harvest');
                            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(sources[0], {reusePath:3});
                            }
                        }
                    }
                }
            }
        }
        
    
    }
};

module.exports = roleHarvester;