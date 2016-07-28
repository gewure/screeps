var utils = require('utils');
var roomToAttack = 'E30N4';
var roleHealer = {
    
moveToRightRoom: function(creep, room)
  {
      try {
    if(creep.room.name == room.name)
    return false;
    
    //utils.logCreep(utils.getCreepInfo(creep) + ': Have to move to right room ' + room.name + ' first.');
    var result = creep.moveTo(new RoomPosition(10, 10, room.name));
    } catch (whateverException) {
        creeo,say('whatEver');
    }
    if(result != OK)
    //utils.logCreep(utils.getCreepInfo(creep) + ': failed: ' + result);
    
    return true;
  },
    /** @param {Creep} creep **/
    run: function(creep) {
        
      
        if(creep.memory.freshSpawn == undefined) {
            creep.memory.freshSpawn = true;
            reep.memory.isInAttackRoom=false;

            
        }
        if(!this.moveToRightRoom(creep,Game.rooms[roomToAttack])) {
            //creep.moveTo(Game.flags['idle2']);
            creep.memory.isInAttackRoom=true;
            //creep.say('fuck');
    
                 var tank = creep.pos.findClosestByPath(FIND_CREEPS, {
                        filter: (creep) => {
                            return (creep.hits < creep.hitsMax);
                        }
                });
                
                 var other = creep.pos.findClosestByRange(FIND_CREEPS, {
                        filter: (creep) => {
                            return (creep.hits < creep.hitsMax);
                        }
                });
    
               //heal the tank
         
                if(tank) {
                    //creep.say('tank');
                    if(tank.hits < tank.hitsMax) {
                        //creep.say('heal');
                        
                        if(creep.pos.isNearTo(tank.pos)) {
                            creep.say('++');
                           creep.heal(tank);
                       } else {
                           //if(creep.rangedHeal(tank)==ERR_NOT_IN_RANGE) {
                               creep.moveTo(tank, {ignoreCreeps:true});
                          // }
                       }
                        if(creep.heal(tank)==ERR_NOT_IN_RANGE) {
                                //creep.rangedHeal(tank);
                                
                                if(creep.moveTo(tank)==0) {
                                    creep.rangedHeal(tank);
                                    creep.say('+' );
                                    creep.heal(tank);
                                } else {
                                    creep.heal(tank);
                                }
                           
                        }
                    }
                    //////////////////////////
            }else {
                creep.say('no tank');
         } 
            
        }else {
       
           creep.say('bla');
                creep.moveTo(Game.flags['idle']);
                console.log('moving into power room');
            
         creep.memory.isInAttackRoom=false;
   }
  
    }
};
function getTank(creep,squad) {
    var friends = creep.room.find(FIND_MY_CREEPS, {
        filter: (creep) => {
                        return (creep.hits < creep.hitsMax);
                    }
    });
    friends.sort((a,b) => a.hits - b.hits);
    return friends[0];
}

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




module.exports = roleHealer;