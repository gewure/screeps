
var idlePosX = 43;
var idlePosY = 43;

var roomToAttack='E32N2';
var protectMode = false;
var isInAttackRoom = false;
var hitslastTick = 1000;
var fightMode = true;

var roleRanged = {
    

    /** @param {Creep} creep **/
    run: function(creep) {
       
     if(creep.pos.roomName == roomToAttack) {
         creep.memory.isInAttackRoom=true;
         creep.memory.freshSpawn=false;
            //creep.moveTo(Game.flags['simon']);
        creep.say('yo, attack');
     } else {
                         

         creep.memory.isInAttackRoom=false;
     }
        if(!protectMode) {
            if(!creep.memory.isInAttackRoom) {
                creep.say('hohoho',true);
                creep.moveTo(Game.flags['death'],{ignoreCreeps:false});
                console.log('moving into attacking room');
            }
        }
      
        if(creep.memory.freshSpawn == undefined) {
            creep.memory.freshSpawn = true;
            creep.memory.isInAttackRoom=false;
        }
      
        // if not a fresh spawn
        if(!creep.memory.freshSpawn) {
           
            var closestHostiles =creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            console.log('closests hostiles' + closestHostiles);
            if(!closestHostiles) {
                 closestHostiles= creep.room.find(FIND_HOSTILE_STRUCTURES)[0];
            }
            /*if(creep.hits <= 100) {
                fightMode = false;
                patrol(creep);
            } */
           
            var healer; //= getHealer(creep, closestHostiles);
            
            if(healer) {
                if(false && creep.rangedAttack(closestHostiles) == ERR_NOT_IN_RANGE /*&& creep.memory.fleeCounter != 0*/) {
                    randomMove(creep, closestHostiles);
                   // rangedAttack(closestHostiles);
                }
       
            } else if(creep.rangedAttack(closestHostiles) == ERR_NOT_IN_RANGE /*&& creep.memory.fleeCounter != 0*/ ) {
                randomMove(creep, closestHostiles);
                //creep.moveTo(closestHostiles);;
                //rangedAttack(closestHostiles);
        
                    //creep.memory.fleeCounter--;
                
            } else {
                creep.moveTo(closestHostiles);
                   
            }
            // move to spawn position
        } else {

            
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

function randomMove(creep, target) {
    creep.say('rdmMove');
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
        } else if (distance > 3 ) {
            creep.move(direction);
        }
    } catch (someMoveError) {
        // like wall ..?!
    }
}

module.exports = roleRanged;