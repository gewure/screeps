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
            var wallexists = false;
            var walls = ['57777f8cf9d893cf6dee4b6c', '57777f923b890db9614f7319'];
            for(var i = 0; i < walls.length; ++i) {
                var wall = Game.getObjectById(walls[i]);
                if(wall != undefined && wall != null) {
                    if(creep.attack(wall) == ERR_NOT_IN_RANGE) creep.moveTo(wall);
                    wallexists = true;
                    break;
                }
            }
            
            if(!wallexists) {
                var target = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS, {algorithm:'dijkstra'});
                
                if(target == undefined)
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return ((structure.structureType != STRUCTURE_RAMPART)
                                && (structure.structureType != STRUCTURE_ROAD)
                                && (structure.structureType != STRUCTURE_CONTAINER)
                                && (structure.structureType != STRUCTURE_CONTROLLER)
                                        );
                            }, algorithm:'dijkstra'}); 
                
                if(target != undefined) {     
                    console.log('target: ' + target);
                    if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                        if(creep.pos.isNearTo(target)) {
                            creep.attack(target);
                        }
                    }
                } else {
                    var enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    if(enemy != undefined) {
                        if(creep.attack(enemy) == ERR_NOT_IN_RANGE)
                            creep.moveTo(enemy);
                    }
                }
            }
        }
    }
};

function walkToExit(creep) {
    
}

module.exports = roleSpecialAttackMelee;