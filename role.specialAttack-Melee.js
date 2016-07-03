var idlePosX = 20;
var idlePosY = 17;

var roleSpecialAttackMelee = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.room == Game.spawns.Koblach.room) {
            if(creep.pos.x != Game.flags.attackExit.x || creep.pos.y != Game.flags.attackExit.y) {
                creep.moveTo(Game.flags.attackExit);
            } else {
                creep.move(TOP);
            }
        } else {
            
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return ((structure.structureType != STRUCTURE_RAMPART)
                            && (structure.structureType != STRUCTURE_WALL)
                                    );
                        }, algorithm:'dijkstra'}); 
                        
            if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
                if(creep.isNearTo(target)) {
                    creep.attack(target);
                }
            }
        }
    }
};

function walkToExit(creep) {
    
}

module.exports = roleSpecialAttackMelee;