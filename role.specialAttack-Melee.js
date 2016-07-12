var idlePosX = 20;
var idlePosY = 17;

var roleSpecialAttackMelee = {

    /** @param {Creep} creep **/
    run: function(creep) {
        attackFlags = [Game.flags.attackExit, Game.flags.attackExit2];
        attackDirection = [TOP, TOP];
        targetRoom = 'E39S21';
        
        if(creep.room.name == 'E39S24') {
            //var index = getFlagIndex(creep, attackFlags);
            
            // var ramp = Game.getObjectById('57811740d6c1b2c23e2c2b84');
            
            // if(ramp != undefined) {
            //   if(creep.attack(ramp) == ERR_NOT_IN_RANGE) {
            //       creep.moveTo(ramp);
            //   } 
            // } else {
                // var tower = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                //                 filter: (structure) => {
                //                     return ((structure.structureType == STRUCTURE_TOWER));
                //                 }, algorithm:'astar'});
                // if(tower != undefined) {
                //     creep.say('TOWE');
                //     if(creep.attack(tower) == ERR_NOT_IN_RANGE) {
                //         creep.moveTo(tower);
                //     }
                // } else {
                    var enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    
                    if(enemy != undefined) {
                        if(creep.attack(enemy) == ERR_NOT_IN_RANGE)
                            creep.moveTo(enemy);
                    } else {
                    
                    
                        // target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        //             filter: (structure) => {
                        //                 return ((structure.structureType != STRUCTURE_RAMPART)
                        //                 && (structure.structureType != STRUCTURE_ROAD)
                        //                 && (structure.structureType != STRUCTURE_CONTAINER)
                        //                 && (structure.structureType != STRUCTURE_CONTROLLER)
                        //                         );
                        //             }, algorithm:'dijkstra'}); 
                        
                        // if(target != undefined) {          
                        //     if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                        //         creep.moveTo(target);
                        //     }
                        // } else {
                        //     var enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                        //     if(enemy != undefined) {
                        //         if(creep.attack(enemy) == ERR_NOT_IN_RANGE)
                        //             creep.moveTo(enemy);
                        //     }
                        // }
                    }
                // }
            // }
            
        } else {
            if(creep.room == Game.spawns.Koblach.room) {
                if(creep.pos.x != Game.flags.attackExit.x || creep.pos.y != Game.flags.attackExit.y) {
                    creep.moveTo(Game.flags.attackExit);
                } else {
                    creep.move(TOP);
                }
            } else if(creep.room.name == 'E39S23') {
                var enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if(enemy != undefined) {
                    if(creep.attack(enemy) == ERR_NOT_IN_RANGE)
                        creep.moveTo(enemy);
                } else if(!creep.pos.isNearTo(14,11)) {
                    creep.moveTo(14,11);
                }
                // if(creep.pos.x != Game.flags.attackExit2.x || creep.pos.y != Game.flags.attackExit2.y) {
                //     creep.moveTo(Game.flags.attackExit2);
                // } else {
                //     creep.move(TOP);
                // }
            } else if(creep.room.name == 'E39S22') {
                // if(creep.pos.x != Game.flags.attackExit3.x || creep.pos.y != Game.flags.attackExit3.y) {
                    // creep.moveTo(Game.flags.attackExit3);
                // } else {
                    // creep.move(TOP);
                // }
            }
        }
        
        // if(creep.room == Game.spawns.Koblach.room) {
        //     if(creep.pos.x != Game.flags.attackExit.x || creep.pos.y != Game.flags.attackExit.y) {
        //         creep.moveTo(Game.flags.attackExit);
        //     } else {
        //         creep.move(TOP);
        //     }
        // } else {
            // var wallexists = false;
            // //var walls = ['57777f8cf9d893cf6dee4b6c', '57777f923b890db9614f7319'];
            // for(var i = 0; i < walls.length; ++i) {
            //     var wall = Game.getObjectById(walls[i]);
            //     if(wall != undefined && wall != null) {
            //         if(creep.attack(wall) == ERR_NOT_IN_RANGE) creep.moveTo(wall);
            //         wallexists = true;
            //         break;
            //     }
            // }
            
            // if(!wallexists) {
                // var target = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS, {algorithm:'dijkstra'});
                
                // if(target == undefined)
                // target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                //             filter: (structure) => {
                //                 return ((structure.structureType != STRUCTURE_RAMPART)
                //                 && (structure.structureType != STRUCTURE_ROAD)
                //                 && (structure.structureType != STRUCTURE_CONTAINER)
                //                 && (structure.structureType != STRUCTURE_CONTROLLER)
                //                         );
                //             }, algorithm:'dijkstra'}); 
                
                // if(target != undefined) {     
                //     console.log('target: ' + target);
                //     if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                //         creep.moveTo(target);
                //         if(creep.pos.isNearTo(target)) {
                //             creep.attack(target);
                //         }
                //     }
                // } else {
                var enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if(enemy != undefined) {
                    if(creep.attack(enemy) == ERR_NOT_IN_RANGE)
                        creep.moveTo(enemy);
                } else {
                    //GOTO NEXT ROOM
                }
                // }
            // }
        // }
    }
};

function walkToExit(creep) {
    
}

module.exports = roleSpecialAttackMelee;