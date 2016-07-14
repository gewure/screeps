var roleDistTransporter = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        // if(!checkSuicide(creep)) {
            if(creep.room.name == 'E39S23') {
                
                if(creep.carry.energy > 0) {
                    var emptyExtensions = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION ||
                                    structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
                        }, algorithm:'dijkstra'});
                    
                    if(emptyExtensions.length > 0) {
                        var closest = creep.pos.findClosestByPath(emptyExtensions);
                        
                        if(creep.transfer(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                            creep.moveTo(closest);
                    } else {
                        var bigStore = Game.getObjectById('578504721b50b6501d1dd3b0');
                        if(_.sum(bigStore.store) < bigStore.storeCapacity) {
                            if(creep.transfer(bigStore, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(bigStore);
                            }
                        }
                    }
                    
                    
                    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                } else {
                     if(creep.pos.x != Game.flags.toKoblach.x || creep.pos.y != Game.flags.toKoblach.y) {
                        creep.moveTo(Game.flags.toKoblach);
                    } else {
                        creep.move(BOTTOM);
                    }
                }
            } else {
                if(creep.carry.energy == creep.carryCapacity) {
                    if(creep.pos.x != Game.flags.toRankweil.x || creep.pos.y != Game.flags.toRankweil.y) {
                        creep.moveTo(Game.flags.toRankweil);
                    } else {
                        creep.move(TOP);
                    }
                } else {
                    if(creep.room.storage.store[RESOURCE_ENERGY] > 10000) {
                        if(creep.room.storage.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(creep.room.storage);
                        }
                        
                    }
                }
            }
        // }
    }
};

function checkSuicide(creep) {
   var npcs = creep.room.find(FIND_HOSTILE_CREEPS, {
            filter: (object) => {return (object.owner != 'Atlan');}, algorithm:'astar'
    });
            
    if(npcs.length > 0) {
        creep.suicide();
        return true;
    }
    return false;
}

module.exports = roleDistTransporter;