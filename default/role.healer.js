var utils = require('utils');

var creepUtils = require('creepUtils');

var roomToAttack = 'E30N2';
var pimpLabID = '578b8b37db6021474ffa389a';
var roleHealer = {
    
moveToRightRoom: function(creep, room)
  {
      try {
    if(creep.room.name == room.name)
    return false;
    
    //utils.logCreep(utils.getCreepInfo(creep) + ': Have to move to right room ' + room.name + ' first.');
    var result = creep.moveTo(new RoomPosition(10, 10, room.name));
    } catch (whateverException) {
        creep.say('whatEver');
    }
    if(result != OK)
    //utils.logCreep(utils.getCreepInfo(creep) + ': failed: ' + result);
    
    return true;
  },
    /** @param {Creep} creep **/
    run: function(creep) {
        
        
        if(creep.memory.freshSpawn == undefined) {
            creep.memory.freshSpawn = true;
            creep.memory.isInAttackRoom=false;
     
        }
        var body = creep.body;
        //console.log(body);
        
        //boosting
        var labLO = Game.getObjectById(pimpLabID);
     
        if(!isBoosted(creep) && false)  {
            creep.moveTo(labLO);
            labLO.boostCreep(creep);
            //creep.memory.isBoosted=true;
        }
     // remove else if code without boosting
        else if(!this.moveToRightRoom(creep,Game.rooms[roomToAttack])) {
            
            if(creep.pos.isNearTo(Game.flags['idle']))
                creep.moveTo(Game.flags['idle']);
            //if(creep.pos.getRangeTo(Game.flags['target']) < 1)
            //creep.move(Game.flags['target'].getDirectionTo(creep));
            //creep.moveTo(Game.flags['idle2']);
            creep.memory.isInAttackRoom=true;
            //creep.say('fuck');
    
                 var tank = creep.pos.findClosestByRange(FIND_CREEPS, {
                        filter: (creep) => {
                            return (creep.hits  < creep.hitsMax || creep.getActiveBodyparts(MOVE) <=3);
                        }
                });
                
               var melees = _.filter(Game.creeps, (creep) => creep.memory.role == 'powerHarv');
                
                 var other = creep.pos.findClosestByRange(FIND_CREEPS, {
                        filter: (creep) => {
                            return (creep.hits < creep.hitsMax);
                        }
                });
    
               //heal the tank
         
                if(tank ) {
                       //creep.say('');
                    if(creep.pos.isNearTo(Game.flags['target']))
                    creep.moveTo(Game.flags['idle']); // to avoid blocking
                    
                    
                    if(creep.pos.isNearTo(tank)) {
                            //creep.say('++',true);
                           creep.heal(tank);
                           //creep.rangedHeal(tank);
                    } else {
                        creep.moveTo(tank);
                       // creep.rangedHeal(tank);
                    }
                    //creep.say('tank');
                    if(tank.hits < tank.hitsMax) {
                        //creep.say('heal');
                        
                        if(creep.pos.isNearTo(tank)) {
                            //creep.say('++',true);
                           creep.heal(tank);
                           //creep.rangedHeal(tank);
                       } else {
                            
                           if(creep.rangedHeal(tank)==ERR_NOT_IN_RANGE) {
                               creep.moveTo(tank);
                          }
                       }
                        if(!creep.pos.isNearTo(tank)) {
                                creep.heal(tank);
                                creep.moveTo(tank);
                                //creep.rangedHeal(tank);
                                //creep.rangedHeal(tank);
                                /*if(creep.moveTo(tank)!=0) {
                                  // creep.rangedHeal(tank);
                                    creep.say('+' ,true);
                                    creep.heal(tank);
                                    creep.moveTo(tank);

                                } else {
                                    creep.moveTo(tank);
                                    creep.heal(tank);
                                    //creep.rangedHeal(tank);
                                } */
                           
                        }
                    } else {
                        if(melees.length>2) {
                            if(melees[0].hits < melees[0].hitsMax) {
                                creep.heal(melees[0]);
                            } else if(melees[1].hits < melees[1].hitsMax) {
                                creep.heal(melees[1]);
                            }
                        }
                    }
                    //////////////////////////
            }else {
                creep.say(':)',true);
                creep.moveTo(Game.flags['idle']);
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

//boost?
function isBoosted(creep) {
    var result = false;
    for(var i = 0; i < creep.body.length;i++) {
        if(result)
            return result;
        if(creep.body[i].boost!=undefined) {
            //creep.say('im boosted');
            result = true;
        }
    }
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