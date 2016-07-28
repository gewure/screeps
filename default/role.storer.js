var containerIDs = ['57796949720916567dc376ca', '5779cfd7986f591c34eadf9a', '577acd04d33b4b4d0f4bf616' , '5779b1268eef705e48c33a6e' ]; // '577af4e8502328d4276d1a7d'
var storageID = '577b2f88e03b2946707baba5'; //TODO
var towerIDs = ['5779f6286ce428014acf2e71', '577ecaedd47f7a6d1f04ec04']; //TODO not yet used
var labIDs = [];
var termID;

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
var minMineralInContainer = 100;
//######################################## job is to keep the containers filled
var roleStorer = {
    
    run: function(creep, contIDs, contStorIDs, towIDs, labIDs_LO, labrLinkID, terminalID) {
        containerIDs = contIDs;
        containerIDsWStorage = contStorIDs;
        towerIDs = towIDs;
        labIDs = labIDs_LO;
        labLinkID = labrLinkID;
        termID = terminalID;
    
        var lowestC = getLowestContainer();
        var highestC = getHighestContainer();
        var linkToFill = Game.getObjectById('577f2b75f5dd02623e306006'); // TODO GENERIFY
        creep.memory.lowestC=lowestC;
        creep.memory.highestC=highestC;
        
        //console.log(highestC +'highest container has ' + highestC.store.energy + ' at ' + highestC.pos);
        //console.log(lowestC+ 'lowest container has ' + lowestC.store.energy + ' at ' + lowestC.pos);
        //console.log(creep.carry.energy + ' energy from ' + creep.carryCapacity);
         
         //###################################### death logic
	    if(creep.ticksToLive <= 35) {
    	     var targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {(structure.structureType == STRUCTURE_STORAGE ) && _.sum(structure.store) < _.sum(structure.storeCapacity) + _.sum(creep.carry);}
            });
                    
            if(targets) {
                if(creep.transfer(targets, RESOURCES_ALL) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets);
                     console.log('creep [balancer] ' + creep.name + ' dies soon and delivered his carry of ' + creep.carry.energy + ' to '+ targets);
                }
                
                if(creep.carry.energy == 0) {
                    console.log('creep suidicdes')
                    creep.suicide();
                }
            }
	    } // -- end death logic
	    
	     var stor = Game.getObjectById('577b2f88e03b2946707baba5'); //storage
	     var target = stor;
        //################ statemachine, cheap version
       // determine if the containers have minerals in them
       var mineralContainer = findMineralContainer(creep, RESOURCE_LEMERGIUM); // TODO loop trhough this if you got oxygen!
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
        
	    if( ((mineralContainer != null) && (_.sum(mineralContainer.store)-mineralContainer.store[RESOURCE_ENERGY] > minMineralInContainer )) && (false) ) {
	        
	        console.log('a container containing minerals!');
            var container = mineralContainer;
            
            for(var i = 0; i <labIDs.length; i++) {
                var lab = Game.getObjectById(labIDs[i]);
                console.log(lab);
                if(i==0) { //reaction lab
                   //
                   console.log('reaction lab');
                   i++;
                }
                
                if(i==1) { //lemergium
                    if(lab.energy < lab.energyCapacity && creep.carry.energy > 0 ) { // if it doesnt have energy
                        console.log('ahoy, storer wants to fill a Lab with energy');
                        fillLabFromContainer(creep, RESOURCE_ENERGY, lab, labLinkID); // fill lab with energy from link!
                    }
                    
                    if(lab.mineralAmount < lab.mineralCapacity ) { // i it doesnt have minerals
                        fillLabFromContainer(creep, RESOURCE_LEMERGIUM, lab, container);
                    } else {
                        target = stor;
                    }
                    i++;
                }
                
                if(i==2) { // oxygen
                    if(lab.mineralAmount < lab.mineralCapacity && creep.carry[RESOURCE_OXYGEN] > 0) {
                        fillLabFromContainer(creep, RESOURCE_OXYGEN, lab, container);
                    } else {
                        target = stor;
                    }
                   i++;
                } else { // deliver to storage
                    if( Object.keys(creep.carry).map((resource) => { creep.transfer(target, resource)== ERR_NOT_IN_RANGE}) ) {
                        creep.moveTo(target, {reusePath:3});
                    }
                }
            }
           // console.log(target);
            //creep.moveTo(container);
            // get from container

        
	    } else {  // fill the link
	        console.log(linkToFill);

	        if((_.sum(creep.carry) > 0 && _.sum(creep.carry) != creep.carryCapacity) || creep.carry.energy != _.sum(creep.carry)){ // ..or creep has minerals -> empty them
	            //Object.keys(creep.carry).map((resource) => { creep.transfer(target, resource) });
                //(target, RESOURCE_LEMERGIUM, _.sum(creep.carry))==ERR_NOT_IN_RANGE) ||
    	        if( Object.keys(creep.carry).map((resource) => { creep.transfer(target, resource)== ERR_NOT_IN_RANGE}) ) {
                        creep.moveTo(target, {reusePath:3});
                }
	        } else { // go fill the link with energy
	            console.log('storer fills upgraders Link');
	            if(creep.carry.energy < creep.carryCapacity && linkToFill.energy < 550) {
	                
    	            if(creep.withdraw(target,RESOURCE_ENERGY, creep.carryCapacity) == ERR_NOT_IN_RANGE) {
    	                creep.moveTo(target, {reusePath:3});
    	            }
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
    var stor = Game.getObjectById('577b2f88e03b2946707baba5'); //storage
    console.log('XXXXXXXXXXXXXXXXXXXXXXX FillLabFromContainer() @ storer');
     if(_.sum(creep.carry[resourceType]) > 0) { // deliver resource to lab or storage
                
            if(creep.transfer(targetLab, resourceType, creep.carry[resourceType])==ERR_NOT_IN_RANGE){
            //if(Object.keys(creep.carry).map((resource) => { creep.transfer(target, resource)== ERR_NOT_IN_RANGE}) ) {
                creep.moveTo(targetLab, {reusePath:3});
            }
    } else { //find resources
        if(_.sum(creep.carry) > 0) {
             if( Object.keys(creep.carry).map((resource) => { creep.transfer(stor, resource)== ERR_NOT_IN_RANGE}) ) {
                        creep.moveTo(stor, {reusePath:3});
                }
        }
        if(mineralContainer.structureType==STRUCTURE_CONTAINER) { // its a container
            console.log('its a container @ storer');
            if(mineralContainer.store[resourceType] > 0) {
                if(mineralContainer.transfer(creep, resourceType, creep.carryCapacity-_.sum(creep.carry))==ERR_NOT_IN_RANGE){
                    creep.moveTo(mineralContainer, {reusePath:3});
                }
            }
        } else {  // its a link
            if(creep.withdraw(mineralContainer, RESOURCE_ENERGY, creep.carryCapacity-_.sum(creep.carry))==ERR_NOT_IN_RANGE){
                    creep.moveTo(mineralContainer, {reusePath:3});
                }
        }
    }

}

//################# helping functions
//find container containing a mineral, not just energy
function findMineralContainer(creep, resourceType){

    for(var i = 0; i < containerIDs.length; i++){
        
    	        container = Game.getObjectById(containerIDs[i]);
    	        
    	        if(_.sum(container.store) > container.store.energy) { // container has some mineral in it
    	               //containerHoldsMineral = true;
    	               if(container.store[resourceType] > 0) {
    	                return container;
    	               }
    	        } else {
    	            return;//containerHoldsMineral = false;
    	        }
    } 
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