var fromSource = '579d3f064829e55f43dac15b';
var toTarget = '577b2f88e03b2946707baba5';  
var roomToTrade;

var roleTrader = {
      
    run: function(creep, roomName) { //TODO generify
    
        if(creep.ticksToLive < 150) {
            creep.say('die:'+creep.ticksToLive);
        }
       
        if(creep.carry.power == 0) {
            creep.say('jo');
            if(!creep.pos.isNearTo(Game.flags['target'])) {
                creep.moveTo(Game.flags['target']); 
         var droppedRes = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                        filter: (resource) => {
                            return (resource.amount > creep.pos.getRangeTo(resource) *1.25);
                        }, algorithm:'dijkstra'
            });
            
            if(creep.pickup(droppedRes)==ERR_NOT_IN_RANGE) {
                creep.moveTo(droppedRes);
            }
            } else {
                creep.say('power');
            var droppedRes = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                        filter: (resource) => {
                            return (resource.amount > creep.pos.getRangeTo(resource) *1.25);
                        }, algorithm:'dijkstra'
            });
            
            if(creep.pickup(droppedRes)==ERR_NOT_IN_RANGE) {
                creep.moveTo(droppedRes);
            }
            
                //stor = Game.getObjectById(fromSource);
                //if(creep.withdraw(stor, RESOURCE_POWER)==ERR_NOT_IN_RANGE) {
                 //   creep.moveTo(stor, {reusePath:6});
                //}
                //stor.transferMineral(creep,[RESOURCE_POWER]);
            }
            
        }
        
        if (creep.carry.power == creep.carryCapacity || creep.carry.power >= creep.carryCapacity*0.01 || _.sum(creep.carry) == creep.carry.carryCapacity) {
            
            if(!creep.pos.isNearTo(Game.flags['Stor'])) {
                creep.moveTo(Game.flags['Stor'],{reusePath:3}); 
            } else {
            var bldCont = Game.getObjectById(toTarget);
           // var bldCont2 = Game.getObjectById('5790228fa31198e47e2fad39');
           // var bldCont3 = Game.getObjectById('578e47bf0499d11524c5d757');
           // console.log(bldCont);
            
            
            
    
                    if(creep.transfer(bldCont, RESOURCE_POWER, creep.carry.power) == ERR_NOT_IN_RANGE) {
                         creep.moveTo(bldCont,{reusePath:6});
                    }
                    creep.say('with <3',true);
               
            }
        
        
         } else {
            if(!creep.pos.isNearTo(Game.flags['target'])) {
                creep.moveTo(Game.flags['target']); 
            } else {
                
                    var droppedRes = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                            filter: (resource) => {
                                return (resource.amount > creep.pos.getRangeTo(resource) *1.25);
                            }, algorithm:'dijkstra'
                });
                
                if(creep.pickup(droppedRes)==ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedRes);
                }
                   // stor = Game.getObjectById(fromSource);
                  //  if(creep.withdraw(stor, RESOURCE_POWER)==ERR_NOT_IN_RANGE) {
              //      creep.moveTo(stor,{reusePath:6});
            }
            }
        }
     
    
};

module.exports = roleTrader;