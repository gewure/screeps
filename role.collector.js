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

var roleCollector = {
    run: function(creep) {
        
    
        var droppedRes = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
        
        if(droppedRes && _.sum(creep.carry)<= 0.5*creep.carryCapacity) {
             console.log('collector ' + creep.name + ' goes collecting at '+ droppedRes);
      
            //closestSource = Game.getObjectById(leftMine);
            //MOVE TO THE CLOSES SOURCE TODO: alternatev left -right random
            if(_.sum(creep.carry) < creep.carryCapacity) {
                if(creep.pickup(droppedRes)==ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedRes);
                }
            }
    
            
        }

        else if (_.sum(creep.carry) <= 0.5*creep.carryCapacity) {
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
            } else {
                creep.moveTo(idleX, idleY);
                console.log('collector '+creep.name + ' goes IDLE ');

            }
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
};
module.exports = roleCollector;