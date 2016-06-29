/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.melee');
 * mod.thing == 'a thing'; // true
 */
var idlePosX = 11;
var idlePosY = 47;

var roomToAttack='E36S29';
var isInAttackRoom = false;

var roleMelee = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(!isInAttackRoom) {
            creep.moveTo(roomToAttack);
        }
      
        if(creep.memory.freshSpawn == undefined) {
            creep.memory.freshSpawn = true;
        }
        
        // if not a fresh spawn
        if(!creep.memory.freshSpawn) {

            var closestHostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
           
            if(creep.attack(closestHostile) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestHostile);
            } else {
            
            }
            // move to spawn position
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
