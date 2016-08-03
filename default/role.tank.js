var utils = require('utils');

var roomToAttack='E35N1';
var protectMode = false;
var isInAttackRoom = false;
var hitslastTick = 1000;
var fightMode = true;

var minHits =0.1;

var roleTank = {
    
    name: 'roleTank',
    run: function(creep) {
       
     if(creep.pos.roomName == roomToAttack) {
         creep.memory.isInAttackRoom=true;
     } else {
         creep.memory.isInAttackRoom=false;
     }
       

    if(!creep.memory.isInAttackRoom) {
        if(creep.hits>=creep.hitsMax*minHits)
        creep.moveTo(Game.flags['idle']);
        console.log('moving into power room');
    }
  
      
        if(creep.memory.freshSpawn == undefined) {
            creep.memory.freshSpawn = true;
          
        }
      
        // if not a fresh spawn
        if(!creep.memory.freshSpawn) {
            creep.say('rdy');
            if(creep.hits >= creep.hitsMax*minHits) {
                    
                    /////////////////////////
                     //if(!creep.pos.isNearTo(Game.flags['target'])) {
                       // creep.moveTo(Game.flags['target']);
                        //}
                    /////////////////////
                var closestEnemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS)    
                if (closestEnemy)
                if(!utils.isFriendlyCreep(closestEnemy)) {
                    creep.say('POW!', true);
                   if(closestEnemy.hits > 0)
                    if(creep.attack(closestEnemy) == ERR_NOT_IN_RANGE) {
                       creep.moveTo(closestEnemy);
                    } else {
                       if(!creep.pos.isNearTo(closestEnemy)) {
                        creep.moveTo(closestEnemy);
                        }
                    }
                     
                    
                } else {
                    creep.say('he Friend',true);
                    if(creep.hits< creep.hitsMax*minHits) {
                        if(!creep.pos.isNearTo(Game.flags['idle'])) {
                            creep.moveTo(Game.flags['idle']);
                        }
                    }
                }
            }
            // move to spawn position
        } else {
          
           if(creep.hits >= creep.hitsMax*minHits)
            if(!creep.pos.isNearTo(Game.flags['idle'])) {
                creep.moveTo(Game.flags['idle']);
            } else {
                creep.memory.freshSpawn = false;
               
            } 
            
        }
    }
};



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



module.exports = roleTank;