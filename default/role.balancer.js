var containerIDs = ['57796949720916567dc376ca', '5779cfd7986f591c34eadf9a', '577acd04d33b4b4d0f4bf616' , '5779b1268eef705e48c33a6e' ]; // '577af4e8502328d4276d1a7d' mincon: 5789f4ef237741a55ba23e42
var storageID = '577b2f88e03b2946707baba5'; //TODO
var towerIDs = ['5779f6286ce428014acf2e71', '577ecaedd47f7a6d1f04ec04']; //TODO not yet used


//var idlePosX = 35;
//var idlePosY = 31;
//var minEnergyLimit = 200; 
//var minStorageLimit = 1000;  


/* 
    Balancer - balances the containers
    more than 2 might cause problems, but if there is a steady flow of energy in one direction, it may work with adjustments
*/


// balancing - how much tolerance in %?
var balance = 30.34;// the lower the more refilling
var minContainerCont = 400;
var shouldStorageVal = 800;
var minDiff = 400;
//######################################## job is to keep the containers filled
var roleBalancer = {
    
    run: function(creep, contIDs, contStorIDs, towIDs) {
        containerIDs = contIDs;
        containerIDsWStorage = contStorIDs;
        towerIDs = towIDs;
    
        var lowestC = getLowestContainer(creep);
        var highestC = getHighestContainer(creep);
        creep.memory.lowestC=lowestC;
        creep.memory.highestC=highestC;
        
                   var stor = Game.getObjectById(storageID);

        //console.log(highestC +'highest container has ' + highestC.store.energy + ' at ' + highestC.pos);
        //console.log(lowestC+ 'lowest container has ' + lowestC.store.energy + ' at ' + lowestC.pos);
        //console.log(creep.carry.energy + ' energy from ' + creep.carryCapacity);
         
         //###################################### death logic
	    if(creep.ticksToLive <= 35) {
	        creep.say('goodbye',true);
    	     var targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER
                   ) && (structure.store[RESOURCE_ENERGY] < structure.storeCapacity+creep.carry.energy);
                    }
                    });
                    
            if(targets) {
                if(creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets);
                     console.log('creep [balancer] ' + creep.name + ' dies soon and delivered his carry of ' + creep.carry.energy + ' to '+ targets);
                }
                
                if(creep.carry.energy == 0) {
                    console.log('creep suidicdes')
                    creep.suicide();
                }
            }
	    } // -- end death logic
	    
        //################ statemachine, cheap version
        if (lowestC.store[RESOURCE_ENERGY] < highestC.store[RESOURCE_ENERGY]-highestC.store[RESOURCE_ENERGY]*(balance/100) && 
            highestC.store[RESOURCE_ENERGY] > minContainerCont &&
            highestC.store[RESOURCE_ENERGY] -lowestC.store[RESOURCE_ENERGY] > minDiff ) { 
                
            creep.say(lowestC.store[RESOURCE_ENERGY] + '<'+Math.ceil(highestC.store[RESOURCE_ENERGY]/1000)+'k',true);

            //console.log('yess, i should balance out!');
            if(creep.carry.energy == creep.carryCapacity) {
                        //console.log('balancer is FULL and will be put in BALANCE state');
                       // console.log(creep.carry.energy + ' energy from ' + creep.carryCapacity);
                balanceOut(creep, 'container');
            }
            
            if(creep.carry.energy == 0 || creep.carry.energy <=0.2 *creep.carryCapacity) {
                    //console.log('balancer is EMPTY and will be put in FILL state');
                fillUp(creep, 'container');
            }
            
            // fill from container 
        } else if(creep.carry.energy == 0 && lowestC.store[RESOURCE_ENERGY] < 1000) {
            creep.say('strange');

            if(stor.store.energy > creep.carryCapacity) {
                if(stor.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(stor);
                }
           // console.log('balancer ' + creep.name + ' get energy from the storage!');
            
                balanceOut(creep, 'tower');
            } else {// storage has no energy :(
                creep.say('fillupTower()');
                fillUp(creep, 'tower');
                balanceOut(creep, 'tower');
            }
        } else if (highestC.store[RESOURCE_ENERGY] >= highestC.carryCapacity*0.90) {
                        creep.say('highestC.store[RESOURCE_ENERGY] >= highestC.carryCapacity*0.90');

              // TRANSPORT 
              
              //console.log('balancer ' + creep.name + 'transports to link in other room');
              
               console.log('balancer puts stuff into the storage cause containers are damn full ');
	            if(creep.carry.energy< creep.carryCapacity) {
    	            if(lowestC.transfer(creep,RESOURCE_ENERGY, creep.carryCapacity) == ERR_NOT_IN_RANGE) {
    	                creep.moveTo(target);
    	            }
	            } else if(creep.carry.energy == creep.carryCapacity) {

	                if(creep.transfer(stor, RESOURCE_ENERGY, creep.carry.energy)==ERR_NOT_IN_RANGE) {
	                    creep.moveTo(stor);
	                }
	            }
        } else if(creep.carry.energy == 0 &&lowestC.store[RESOURCE_ENERGY] > 1600){
            creep.say('lowestC is > 1600', true);
            if(creep.carry.energy< creep.carryCapacity) {
    	            if(highestC.transfer(creep,RESOURCE_ENERGY, creep.carryCapacity) == ERR_NOT_IN_RANGE) {
    	                creep.moveTo(highestC);
    	            }
	            } else if(creep.carry.energy == creep.carryCapacity) {

	                if(creep.transfer(stor, RESOURCE_ENERGY, creep.carry.energy)==ERR_NOT_IN_RANGE) {
	                    creep.moveTo(stor);
	                }
	            }
        
        } else  {
            creep.say('else');
            if(creep.carry.energy == creep.carryCapacity) {
                
	                if(creep.transfer(stor, RESOURCE_ENERGY, creep.carry.energy)==ERR_NOT_IN_RANGE) {
	                    creep.moveTo(stor);
	                }
             } else if(creep.carry.energy == 0) {
                 if(highestC.transfer(creep,RESOURCE_ENERGY, creep.carryCapacity) == ERR_NOT_IN_RANGE) {
    	                creep.moveTo(highestC);
    	            }
             }
        }// -- end statemachine

	} // end of run: function(creep) {..}
	
}; // end of roleBalancer


//################# helping functions
//get the lowest container and fills it up
function fillUp(creep, towerOrContainer) {
    //var highest = undefined;
    
     if(towerOrContainer=='container') {
         var highest = getHighestContainer(creep);
          
        if(highest.transfer(creep, RESOURCE_ENERGY, creep.carryCapacity) == ERR_NOT_IN_RANGE) {
        creep.moveTo(highest);
        } 
        if(creep.carry.energy == creep.carryCapacity) {
            return;
        }
              
          
    } else if(towerOrContainer=='tower') {
        var highest = getHighestTower(creep);
        console.log('highest tower: '+highest);
         
        if(highest.transferEnergy(creep, creep.carryCapacity) == ERR_NOT_IN_RANGE) {
        creep.moveTo(highest);
        } 
        if(creep.carry.energy == creep.carryCapacity) {
            return;
        }
    }

   
}
// get the fullest container and gets energy out
function balanceOut(creep, towerOrContainer, lowestThing) {
    var lowest = lowestThing;
    if(getLowestContainer(creep).energy > getLowestTower(creep).energy) {
        var lowest = getLowestTower(creep);
    } else {
        var lowest = getLowestContainer(creep);
    }
 
   
    if(creep.transfer(lowest, RESOURCE_ENERGY, creep.carry.energy) == ERR_NOT_IN_RANGE ) {
        creep.moveTo(lowest);
        
        // if creep is NEAR to someone who needs energy (out of profession,  like builder, repairer or upgrader)
        /*var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        for(var i = 0; i < upgraders.length; i++) {
            if(creep.pos.isNearTo(upgraders[i])) {
                creep.transfer(upgraders[i], RESOURCE_ENERGY)
            }
        }  */
    }
    
    if(creep.carry.energy == 0) {
        return;
    }
}
// returns container < minFill%
function getLowestContainer(creep) {
    var before=2000;
    var result;
     for(var i = 0; i < containerIDsWStorage.length; i++) {
         var  container = (Game.getObjectById(containerIDsWStorage[i]));
          if(container.store[RESOURCE_ENERGY] <= before * 0.7 || container.store[RESOURCE_ENERGY] <= before * 1.3 ) { //GEÄNDERT UM NUR ENERGY ZU BEKOMMEN
               if(container.store[RESOURCE_ENERGY] == 0 && _.sum(container.store) != container.storeCapacity && _.sum(container.store)+creep.carry.energy<=container.storeCapacity) {
                   return container;
               }
              
            before = container.store.energy;
            result = container;
          }
        } 
    return result;
}

function getLowestTower(creep) {
    var before=1000;
    var result;
     for(var i = 0; i < towerIDs.length; i++) {
         var  tower = (Game.getObjectById(towerIDs[i]));
          if(tower.energy <= before) { //GEÄNDERT UM NUR ENERGY ZU BEKOMMEN
            before = tower.energy;
            result = tower;
          }
        } 
    return result;
}

//highest tower
// returns cotainer > maxFill%
function getHighestTower(creep) {
    var result;
    var before=0;
     for(var i = 0; i < towerIDs.length; i++) {
          var tower = Game.getObjectById(towerIDs[i]);
          if(tower.energy>= before) { //GEÄNDERT UM NUR ENERGY ZU BEKOMMEN
            before = tower.energy;
            result = tower;
          }
        } 
    return result;
}

// returns cotainer > maxFill%
function getHighestContainer(creep) {
    var result;
    var before=0;
     for(var i = 0; i < containerIDsWStorage.length; i++) {
          var container = Game.getObjectById(containerIDsWStorage[i]);
          if(container.store[RESOURCE_ENERGY] > 120000 && false) { //TODO
               return container; // return the storage as highest container if it has + 100k or so
          } else {
              if(container.store[RESOURCE_ENERGY] >= before && container.storeCapacity == 2000) { //GEÄNDERT UM NUR ENERGY ZU BEKOMMEN
                before = container.store.energy;
                result = container;
              } else {
                  continue;
              }
          }
        } 
    if(result.store[RESOURCE_ENERGY]< shouldStorageVal) {
        return Game.getObjectById(storageID);

    } else {
    return result;
    }
}

module.exports = roleBalancer;