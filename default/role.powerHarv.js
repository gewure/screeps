
var idlePosX = 43;
var idlePosY = 43;

var roomToAttack='E30N2';
var protectMode = false;
var isInAttackRoom = false;
var hitslastTick = 1000;
var fightMode = true;

var minHits =0.67;

var rolePowerHarv = {
    
    /** @param {Creep} creep **/
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
            var target = Game.flags['idle']
          
          //only harvest till 500 hits..
            if(creep.hits >= creep.hitsMax*minHits) {
                
                /////////////////////////
                 if(!creep.pos.isNearTo(Game.flags['target'])) {
                    creep.moveTo(Game.flags['target']);
                    }
                /////////////////////
            if(Game.getObjectById('57a0b8bc2a42ea277626d41b'))
               if(Game.getObjectById('57a0b8bc2a42ea277626d41b').hits > 0)
                if(creep.attack(Game.getObjectById('57a0b8bc2a42ea277626d41b')) == ERR_NOT_IN_RANGE) {
                   creep.moveTo(Game.getObjectById('57a0b8bc2a42ea277626d41b'));
                } else {
                   if(!creep.pos.isNearTo(Game.flags['target'])) {
                    creep.moveTo(Game.flags['target']);
                    }
                }
                   /* var powerR = creep.pos.findClosestByRange(RESOURCE_POWER);
                    
                    if(powerR) {
                        creep.pickup(powerR);
                    } */
                
            } else {
                if(creep.hits+400< creep.hitsMax*minHits)
                    if(!creep.pos.isNearTo(Game.flags['idle'])) {
                creep.moveTo(Game.flags['idle']);
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



module.exports = rolePowerHarv;