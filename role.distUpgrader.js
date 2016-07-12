var roleDistUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(!checkSuicide(creep)) {
            if(creep.room.name == 'E39S23') {
                
                if(creep.carry.energy > 0) {
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
        }
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

module.exports = roleDistUpgrader;