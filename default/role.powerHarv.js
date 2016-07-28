
var idlePosX = 43;
var idlePosY = 43;

var roomToAttack='E29S0';
var protectMode = false;
var isInAttackRoom = false;
var hitslastTick = 1000;
var fightMode = true;

var rolePowerHarv = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
       
     if(creep.pos.roomName == roomToAttack) {
         creep.memory.isInAttackRoom=true;
     } else {
         creep.memory.isInAttackRoom=false;
     }
       
        /*if(!creep.pos.isNearTo(Game.flags['power'])) {
                creep.moveTo(Game.flags['power']); ///////<----------------
            } */
            if(!creep.memory.isInAttackRoom) {
                if(creep.hits>2500)
                creep.moveTo(Game.flags['target']);
                console.log('moving into power room');
            }
  
      
        if(creep.memory.freshSpawn == undefined) {
            creep.memory.freshSpawn = true;
          
        }
      
        // if not a fresh spawn
        if(!creep.memory.freshSpawn) {
            var target = Game.flags['target']
          
          //only harvest till 500 hits..
            if(creep.hits >= 2400) {
                if(creep.attack(Game.getObjectById('5798d7efec5c7aa108ab3188')) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById('5798d7efec5c7aa108ab3188'));
                    
                   /* var powerR = creep.pos.findClosestByRange(RESOURCE_POWER);
                    
                    if(powerR) {
                        creep.pickup(powerR);
                    } */
                }
            } else {
                if(creep.hits > 2500)
                creep.moveTo(Game.flags['target']);
                if(creep.pos.isNearTo(Game.flags['target'])) {
                    //creep.transfer(Game.getObjectById('5779b1268eef705e48c33a6e'), RESOURCE_POWER);
                }
            }
     
        
            // move to spawn position
        } else {
          
           if(creep.hits > 2400)
            if(!creep.pos.isNearTo(Game.flags['target'])) {
                creep.moveTo(Game.flags['target']);
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