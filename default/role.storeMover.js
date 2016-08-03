var containerIDs = ['57796949720916567dc376ca', '5779b1268eef705e48c33a6e']; //<<-- THIS i hardcoded!
var storageID = '577b2f88e03b2946707baba5'; // Terminal: 57873c64cf3a1f7c0baf3f53
var terminalID = '57873c64cf3a1f7c0baf3f53';
var minContAmount = 300;
var termEnergyCap = 100000;
var roleStoreMover = {

  name: 'storeMover',
    run: function(creep, linkID) {
        var stor = creep.room.storage;
        var terminal = creep.room.terminal;
        var link = Game.getObjectById(linkID);
        var container = getHighestContainer(creep);
        
            if(_.sum(creep.carry) == 0 && _.sum(container.store) > minContAmount) {
                
                
                if(container.transfer(creep, RESOURCE_LEMERGIUM, creep.carryCapacity)==ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
                
                if(container.transfer(creep, RESOURCE_ENERGY, creep.carryCapacity) ==ERR_NOT_IN_RANGE) {
                      creep.moveTo(container,{reusePath:3});
                } else {
                   creep.say((Math.ceil(stor.store[RESOURCE_ENERGY]/1000)) +'k',true);
                }
            } else if(creep.carry.energy > 0) {
                if((creep.pos.isNearTo(link) || link.energy < 200 )||(creep.pos.isNearTo(link) && link.energy < 200)) {
                   if(!creep.pos.isNearTo(link))
                   creep.moveTo(link);
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
            } else if(creep.carry[RESOURCE_LEMERGIUM] > 0 | creep.carry[RESOURCE_OXYGEN] > 0 |creep.carry[RESOURCE_UTRIUM] > 0) {
                creep.say('term++');
                if(!creep.pos.isNearTo(terminal)) {
                    creep.moveTo(terminal, {reusePath:2});
                } else {
                      Object.keys(creep.carry).map((resource) => { creep.transfer(terminal, resource) });
                }
            }
    }
}
function getHighestContainer(creep) {
    var result;
    var before=0;
     for(var i = 0; i < containerIDs.length; i++) {
          var container = Game.getObjectById(containerIDs[i]);
              if(_.sum(container.store) >= before && container.storeCapacity == 2000) { //GEÄNDERT UM NUR ENERGY ZU BEKOMMEN
                before = _.sum(container.store);
                result = container;
              } 
        } 
    return result;
}


module.exports = roleStoreMover;