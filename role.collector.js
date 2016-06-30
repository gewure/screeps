/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.collector');
 * mod.thing == 'a thing'; // true
 */
var idleX =32;
var idleY=20;
var fightMode = false;

// collector can also fight a little :)
var roleCollector = {
    
    run: function(creep) {
        
        var closestHostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        
        // WAR! we aree under attack, fight you collector ^^ 
          if(closestHostiles.length > 0) {
              
               console.log(' collector ' + creep.name +'goes FIGHTING! :O');
                fightMode = true;
            
                var healer = getHealer(creep, closestHostiles);
                if(healer) {
                    if(canInflictDamage(creep, healer[0], healer[1])) {
                        creep.rangedAttack(healer);
                    } else {
                        console.log('cant deal damage');
                    }
                    
                } else if(creep.rangedAttack(closestHostiles[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestHostile);
                } 
            // PEACE
          }  else {
            
                // no war
                fightMode = false;
                // proceed with collecting
        
            var droppedRes = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
            
            if(droppedRes && _.sum(creep.carry)<= 0.2*creep.carryCapacity) {
                 console.log('collector ' + creep.name + ' goes collecting at '+ droppedRes);
          
                //closestSource = Game.getObjectById(leftMine);
                //MOVE TO THE CLOSES SOURCE TODO: alternatev left -right random
                if(_.sum(creep.carry) < creep.carryCapacity) {
                    if(creep.pickup(droppedRes)==ERR_NOT_IN_RANGE) {
                        creep.moveTo(droppedRes);
                    }
                }
        
                
            }
    
            else if (_.sum(creep.carry) <= 0.2*creep.carryCapacity) {
                
                var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_CONTAINER) &&
                               _.sum(structure.carry.energy) < _.sum(tructure.carryCapacity.energy);
                        }, algorithm:'dijkstra'
                });
                
                if(!target){
                var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                               structure.energy < structure.carryCapacity;
                        }, algorithm:'dijkstra'
                });
                }
                
               
                
                console.log('collector '+ creep.name + ' wants to transport drop to'+ target);
                
                //IF the closest Structure has room for loaded energy
                if(target) {
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                } else {
                    console.log('collector '+creep.name + ' goes IDLE ');
                }
                
                console.log('collector '+creep.name + ' delivered the drop');
                
            }  else {
                 var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_CONTAINER) &&
                                structure.energy < structure.energyCapacity;
                        }, algorithm:'dijkstra'
                });
                
                console.log('collector '+ creep.name + ' wants to transport drop to'+ target);
                
                //IF the closest Structure has room for loaded energy
                if(target) {
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                        console.log('collector '+creep.name + ' delivered the drop');
                        
                    }
                    
                }
            }
        }
    }
};
    
    function getHealer(creep, hostileCreeps) {
        //if hostile creeps are found inside the room
        var healer = undefined;
        for(var i = 0; i < hostileCreeps.length; ++i) {
            var healParts = getActiveBodyPartCount(hostileCreeps[i], HEAL);
            if(healParts > 0) {
                healer = [hostileCreeps[i], healParts]; 
                break;
            }
        }
        return healer;
    }
    

module.exports = roleCollector;