var minWallHitpoints = 500000;
var minRampartHitpoints = 300000;

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
            
                
            } else {
            
                var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return ((structure.structureType == STRUCTURE_ROAD && structure.hits < structure.hitsMax) || 
                                    (structure.structureType == STRUCTURE_WALL && structure.hits < minWallHitpoints)|| 
                                    (structure.structureType == STRUCTURE_RAMPART && structure.hits < minRampartHitpoints));
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