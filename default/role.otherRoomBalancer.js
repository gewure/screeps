var containerIDs = ['57796949720916567dc376ca', '5779cfd7986f591c34eadf9a', '577acd04d33b4b4d0f4bf616' , '5779b1268eef705e48c33a6e' , '5782574e6405edfc66d18381']; // '577af4e8502328d4276d1a7d'
var storageID = '5785398b91941a441c38dd7e'; //TODO
var towerIDs = [];//['578165832b0f16cb03ea73e4', '578165832b0f16cb03ea73e4']; //TODO not yet used
var linkID = '57881083f65bca74406e1b09';

/* 
    Balancer - balances the containers
    more than 2 might cause problems, but if there is a steady flow of energy in one direction, it may work with adjustments
*/

// balancing - how much tolerance in %?
var balance = 80;// the lower the more refilling
var minContainerCont = 500;
var minContDifference = 0;
var minStorageVal = 300000; // TODO
//######################################## job is to keep the containers filled
var roleBalancer = {
    
    run: function(creep, contIDs, contStorIDs, towIDs) {
        containerIDs = contIDs;
        containerIDsWStorage = contStorIDs;
        towerIDs = towIDs;
    
        var lowestC = getLowestContainer();
        var highestC = getHighestContainer();
        var stor = Game.getObjectById(storageID);
        var link = Game.getObjectById(linkID);
            
        creep.memory.lowestC=lowestC;
        creep.memory.highestC=highestC;
         
         //###################################### death logic
	    if(creep.ticksToLive <= 35) {
    	     var targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_CONTAINER
                        || structure.structureType == STRUCTURE_SPAWN
                        || structure.structureType == STRUCTURE_EXTENSION
                        || structure.structureType == STRUCTURE_STORAGE 
                        || structure.structureType == STRUCTURE_TOWER) && (_.sum(structure.energy) < _.sum(structure.energyCapacity)+creep.carry.energy));
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
        if ((lowestC.store[RESOURCE_ENERGY] <  highestC.store[RESOURCE_ENERGY]-highestC.store[RESOURCE_ENERGY] *(balance/100)) && (highestC.store[RESOURCE_ENERGY] > minContainerCont *(balance/100)) && lowestC.store[RESOURCE_ENERGY] < highestC.store[RESOURCE_ENERGY]-minContDifference) { 
            console.log('balancer in balance mode!');
            
            if(creep.carry[RESOURCE_UTRIUM]> 0) {
                console.log('YES i have utrium');
                var stor = Game.getObjectById('5785398b91941a441c38dd7e');
                 if(!creep.pos.isNearTo(stor)) {
                        creep.moveTo(stor);
                    } else { // is near storage, transfer _all_ resources
                        Object.keys(creep.carry).map((resource) => { creep.transfer(stor, resource) });
                        console.log('Collector transfered _all_ resources to storage');
                    }
            }
            
            if(creep.carry.energy == creep.carryCapacity) {
                        console.log('balancer is FULL and will be put in BALANCE state');
                       // console.log(creep.carry.energy + ' energy from ' + creep.carryCapacity);
                balanceOut(creep, 'container');
            }
            
            if(creep.carry.energy == 0 || creep.carry.energy <=0.2 *creep.carryCapacity) {
                    //console.log('balancer is EMPTY and will be put in FILL state');
                fillUp(creep, 'container');
            }
            
            // fill link from container
        } else if(creep.carry.energy == 0) {
            
            if(creep.carry[RESOURCE_UTRIUM]> 0) { // get rid of utrium!
                console.log('YES i have utrium');
                var stor = Game.getObjectById('5785398b91941a441c38dd7e');
                 if(!creep.pos.isNearTo(stor)) {
                        creep.moveTo(stor);
                    } else { // is near storage, transfer _all_ resources
                        Object.keys(creep.carry).map((resource) => { creep.transfer(stor, resource) });
                        console.log('Collector transfered _all_ resources to storage');
                    }
            }
            //console.log('DDDDDDDDDDDDDDDDDDDDDDDDDDDD');
            console.log('link energy room 2: '+ Game.rooms.E31N1.terminal.store[RESOURCE_ENERGY] + ' / ' + Game.rooms.E31N1.terminal.storeCapacity);
            console.log('storage amount : ' + stor.store[RESOURCE_ENERGY]);
            
            if(stor.store[RESOURCE_ENERGY] > minStorageVal*(1+Math.random()*0.1)) {
                console.log('storage amount : ' + stor.store[RESOURCE_ENERGY]);
                //console.log(' ' +link.energy + ' ' + link.energyCapacity);
                // bring energy from link  to storage
                if(creep.carry.energy < creep.carryCapacity) {
                    if(creep.withdraw(stor, RESOURCE_ENERGY, creep.carryCapacity - _.sum(creep.carry)) == ERR_NOT_IN_RANGE ){
                        creep.moveTo(stor);
                    }
                }
                if(creep.carry.energy == creep.carryCapacity && link.energy > 500) {
                    if(creep.transfer(stor, RESOURCE_ENERGY, creep.carry.energy) == ERR_NOT_IN_RANGE ) {
                        creep.moveTo(stor);
                    } 
                }
            } else {
                 if(creep.carry.energy == creep.carryCapacity) {
                    if(creep.transfer(Game.rooms.E31N1.terminal, RESOURCE_ENERGY, creep.carry.energy) == ERR_NOT_IN_RANGE ) {
                        creep.moveTo(Game.rooms.E31N1.terminal);
                    } 
                }
            //console.log('balancer ' + creep.name + ' fills energy ');
               // fillUp(creep, 'container');
               // balanceOut(creep, 'container');
               var minContainer = Game.getObjectById('57886bfa2e7e32dd33dd5a19');
               var link = Game.getObjectById(linkID);
               if(minContainer.store[RESOURCE_UTRIUM] > 300) {
                   console.log('BALANCER WILL GET THE UTRIUM!');
                  if(creep.withdraw(minContainer, RESOURCE_UTRIUM, creep.carryCapacity) == ERR_NOT_IN_RANGE) {
                      creep.moveTo(minContainer);
                  } 
                  if(_.sum(creep.carry) == creep.carryCapacity) {
                      if(creep.transfer(stor, RESOURCE_UTRIUM, creep.carry.RESOURCE_UTRIUM) == ERR_NOT_IN_RANGE) {
                          creep.moveTo(stor);
                      }  
                  }
               } else if(link.energy >350) {
                    if(creep.withdraw(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                          creep.moveTo(link);
                      }  
                      creep.say(Math.ceil(stor.store[RESOURCE_ENERGY]/1000)+'k');
                    if(creep.carry.energy == creep.carryCapacity) {
                        if(creep.transfer(stor, RESOURCE_ENERGY, creep.carry.RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                          creep.moveTo(stor);
                      }  
                    }
               }

            }
            
            
        } else {
              // IDLE!
              //console.log('balancer ' + creep.name + 'goes IDLE');
             console.log('storage amount : ' + stor.store[RESOURCE_ENERGY]+ ' IDLE');

               if(creep.carry.energy == creep.carryCapacity) {
                   if(link.energy > 500 && stor.store[RESOURCE_ENERGY] > minStorageVal) {
                    if(creep.transfer(Game.rooms.E31N1.terminal, RESOURCE_ENERGY, creep.carry.energy) == ERR_NOT_IN_RANGE ) {
                        creep.moveTo(Game.rooms.E31N1.terminal);
                    } 
                   } else {
                        if(creep.transfer(stor, RESOURCE_ENERGY, creep.carry.energy) == ERR_NOT_IN_RANGE ) {
                        creep.moveTo(stor);
                    } 
                   }
                }
        } // -- end statemachine

	} // end of run: function(creep) {..}
	
}; // end of roleBalancer


//################# helping functions
//get the lowest container and fills it up
function fillUp(creep, towerOrContainer) {
    //var highest = undefined;
    
     if(towerOrContainer=='container') {
         var highest = getHighestContainer();
          
        if(highest.transfer(creep, RESOURCE_ENERGY, creep.carryCapacity) == ERR_NOT_IN_RANGE) {
        creep.moveTo(highest);
        } 
        if(creep.carry.energy == creep.carryCapacity) {
            return;
        }
              
          
    } else if(towerOrContainer=='tower') {
        var highest = getHighestTower();
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
function balanceOut(creep, towerOrContainer) {
    
    if(towerOrContainer=='container') {
         var lowest = getLowestContainer();
    } else if(towerOrContainer=='tower') {
        var lowest = getLowestTower();
    }
   
   if(_.sum(lowest.store) <= lowest.storeCapacity*0.90) {
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
   } else {
       var stor = Game.getObjectById(storageID);
       if(creep.transfer(stor, RESOURCE_ENERGY, creep.carry.energy) == ERR_NOT_IN_RANGE ) {
            creep.moveTo(stor);
       }
   }
    if(creep.carry.energy == 0) {
        return;
    }
}
function getLowestContainer(creep) {
    var before=2000;
    var result;
     for(var i = 0; i < containerIDs.length; i++) {
         var  container = (Game.getObjectById(containerIDs[i]));
          if(container.store[RESOURCE_ENERGY] <= before || _.sum(container.store) != container.storeCapacity) { //GEÄNDERT UM NUR ENERGY ZU BEKOMMEN
            before = container.store.energy;
            result = container;
          } 
     }  
    if(_.sum(result.store) == result.storeCapacity) {
        result = Game.getObjectById(storageID);
        return result;
    } else {
        return result;
    }
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
     for(var i = 0; i < containerIDs.length; i++) {
          var container = Game.getObjectById(containerIDs[i]);
          if(container.store[RESOURCE_ENERGY] >= before) { //GEÄNDERT UM NUR ENERGY ZU BEKOMMEN
            before = container.store.energy;
            result = container;
          }
        } 
    return result;
}

module.exports = roleBalancer;