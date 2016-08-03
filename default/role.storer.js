var containerIDs = ['57796949720916567dc376ca', '5779cfd7986f591c34eadf9a', '577acd04d33b4b4d0f4bf616' , '5779b1268eef705e48c33a6e' ]; // '577af4e8502328d4276d1a7d'
var storageID = '577b2f88e03b2946707baba5'; //TODO
var towerIDs = ['5779f6286ce428014acf2e71', '577ecaedd47f7a6d1f04ec04']; //TODO not yet used
var labIDs = [];
var termID = '';

//var idlePosX = 35;
//var idlePosY = 31;
//var minEnergyLimit = 200; 
//var minStorageLimit = 1000;  


/* 
    Balancer - balances the containers
    more than 2 might cause problems, but if there is a steady flow of energy in one direction, it may work with adjustments
*/


// balancing - how much tolerance in %?
var balance = 37.34;// the lower the more refilling
var minContainerCont = 100;
var storageFullAmount = 900000;
var minMineralInContainer = 0;
var minMineralInTerminal = 1000;
//######################################## job is to keep the containers filled
var roleStorer = {
    
    //roleStorer.run(creep,mineralContainerIDs, contStorIDs, labIDs_LO, upgrLinkID, terminalID);
    run: function(creep, contIDs, contStorIDs, labIDs_LO, labrLinkID, terminalID) {
        containerIDs = contIDs;
        containerIDsWStorage = contStorIDs;
        labIDs = labIDs_LO;
        labLinkID = labrLinkID;
        termID = terminalID;
    
        var lowestC = getLowestContainer();
        var highestC = getHighestContainer();
        
        var terminal = Game.getObjectById(termID);
        var linkToFill = Game.getObjectById('577f2b75f5dd02623e306006'); // TODO GENERIFY
        creep.memory.lowestC=lowestC;
        creep.memory.highestC=highestC;
        
        //console.log(highestC +'highest container has ' + highestC.store.energy + ' at ' + highestC.pos);
        //console.log(lowestC+ 'lowest container has ' + lowestC.store.energy + ' at ' + lowestC.pos);
        //console.log(creep.carry.energy + ' energy from ' + creep.carryCapacity);
         
         //###################################### death logic
	    if(creep.ticksToLive <= 35) {
    	    
	    } // -- end death logic
	    
	     var stor = Game.getObjectById('577b2f88e03b2946707baba5'); //storage
	     var target = stor;
        //################ statemachine, cheap version
       // determine if the containers have minerals in them
     
       //console.log(_.sum(mineralContainer.store)-mineralContainer.store[RESOURCE_ENERGY]);
       
       
         
         //TODO
        /*for(var i = 0; i <labIDs.length; i++) { //fill all labs with energy
            var lab = Game.getObjectById(labIDs[i]);
            if(lab.energy + creep.carryCapacity < lab.energyCapacity) {
                console.log('lab has ' + lab.energy + ' from ' + lab.energyCapacity);
                if(creep.carry.energy == 0) {
                    fillLabFromContainer(creep, RESOURCE_ENERGY, lab, labLinkID); // fill lab with energy from link!
                    i++;
                }
            }
        } */
         
	    if( creep.ticksToLive > 0) {
	       
                 var lab = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_LAB) && (structure.energy < structure.energyCapacity));
                    }
                 });
                
  
                if(lab) { // fill labs with energy
	                creep.say('lab++');

                    if(lab.energy < lab.energyCapacity && creep.carry.energy == 0 ) { // if it doesnt have energy
                           // console.log('ahoy, storer wants to fill a Lab with energy');
                        if(creep.transfer(lab, RESOURCE_ENERGY)== ERR_NOT_IN_RANGE) {
                            creep.moveTo(lab);
                        } 
                        if(creep.carry.energy == 0) {
                           var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (structure) => {
                                    return ((structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_TERMINAL ) && (structure.store[RESOURCE_ENERGY] > structure.storeCapacity*0.5));
                                }
                            });
                             if(container)
                            if(_.sum(container.store) + _.sum(creep.carry) < container.storeCapacity) {
                                if(creep.withdraw(container, RESOURCE_ENERGY) ==ERR_NOT_IN_RANGE) {
                                    creep.moveTo(container);
                                }
                            }
                        }
                    } else {
                        //creep.say('else');
                        if(creep.withdraw(stor, RESOURCE_ENERGY, creep.carryCapacity)==ERR_NOT_IN_RANGE) {
                            creep.moveTo(stor);
                        }
                        if(creep.carry.energy == creep.carryCapacity)
                        if(creep.transfer(lab, RESOURCE_ENERGY, creep.carry.energy)== ERR_NOT_IN_RANGE) {
                            creep.moveTo(lab);
                        } 
                    }
                  
                    } else { // fill corresponding labs with corresponding minerals
                        //creep.say('mins');
                        if(creep.carry.energy > 0) {
                             var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (structure) => {
                                    return ((structure.structureType == STRUCTURE_CONTAINER) && (structure.store[RESOURCE_ENERGY] < structure.storeCapacity));
                                }
                            });
                            if(container)
                            if(_.sum(container.store) + _.sum(creep.carry) < container.storeCapacity) {
                                if(creep.transfer(container, RESOURCE_ENERGY) ==ERR_NOT_IN_RANGE) {
                                    creep.moveTo(container);
                                }
                            }
                        }
                        
                        var lab = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                            filter: (structure) => {
                                return ((structure.structureType == STRUCTURE_LAB) && (structure.mineralAmount < structure.mineralCapacity*0.9) && structure.id!=labIDs[2]);
                            }
                         });
                    
                        //var resO = findMineralContainer(creep, RESOURCE_OXYGEN);
                        //creep.say(resO.amount);
                        //var resL = findMineralContainer(creep, RESOURCE_LEMERGIUM);
                        if(!lab) {
                            lab = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                            filter: (structure) => {
                                return ((structure.structureType == STRUCTURE_LAB) && (structure.mineralAmount < structure.mineralCapacity*0.9) && structure.id!=labIDs[2]);
                            }
                         });
                        } 
                        if(lab.id == labIDs_LO[2]) { //reaction lab
                            creep.say('reactLab');

                           if(lab.mineralAmount > 1500) {
                               if(_.sum(creep.carry) < creep.carryCapacity)
                                if(creep.withdraw(lab, RESOURCE_LEMERGIUM_OXIDE)==ERR_NOT_IN_RANGE) {
                                        creep.moveTo(lab);
                                }
                                if(_.sum(creep.carry) == creep.carryCapacity) {
                                        if(creep.transfer(terminal, RESOURCE_LEMERGIUM_OXIDE)==ERR_NOT_IN_RANGE) {
                                            creep.moveTo(terminal);
                                         }
                                    }
                           }
                         lab = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                            filter: (structure) => {
                                return ((structure.structureType == STRUCTURE_LAB) && (structure.mineralAmount < structure.mineralCapacity && structure.id!=labIDs_LO[2])); // new lab is not this! important!
                            }
                         });
                         
                        }
                        
                        if(lab.id == labIDs_LO[1]) { //lemergium
                        creep.say('L lab');
                        
                           if(creep.carry.O > 0) {
                                if(creep.transfer(Game.getObjectById(labIDs_LO[0]), RESOURCE_OXYGEN)==ERR_NOT_IN_RANGE) {
                                    creep.moveTo(Game.getObjectById(labIDs_LO[0]));
                                }
                            }
                            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                                filter: (structure) => {
                                        return ((structure.structureType == STRUCTURE_TERMINAL || structure.structureType == STRUCTURE_STORAGE ||structure.structureType== STRUCTURE_CONTAINER) && (structure.store[RESOURCE_LEMERGIUM] >= creep.carryCapacity));
                                    }
                            });

                            if(lab.mineralAmount < lab.mineralCapacity) { // i it doesnt have minerals
                              if(lab.mineralType==RESOURCE_LEMERGIUM || lab.mineralAmount == 0) {
                                    if(creep.withdraw(target, RESOURCE_LEMERGIUM)==ERR_NOT_IN_RANGE) {
                                        creep.moveTo(target);
                                    }
                                    if(_.sum(creep.carry) == creep.carryCapacity) {
                                        if(creep.transfer(lab, RESOURCE_LEMERGIUM)==ERR_NOT_IN_RANGE) {
                                            creep.moveTo(lab);
                                         }
                                    }
                                } else if(lab.mineralType==RESOURCE_OXYGEN) { //TODO
                                     if(creep.withdraw(lab, RESOURCE_OXYGEN)==ERR_NOT_IN_RANGE) {
                                        creep.moveTo(lab);
                                    }
                                    if(_.sum(creep.carry) == creep.carryCapacity) {
                                        if(creep.transfer(terminal, RESOURCE_OXYGEN)==ERR_NOT_IN_RANGE) {
                                            creep.moveTo(terminal);
                                         }
                                    }
                                } else {
                                     if(creep.withdraw(target, RESOURCE_LEMERGIUM)==ERR_NOT_IN_RANGE) {
                                        creep.moveTo(target);
                                    }
                                    if(_.sum(creep.carry) == creep.carryCapacity) {
                                        if(creep.transfer(lab, RESOURCE_LEMERGIUM)==ERR_NOT_IN_RANGE) {
                                            creep.moveTo(lab);
                                         }
                                    }
                                }
                            } 
                            
                        }
                        
                        if(lab.id == labIDs_LO[0]) { // oxygen
                           creep.say('O lab');
                            if(creep.carry.L > 0) {
                                if(creep.transfer(Game.getObjectById(labIDs_LO[1]), RESOURCE_LEMERGIUM)==ERR_NOT_IN_RANGE) {
                                    creep.moveTo(Game.getObjectById(labIDs_LO[1]));
                                }
                            }
                            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                                filter: (structure) => {
                                        return ((structure.structureType == STRUCTURE_TERMINAL || structure.structureType == STRUCTURE_STORAGE ||structure.structureType== STRUCTURE_CONTAINER) && (structure.store[RESOURCE_OXYGEN] >= creep.carryCapacity));
                                    }
                            });
                                            
                            if(lab.mineralAmount <= lab.mineralCapacity *0.5) {
                                if(lab.mineralAmount == 0 || lab.mineralType==RESOURCE_OXYGEN) {
                                    
                                    //creep.say('oxygen!');
                                    
                                    if(target) { //if a container with O
                                        //creep.say('minCon: O');
                                        if(creep.withdraw(target, RESOURCE_OXYGEN, creep.carryCapacity)==ERR_NOT_IN_RANGE) {
                                            creep.moveTo(target);
                                        }
                                        if(creep.carry.O > 0) {
                                                if(creep.transfer(lab, RESOURCE_OXYGEN, creep.carryCapacity)==ERR_NOT_IN_RANGE) {
                                                    creep.moveTo(lab);
                                                }
                                            } else {
                                                if( Object.keys(creep.carry).map((resource) => { creep.transfer(stor, resource)== ERR_NOT_IN_RANGE}) ) {
                                                   creep.moveTo(stor, {reusePath:3});
                                                }
                                            }
                                    } else { // get it from terminal
                                            //creep.say('O somewhere?');
                                           
                                        if(creep.withdraw(target, RESOURCE_OXYGEN, creep.carryCapacity)==ERR_NOT_IN_RANGE) {
                                            creep.moveTo(target);
                                        }
                                        if(_.sum(creep.carry) == creep.carryCapacity) {
                                            if(creep.carry.O > 0) {
                                                if(creep.transfer(lab, RESOURCE_OXYGEN, creep.carryCapacity)==ERR_NOT_IN_RANGE) {
                                                    creep.moveTo(lab);
                                                }
                                            } else {
                                                if( Object.keys(creep.carry).map((resource) => { creep.transfer(stor, resource)== ERR_NOT_IN_RANGE}) ) {
                                                   creep.moveTo(stor, {reusePath:3});
                                                }
                                            }
                                        }
                                    }
                                } else { // lab has Lemergium, not good..
                                    creep.say(':(');
                                    //creep.say(_.sum(creep.carry));
                                    //creep.say(lab.id);
                                    if(_.sum(creep.carry) == 0) {
                                    //var ret = creep.withdraw(lab, RESOURCE_LEMERGIUM);
                                    //creep.say(ret);
                                        if(creep.withdraw(lab, RESOURCE_LEMERGIUM)==ERR_NOT_IN_RANGE) {
                                            creep.moveTo(lab);
                                        }
                                    } else {
                                        if(creep.transfer(terminal, RESOURCE_LEMERGIUM)==ERR_NOT_IN_RANGE) {
                                            creep.moveTo(terminal);
                                        }
                                    }
                                    
                                }
                                //fillLabFromContainer(creep, RESOURCE_OXYGEN, lab, container);
                            } 
                          
                        } else { 
                            creep.say('new labs?!');
                            
                            
                            
                            // deliver to storage
                            //if( Object.keys(creep.carry).map((resource) => { creep.transfer(target, resource)== ERR_NOT_IN_RANGE}) ) {
                            //    creep.moveTo(target, {reusePath:3});
                            }
                      
                    }
               }
               
	  else if (false && (stor.store[RESOURCE_LEMERGIUM] >= 5000 )&& (_.sum(terminal.store) <terminal.storeCapacity)) { // fill terminal wit lemergium
	               creep.say('L -> stor');
	             if(_.sum(creep.carry) < creep.carryCapacity ) {
	                  
    	                if(creep.withdraw(stor,RESOURCE_LEMERGIUM, creep.carryCapacity) == ERR_NOT_IN_RANGE) {
        	                creep.moveTo(stor, {reusePath:3});
        	            }
	                }  if(creep.carry.L == creep.carryCapacity) {
	                  
	                    if(creep.transfer(terminal,RESOURCE_LEMERGIUM, creep.carryCapacity) == ERR_NOT_IN_RANGE) {
        	                creep.moveTo(terminal, {reusePath:3});
        	            }
	                }
	            
	        
	    } else if(false) {  // fill the link
	       // console.log(linkToFill);
            creep.say('link++');
            //reep.say(_.sum(creep.carry));
	        if(_.sum(creep.carry) > 0 && creep.carry.energy < _.sum(creep.carry)){ // ..or creep has minerals -> empty them
	            
	            creep.say('--');
	            //Object.keys(creep.carry).map((resource) => { creep.transfer(target, resource) });
                //(target, RESOURCE_LEMERGIUM, _.sum(creep.carry))==ERR_NOT_IN_RANGE) ||
    	        if( Object.keys(creep.carry).map((resource) => { creep.transfer(target, resource)== ERR_NOT_IN_RANGE}) ) {
                        creep.moveTo(target, {reusePath:3});
                }
	        } else { // go fill the link with energy
	            
	            if(creep.carry.energy < creep.carryCapacity && linkToFill.energy < 550) {
	               //var ret = creep.withdraw(target,RESOURCE_ENERGY, 100);
	              //creep.say(ret);
	              //creep.moveTo(target, {reusePath:2});
    	            if( creep.withdraw(target,RESOURCE_ENERGY, 100)==ERR_NOT_IN_RANGE) {
    	               creep.moveTo(target);
    	               
    	            } else {
    	                if(creep.transfer(linkToFill, RESOURCE_ENERGY, creep.carry.energy)==ERR_NOT_IN_RANGE) {
	                        creep.moveTo(linkToFill, {reusePath:3});
	                    }
    	            }
    	            // creep.say(creep.carry.energy);
	            } else if(creep.carry.energy == creep.carryCapacity && linkToFill.energy+creep.carry.energy <= 800) {

	                if(creep.transfer(linkToFill, RESOURCE_ENERGY, creep.carry.energy)==ERR_NOT_IN_RANGE) {
	                    creep.moveTo(linkToFill, {reusePath:3});
	                }
	            }
	            // TODO this doesnt work here
	            var terminal = Game.getObjectById(termID);
	            //console.log('terminal: ' +terminal.store[RESOURCE_ENERGY]);
	            if( (stor.store[RESOURCE_ENERGY] > storageFullAmount) && (terminal.store[RESOURCE_ENERGY] < terminal.storeCapacity) ) { // if the storage is full -> put into terminal
	                console.log('storage is over 200000');
	                if(creep.carry.energy < creep.carryCapacity ) {
    	                if(creep.withdraw(stor,RESOURCE_ENERGY, creep.carryCapacity) == ERR_NOT_IN_RANGE) {
        	                creep.moveTo(stor, {reusePath:3});
        	            }
	                } else {
	                    if(creep.transfer(terminal,RESOURCE_ENERGY, creep.carryCapacity) == ERR_NOT_IN_RANGE) {
        	                creep.moveTo(terminal, {reusePath:3});
        	            }
	                }
	            }
	        }
	    }
            
	} // end of run: function(creep) {..}
	
}; // end of roleBalancer
// get minerals from container
function fillLabFromContainer(creep, resourceType, targetLab, mineralContainer) {
    var stor = creep.room.storage; //storage
    //console.log('XDSSSSSSSSSSSSSSSSSSS' + resourceType + 'FSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS');
     if(creep.carry[resourceType] > 0) { // deliver resource to lab or storage
            creep.say('deliver');
            if(creep.transfer(targetLab, resourceType, creep.carry[resourceType])==ERR_NOT_IN_RANGE){
            //if(Object.keys(creep.carry).map((resource) => { creep.transfer(target, resource)== ERR_NOT_IN_RANGE}) ) {
                creep.moveTo(targetLab);
            }
    } else { //find resources
        /*if(_.sum(creep.carry) > 0) {
             if( Object.keys(creep.carry).map((resource) => { creep.transfer(stor, resource)== ERR_NOT_IN_RANGE}) ) {
                        creep.moveTo(stor, {reusePath:3});
                }
        }*/
        if(mineralContainer.structureType==STRUCTURE_CONTAINER) { // its a container
        creep.say('fill');
            console.log('its a container @ storer');
            if(mineralContainer.store[resourceType] > 0) {
                    creep.say('filLabF');
                    //creep.say(resourceType);
                    //creep.say('')
                if(creep.withdraw(mineralContainer, resourceType, creep.carryCapacity-_.sum(creep.carry))==ERR_NOT_IN_RANGE){
                    creep.moveTo(mineralContainer, {reusePath:3});
                    creep.say('bla');
                }
            }
        } else {  // 
            if(creep.withdraw(mineralContainer, RESOURCE_ENERGY, creep.carryCapacity-_.sum(creep.carry))==ERR_NOT_IN_RANGE){
                    creep.moveTo(mineralContainer, {reusePath:3});
                }
        }
    }

}

//################# helping functions
//find container containing a mineral, not just energy
function findMineralContainer(creep, resourceType){
    var terminal = creep.room.terminal;
        //creep.say('minCon: '+resourceType);
    //console.log(resourceType);
    for(var i = 0; i < containerIDs.length; i++){
        
    	        container = Game.getObjectById(containerIDs[i]);
    	        //creep.say(terminal);
    	        if(_.sum(container.store) > container.store.energy || terminal.store[resourceType] > minMineralInTerminal + creep.carryCapacity) { // container has some mineral in it
    	        //creep.say('minCon');
    	               if(container.store[resourceType] > 0) {// first try from container - else from terminal
    	                //creep.say('oi');
    	                return container;
    	               }
    	               if(terminal.store[resourceType]> 0) {  // then  from termial
    	                   return terminal;
    	               }
    	        } else {
    	            return;//containerHoldsMineral = false;
    	        }
    } return Game.getObjectById(termID);
}


//get the lowest container and fills it up
function fillUp(creep, towerOrContainer) {
    //var highest = undefined;
    
     if(towerOrContainer=='container') {
         var highest = getHighestContainer();
          
        if(highest.transfer(creep, RESOURCES_ALL, creep.carryCapacity) == ERR_NOT_IN_RANGE) {
        creep.moveTo(highest, {reusePath:3});
        } 
        if(creep.carry.energy == creep.carryCapacity) {
            return;
        }
              
          
    } else if(towerOrContainer=='tower') {
        var highest = getHighestTower();
        console.log('highest tower: '+highest);
         
        if(highest.transferEnergy(creep, creep.carryCapacity) == ERR_NOT_IN_RANGE) {
        creep.moveTo(highest, {reusePath:3});
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
   
    if(creep.transfer(lowest, RESOURCES_ALL, creep.carry.energy) == ERR_NOT_IN_RANGE ) {
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
     for(var i = 0; i < containerIDs.length; i++) {
         var  container = (Game.getObjectById(containerIDs[i]));
          if(container.store[RESOURCES_ALL] <= before) { //GEÄNDERT UM NUR ENERGY ZU BEKOMMEN
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
     for(var i = 0; i < containerIDs.length; i++) {
          var container = Game.getObjectById(containerIDs[i]);
          if(container.store[RESOURCES_ALL] >= before) { //GEÄNDERT UM NUR ENERGY ZU BEKOMMEN
            before = container.store.energy;
            result = container;
          }
        } 
    return result;
}

module.exports = roleStorer;