var containerIDs = ['57796949720916567dc376ca', '5779b1268eef705e48c33a6e']; //<<-- THIS i hardcoded!
var storageID = '577b2f88e03b2946707baba5'; // Terminal: 57873c64cf3a1f7c0baf3f53
var terminalID = '57873c64cf3a1f7c0baf3f53';
var minContAmount = 800;
var termEnergyCap = 100000;
var roleStoreMover = {

    /** @param {Creep} creep **/
    run: function(creep, storageID, terminalID, linkID) {
        var stor = Game.getObjectById(storageID);
        var terminal = Game.getObjectById(terminalID);
        var link = Game.getObjectById(linkID);
        var container = getHighestContainer(creep);
        
            if(creep.carry.energy == 0 && container.store[RESOURCE_ENERGY] > minContAmount) {

                if(container.transfer(creep, RESOURCE_ENERGY, creep.carryCapacity) ==ERR_NOT_IN_RANGE) {
                      creep.moveTo(container,{reusePath:3});
                } else {
                   creep.say((Math.ceil(stor.store[RESOURCE_ENERGY]/1000)) +'k',true);
                }
            } else if(creep.carry.energy > 0) {
                if(creep.pos.isNearTo(link)) {
                    //creep.say('near link');
                    if(link.energyCapacity > link.energy+creep.carry.energy) {
                        //creep.say('link wants');
                        creep.transfer(link, RESOURCE_ENERGY, creep.carry.energy);
                        creep.say('link++',true);
                    } else {
                      
                        if(creep.transfer(stor, RESOURCE_ENERGY, creep.carry.energy) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(stor, {reusePath:3});
                        }
                    }
                }
                else if(_.sum(stor.store) < 900000) {
                    if(creep.transfer(stor, RESOURCE_ENERGY, creep.carry.energy) == ERR_NOT_IN_RANGE) {
                      creep.moveTo(stor);
                    }

                } else {
                    if(creep.transfer(terminal, RESOURCE_ENERGY, creep.carry.energy) == ERR_NOT_IN_RANGE) {
                      creep.moveTo(terminal);
                    }
                }
                
            } else if(terminal.store[RESOURCE_ENERGY] > termEnergyCap) {
                creep.say('term--');
                if(creep.withdraw(terminal, RESOURCE_ENERGY, creep.carryCapacity) ==ERR_NOT_IN_RANGE) {
                      creep.moveTo(terminal);
                }
            }
    }
}
function getHighestContainer(creep) {
    var result;
    var before=0;
     for(var i = 0; i < containerIDs.length; i++) {
          var container = Game.getObjectById(containerIDs[i]);
              if(container.store[RESOURCE_ENERGY] >= before && container.storeCapacity == 2000) { //GEÄNDERT UM NUR ENERGY ZU BEKOMMEN
                before = container.store.energy;
                result = container;
              } 
        } 
    return result;
}


module.exports = roleStoreMover;