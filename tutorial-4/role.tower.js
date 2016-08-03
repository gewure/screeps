var minWallHitpoints = 300000;
var minRampartHitpoints = 200000;

var roleTower = {
    
    run: function(tower) {
        
        defendRoom('E36S28');
        
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType == STRUCTURE_ROAD && structure.hits < structure.hitsMax) || 
                            (structure.structureType == STRUCTURE_WALL && structure.hits < minWallHitpoints)|| 
                            (structure.structureType == STRUCTURE_RAMPART && structure.hits < minRampartHitpoints) ||
                            (structure.structureType == STRUCTURE_CONTAINER &&structure.hits < structure.hitsMax));
                }, algorithm:'dijkstra'}); 
        
        if(closestDamagedStructure) {
                            console.log('tower is repairing');

            tower.repair(closestDamagedStructure);
        }
    }
}

function defendRoom(roomName) {
    
    var hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
    
    if(hostiles.length > 0) {
        var username = hostiles[0].owner.username;
        Game.notify(`User ${username} spotted in room ${roomName}`);
        var towers = Game.rooms[roomName].find(
            FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        towers.forEach(tower => tower.attack(hostiles[0]));
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