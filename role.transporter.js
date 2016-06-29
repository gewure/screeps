/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.transporter');
 * mod.thing == 'a thing'; // true
 */

var roleTransporter = {
    /** @param {Creep} creep **/
    run: function(creep) {
        
        /*
        NEW transporter logic:
        
        if(tower is empty, && container has something) {
            #fill tower from container
            #needs: tower, nearest filled container
            #check: tower energy < energy max, container.energy > 0
        }
        if(spawnIsEmpty && container has something) {
            #fill spawn from container
            #check: container > 0, spawn < spawn.energy.max
        }
        if(spawn is full, container has somethin, extensions are not yet filled) {
            #fill extension from container
            #check spawn.energy = max, container.energy > 0, extensions(filter for not full, take first one)
        }
        
        */
    
    // Transporter has room ready
    if(creep.carry.energy < creep.carryCapacity){
        
        var fromLager = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_CONTAINER) &&
                                structure.energy <= structure.energyCapacity && structure.energy >= 1;
                        }, algorithm:'dijkstra'
                });
                
        if(fromLager) {
            console.log('transporter ' + creep.name + ' wants to get resources from '+ fromLager);
            if(fromLager.transferEnergy(creep, creep.carryCapacity-creep.carry) ==ERR_NOT_IN_RANGE) {
                creep.moveTo(fromLager);
            }
        }
    }
    //transporter is full
     else if (creep.carry.energy == creep.carryCapacity ){
         
            var toLager = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_EXTENSION) &&
                            structure.energy < structure.energyCapacity;
                    }, algorithm:'dijkstra'
            });
             
            console.log('transporter '+ creep.name + ' wants to transact from '+ fromLager + ' to '+ toLager);
            
            //IF the closest Structure has room for loaded energy
            if(toLager) {
                if(creep.transfer(toLager, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(toLager);

                }
            } 
        }   else if( creep.carry.energy == 0) {
             var emptyLager = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_CONTAINER);
                        }, algorithm:'dijkstra'
                });
                creep.moveTo(emptyLager);
        }
    }
}

module.exports = roleTransporter;
