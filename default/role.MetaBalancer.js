var containerIDs = ['57796949720916567dc376ca', '5779cfd7986f591c34eadf9a', '577acd04d33b4b4d0f4bf616' , '5779b1268eef705e48c33a6e', '577af4e8502328d4276d1a7d']; // 
var storageID = '577b2f88e03b2946707baba5'; //TODO
var towerIDs = ['5779f6286ce428014acf2e71'];
//var idlePosX = 35;
//var idlePosY = 31;
//var minEnergyLimit = 200; 
//var minStorageLimit = 1000;  

// balancing - how much tolerance in %?
var balance = 30; // the lower the more refilling
var minContainerCont = 397;
//######################################## job is to keep the containers filled
var roleMetaBalancer = {
    
    run: function(creep, contIDs, contStorIDs, towIDs) {
        containerIDs = contIDs;
        containerIDsWStorage = contStorIDs;
        towerIDs = towIDs;
    
        var lowestC = getLowestContainer();
        var highestC = getHighestContainer();
        creep.memory.lowestC=lowestC;
        creep.memory.highestC=highestC;
        
        //console.log(highestC +'highest container has ' + highestC.store.energy + ' at ' + highestC.pos);
        //console.log(lowestC+ 'lowest container has ' + lowestC.store.energy + ' at ' + lowestC.pos);
        //console.log(creep.carry.energy + ' energy from ' + creep.carryCapacity);
         
         //###################################### death logic
	    if(creep.ticksToLive <= 35) {
	        
    	     var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ( structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
                    });
                    
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
	    } // -- end death logic
	    
        //################ statemachine, cheap version
        if (lowestC.store[RESOURCE_ENERGY] < highestC.store[RESOURCE_ENERGY]-highestC.store[RESOURCE_ENERGY]*(balance/100) && highestC.store[RESOURCE_ENERGY] > minContainerCont) { 
            
            if(creep.carry.energy == creep.carryCapacity) {
                        //console.log('balancer is FULL and will be put in BALANCE state');
                       // console.log(creep.carry.energy + ' energy from ' + creep.carryCapacity);
                balanceOut(creep);
            }
            
            if(creep.carry.energy == 0) {
                    //console.log('balancer is EMPTY and will be put in FILL state');
                fillUp(creep);
            }
        } else if(creep.carry.energy == 0) {
            var stor = Game.getObjectById(storageID);
            
            if(stor.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(stor);
            }
            
            console.log('balancer ' + creep.name + ' get energy from the storage!');
          
        } else {
              // IDLE!
              console.log('balancer ' + creep.name + 'goes IDLE');
        } // -- end statemachine

	} // end of run: function(creep) {..}
	
}; // end of roleBalancer


//################# helping functions
//get the lowest container and fills it up
function fillUp(creep) {
    var highest = getHighestContainer();

       if(highest.transfer(creep, RESOURCE_ENERGY, creep.carryCapacity) == ERR_NOT_IN_RANGE) {
            creep.moveTo(highest);
        } 
        if(creep.carry.energy == creep.carryCapacity) {
            return;
        }
}
// get the fullest container and gets energy out
function balanceOut(creep) {
    var lowest = getLowestContainer();
    if(creep.transfer(lowest, RESOURCE_ENERGY, creep.carry.energy) == ERR_NOT_IN_RANGE ) {
        creep.moveTo(lowest);
    } 
    if(creep.carry.energy == 0) {
        return;
    }
}
// returns container < minFill%
function getLowestContainer(creep) {
    var before=2000;
    var result;
     for(var i = 0; i < containerIDs.length; i++) {
         var  container = (Game.getObjectById(containerIDs[i]));
          if(container.store[RESOURCE_ENERGY] < before) { //GEÄNDERT UM NUR ENERGY ZU BEKOMMEN
            before = container.store.energy;
            result = container;
          }
        } 
    return result;
}

// returns cotainer > maxFill%
function getHighestContainer(creep) {
    var result;
    var before=0;
     for(var i = 0; i < containerIDs.length; i++) {
          var container = Game.getObjectById(containerIDs[i]);
          if(container.store[RESOURCE_ENERGY] > before) { //GEÄNDERT UM NUR ENERGY ZU BEKOMMEN
            before = container.store.energy;
            result = container;
          }
        } 
    return result;
}

module.exports = roleMetaBalancer;