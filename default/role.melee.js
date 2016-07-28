

var roomToAttack='E33N3';
var protectMode = false;
var isInAttackRoom = false;
var hitslastTick = 1000;
var fightMode = true;

var roleMelee = {
    
    /** @param {Creep} creep **/
    run: function(creep,disTargIDs) {
        
        var dismantleTargetIDs = disTargIDs;
               // creep.say(creep.pos.roomName,true);
                //creep.say(creep.memory.freshSpawn);
                     //console.log('CCCCCCCCCC'+creep.pos.roomName + '    '+ roomToAttack);
        
        var extensions = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);

        if(creep.ticksToLive<200) {
            creep.say('NOW!!!!');
        }
        if(creep.ticksToLive < 350) {
            creep.say('GO KILL!',true);
        }
        if(creep.ticksToLive > 350 && creep.ticksToLive <500) {
            creep.say(creep.ticksToLive-350,true);
        }
     if(creep.pos.roomName == roomToAttack) {
        // creep.say('attack!', true);
         creep.memory.isInAttackRoom=true;
     } else {
         creep.memory.isInAttackRoom=false;
     }
        if(!protectMode) {
            if(!creep.memory.isInAttackRoom) {
                //console.log('WTTTTTTF');
                creep.moveTo(Game.flags['target']);
            } else {
                creep.moveTo(Game.flags['target']);
               // creep.say('ore ore', true);
            }
        }
      
        if(creep.memory.freshSpawn == undefined) {
            creep.memory.freshSpawn = true;
            creep.memory.isInAttackRoom=false;
        }
      
        // if not a fresh spawn
        if(!creep.memory.freshSpawn) {
           
        } else {
            for(var i = 0; i< dismantleTargetIDs.length; i++) {
                if(Game.getObjectById(dismantleTargetIDs[i])) {
                    dismantle(creep, dismantleTargetIDs[i]);
                    creep.say('we are sorry',true);
                } else {
                    creep.say('dest');
                    if(extensions != null)
                    dismantle(creep,extensions.id);
                }
           }
            //creep.say('ready',true);
        } 
            
        
    }
};

function dismantle(creep,targetID) {
    var target = Game.getObjectById(targetID);
        //console.log('ATTACK IT FFS! '+ target);

    //console.log('dismantler ' + target);
    creep.moveTo(target,{ignoreCreeps: true, ignoreRoads:false});
    if(target) {
        //console.log('builder '+creep.name+' wants to dismantle '+target);
       
            if(creep.dismantle(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target,{ignoreCreeps: true, ignoreRoads:false });
        }
    } else { // if the target doesnt exist anymore
        //console.log('cant dismantle: ' + target + ' doesnt exist anymore');
        // TODO: delete from list!
        return;
    }
}


module.exports = roleMelee;