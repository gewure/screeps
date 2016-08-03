/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.attacker');
 * mod.thing == 'a thing'; // true
 */

/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.melee');
 * mod.thing == 'a thing'; // true
 */
var idlePosX = 29;
var idlePosY = 37;

var roomToAttack='E36S29';
var protectMode = true;
var isInAttackRoom = false;
var hitslastTick = 1000;
var fightMode = true;

var roleAttacker = {

    /** @param {Creep} creep **/
    run: function(creep) {
       
        if(!protectMode) {
            if(!isInAttackRoom) {
                creep.moveTo(roomToAttack);
                console.log('moving into attacking room');
                creep.move(BOTTOM);
                creep.move(BOTTOM);
                 creep.move(BOTTOM);

             
            }
        }
      
        if(creep.memory.freshSpawn == undefined) {
            creep.memory.freshSpawn = true;
        }
      
        // if not a fresh spawn
        if(!creep.memory.freshSpawn) {
            var closestHostiles = creep.room.find(FIND_HOSTILE_STRUCTURES);
            
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

           //creep.moveTo(idlePosX, idlePosY);

            if(!creep.pos.isNearTo(idlePosX, idlePosY)) {
                creep.moveTo(idlePosX, idlePosY, {reusePath: false});
            } else {
                console.log('aaaaaaa');
                creep.memory.freshSpawn = false;
                creep.say('ready');
            }
            
        }
    }
};


function getHealer(creep, hostileCreeps) {
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

//used to flee if hitpoints < 100
function patrol(creep) {
        while(!fightMode) {
            creep.moveTo(21,23);
            creep.moveTo(34,31);
            creep.moveTo(37,10);
        }
        return;
}

module.exports = roleAttacker;