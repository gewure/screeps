/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.melee');
 * mod.thing == 'a thing'; // true
 */
var idlePosX = 39;
var idlePosY = 27;

var roomToAttack='E36S29';
var protectMode = true;
var isInAttackRoom = false;
var hitslastTick = 1000;
var fightMode = true;

var roleMelee = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(!protectMode) {
            if(!isInAttackRoom) {
                creep.moveTo(roomToAttack);
            }
        }
      
        if(creep.memory.freshSpawn == undefined) {
            creep.memory.freshSpawn = true;
        }
        
        // if not a fresh spawn
        if(!creep.memory.freshSpawn) {

            var closestHostiles = creep.room.find(FIND_HOSTILE_CREEPS);
            
            if(creep.hits <= 100) {
                fightMode = false;
                patrol(creep);
            }
           
            var healer = getHealer(creep, closestHostiles);
            
            if(healer) {
                if(canInflictDamage(creep, healer[0], healer[1])) {
                        creep.rangedAttack(healer);
                } else {
                        console.log('cant deal damage');
                }
                    
            }else if(creep.rangedAttack(closestHostiles[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestHostiles[0]);
            } else {
                creep.attack(closestHostiles[0]);
                creep.rangedAttack(closestHostiles[0]);
                //if counterattacked: calculate direction of attack and move 1 step in other direction
                if(creep.hits < hitslastTick) {
                    hitslastTick = creep.hits;
                    var dirToAvaidAttack = closestHostiles[0].getDirectionTo(creep);
                    creep.move(dirToAvaidAttack);
                }   
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

//used to flee if hitpoints < 100
function patrol(creep) {
        while(!fightMode) {
            creep.moveTo(21,23);
            creep.moveTo(34,31);
            creep.moveTo(37,10);
        }
        return;
}
module.exports = roleMelee;
