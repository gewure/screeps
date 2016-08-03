var fromSource = '577f46b09173f69d1ec045bc';//'577b2f88e03b2946707baba5'; // container with flag 'builders' in exeroom
var toTarget = '578827065e25d84333a32001';  //link with flag 'link' in homeroom

var roleCrossRoomTransporter = {
      
    run: function(creep) { //TODO generify
    
    container = Game.getObjectById(toTarget);
    link = Game.getObjectById(fromSource);
    
        if(creep.carry.energy == 0) {
            creep.moveTo(container);
            
             // get energy from container, if he has content
            if(container.energy > creep.carryCapacity) {
                creep.withdraw(container,RESOURCE_ENERGY, creep.carryCapacity);
            }
           
        }
        
        if (creep.carry.energy == creep.carryCapacity) {
            console.log('creep is full and want sto transfer to empty link');
             //creep.moveTo(link);
             if(link.energy + creep.carry.energy < link.energyCapacity) {
                 console.log('why not??');
                 if(creep.transfer(link, RESOURCE_ENERGY, creep.carry.energy) == ERR_NOT_IN_RANGE) {
                     creep.moveTo(link);
                 }
             }
             // get to link in home room, deliver carry if link has room
        }
    }
};

module.exports = roleCrossRoomTransporter;