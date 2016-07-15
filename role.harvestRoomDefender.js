var roleHarvestRoomDefender = {

    /** @param {Creep} creep **/
    run: function(creep, roomFlag, attackRoomName, harvestRoomExitDirection, idleTarget) {
        
        if(Memory.invaderInHarvestRoom[attackRoomName]) {
            if(creep.room.name == attackRoomName) {
    
                var enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                
                if(enemy != undefined) {
                    var result = undefined;
                    if((result = creep.attack(enemy)) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(enemy);
                    } else if(result == OK) {
                        if(enemy == undefined || (enemy != undefined && enemy.hits == 0)) {
                            Memory.invaderInHarvestRoom[attackRoomName] = false;
                        }
                    }
                } 
            } else {
                if(creep.room.name == creep.memory.spawnRoomName) {
                    if(creep.pos.x != Game.flags[roomFlag].x || creep.pos.y != Game.flags[roomFlag].y) {
                        creep.moveTo(Game.flags[roomFlag]);
                    } else {
                        creep.move(harvestRoomExitDirection);
                    }
                }
            }
        } else {
            console.log(idleTarget);
            if(!creep.pos.isNearTo(idleTarget)) {
                creep.say('MOVE');
                creep.moveTo(idleTarget);
            }
        }
    }
};

module.exports = roleHarvestRoomDefender;