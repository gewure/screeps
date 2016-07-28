var fromSource = '56f06df1ffd8f8bd557ef914';
var toTarget = '577b2f88e03b2946707baba5';  
var roomToTrade;

var roleTrader = {
      
    run: function(creep, roomName) { //TODO generify
    
        if(creep.ticksToLive < 150) {
            creep.say('die:'+creep.ticksToLive);
        }
       
        if(creep.carry.energy == 0) {
            
            if(!creep.pos.isNearTo(Game.flags['bldSource'])) {
                creep.moveTo(Game.flags['bldSource']); 
            } else {
                stor = Game.getObjectById(fromSource);
                if(creep.withdraw(stor, RESOURCE_POWER)==ERR_NOT_IN_RANGE) {
                    creep.moveTo(stor, {reusePath:6});
                }
            }
            
        }
        
        if (creep.carry.power == creep.carryCapacity || creep.carry.power >= creep.carryCapacity*0.67) {
            
            if(!creep.pos.isNearTo(Game.flags['bldCont'])) {
                creep.moveTo(Game.flags['bldCont'],{reusePath:6}); 
            } else {
            var bldCont = Game.getObjectById(toTarget);
           // var bldCont2 = Game.getObjectById('5790228fa31198e47e2fad39');
           // var bldCont3 = Game.getObjectById('578e47bf0499d11524c5d757');
           // console.log(bldCont);
            
            
                if(bldCont.store[RESOURCE_POWER] + creep.carry.power < bldCont.storeCapacity) {
    
                    if(creep.transfer(bldCont, RESOURCE_POWER, creep.carry.power) == ERR_NOT_IN_RANGE) {
                         creep.moveTo(bldCont,{reusePath:6});
                    }
                    creep.say('with <3',true);
                } 
            }
        
        
         } else {
            if(!creep.pos.isNearTo(Game.flags['bldSource'])) {
                creep.moveTo(Game.flags['bldSource']); 
            } else {
                stor = Game.getObjectById(fromSource);
                if(creep.withdraw(stor, RESOURCE_POWER)==ERR_NOT_IN_RANGE) {
                    creep.moveTo(stor,{reusePath:6});
                }
            }
        }
     
    }
};

module.exports = roleTrader;