var idlePosX = 20;
var idlePosY = 17;

var roleMelee = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.freshSpawn == undefined) {
            creep.memory.freshSpawn = true;
        }
        
        if(!creep.memory.freshSpawn) {

            var closestHostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            if(creep.attack(closestHostile) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestHostile);
            }
        } else {
            if(!creep.pos.isNearTo(idlePosX, idlePosY)) {
                creep.moveTo(idlePosX, idlePosY, {reusePath: true});
            } else {
                creep.memory.freshSpawn = false;
                creep.say('ready');
            }
        }
    }
};
module.exports = roleMelee;