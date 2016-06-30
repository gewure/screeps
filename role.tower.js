/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.tower');
 * mod.thing == 'a thing'; // true
 */

var roleTower = {
    run: function(tower) {
        if(tower) {
            var hostileCreeps = tower.room.find(FIND_HOSTILE_CREEPS);
           
            if(hostileCreeps.length > 0) {
                var healer = getHealer(tower, hostileCreeps);
                if(healer) {
                    if(canInflictDamage(tower, healer[0], healer[1])) {
                        tower.attack(healer);
                    } else {
                        console.log('cant deal damage');
                    }
                    
                } else {
                    tower.attack(tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS));
                }
            
                
            } else if(tower.energy > 0.1 * tower.energyCapacity){
            
            // repair lowest first
              var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return ((structure.structureType == STRUCTURE_ROAD && structure.hits < 100) || 
                                    (structure.structureType == STRUCTURE_CONTAINER && structure.hits < 100) ||
                                    (structure.structureType == STRUCTURE_WALL && structure.hits < (1/30000)*100) ||
                                    (structure.structureType == STRUCTURE_RAMPART && structure.hits < (1/20)*100));
                        }, algorithm:'dijkstra'}); 
                
                if(closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                }
            
        
                var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return ((structure.structureType == STRUCTURE_ROAD && structure.hits < structure.hitsMax) || 
                                    (structure.structureType == STRUCTURE_CONTAINER && structure.hits < structure.hitsMax) ||
                                    (structure.structureType == STRUCTURE_WALL && structure.hits < (1/30000)*structure.hitsMax) ||
                                    (structure.structureType == STRUCTURE_RAMPART && structure.hits < (1/20)*structure.hitsMax));
                        }, algorithm:'dijkstra'}); 
                
                if(closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                }
                
              
            }
        
            
        }
    }
}

function canInflictDamage(tower, creep, activeHealParts) {
    
}

function getHealer(tower, hostileCreeps) {
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

function getActiveBodyPartCount(creep, part) {
    var carryPartsCount = 0;
    var creepBody = creep.body;
    for(var i = 0; i < creepBody.length; ++i) {
        if(creepBody[i].type == part) {
            ++carryPartsCount;
        }
    }
    return carryPartsCount;
}


module.exports = roleTower;