var idlePosX = 30;
var idlePosY = 18;

var toNextRoom = 'exe';
var toSpawnRoom = 'Spawn';
var containerID = '5785398b91941a441c38dd7e';// '5782574e6405edfc66d18381';

var roleOtherRoomUpgrader = {

    /** @param {Creep} creep **/
    
    run: function(creep, toNextRoom, toSpawnRoom, storeID) {
        
        var toNextFlag = Game.flags[toNextRoom];
        var toSpawnFlag = Game.flags[toSpawnRoom];
       
/*if(creep.room.name != 'E31N1') {
            console.log(creep.room.name);
            console.log('[otherRoomUpgrader] im in the wrong room .. NO he isnt? :O');
            creep.moveTo(Game.flags['extraResource']);
          
        } */
        
        if(creep.room == Game.spawns.ImNoobPlzDontKill.room) {
            
            // goto other room
     
            /*  if(creep.pos.x != toNextFlag.x || creep.pos.y != toNextFlag.y) {
                    creep.moveTo(toNextFlag);
                                        creep.move(BOTTOM);
                    creep.move(BOTTOM);

                } else {
                    creep.move(BOTTOM);
                    //creep.move(LEFT);
                } */
       
        } else { // in other room
                
                    
            if(creep.memory.upgrading && creep.carry.energy == 0) {
                creep.memory.upgrading = false;
            }
            
            if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
                creep.memory.upgrading = true;
            }
    
            if(creep.memory.upgrading) {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
                //randomMove(creep, creep.room.controller);
            } else {
                var container = Game.getObjectById(containerID);
                var link = Game.getObjectById('57881083f65bca74406e1b09');
                
                if(link.energy > 230 ) {
                    creep.say('link--',true);
                    if(creep.withdraw(link,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(link);
                    }
                    if(container.store[RESOURCE_ENERGY] +254040> creep.carryCapacity ) {
                        if(container.transfer(creep,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(container);
                        }
                    }
                } else if(container.store[RESOURCE_ENERGY] > creep.carryCapacity) {
                    if(container.transfer(creep,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }
                }
                
                 /*if(creep.carry.energy  < 0) {
                    var source = Game.getObjectById('576a9c7f57110ab231d892fb');
                    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                    }
                } */
             
      
                if(creep.carry.energy == creep.CARRY_CAPACITY) {
                    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    } 
                }
         }
        }
    }
};

//#### helping functions // WORKS! approved so far - not teste in battle, though. but should work.
function randomMove(creep, target) {
    var distance = creep.pos.getRangeTo(target);
    var direction = creep.pos.getDirectionTo(target);
    
   // console.log('creep ' + creep.name + ': randomMove() distance '+distance + ' direction: ' + direction);
    var random = Math.ceil(Math.random()*8);
    //console.log(random);
    try {
        if(distance == 1) {
            if(random != direction) {
                var oppositeDir = target.pos.getDirectionTo(creep);
                creep.move(oppositeDir);
            }
        } else if(distance == 3) {
            creep.move(direction);
        } else if(distance == 2) {
             if(random != direction) {
                creep.move(random);
            }
        } else if(distance == 0) {
            var oppositeDir = target.pos.getDirectionTo(creep);
            creep.move(oppositeDir);
            creep.move(oppositeDir);
        } else if (distance > 3 ) {
            creep.move(direction);
        }
    } catch (someMoveError) {
        // like wall ..?!
    }
}


module.exports = roleOtherRoomUpgrader;