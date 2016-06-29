/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.melee');
 * mod.thing == 'a thing'; // true
 */
var idlePosX = 22;
var idlePosY = 4;

var roleMelee = {

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.moveTo(22,4);
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
