var containerIDs = ['57796949720916567dc376ca', '5779cfd7986f591c34eadf9a', '577acd04d33b4b4d0f4bf616' , '5779b1268eef705e48c33a6e' ]; // '577af4e8502328d4276d1a7d'
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
var balance = 37.34;// the lower the more refilling
var minContainerCont = 100;
//######################################## job is to keep the containers filled
var roleOtherRoomStorer = {
    
    run: function(creep, contIDs, contStorIDs, towIDs) {
        containerIDs = contIDs;
        containerIDsWStorage = contStorIDs;
        towerIDs = towIDs;
    
        var lowestC = getLowestContainer();
        var highestC = getHighestContainer();
        var linkToFill = Game.getObjectById('57881083f65bca74406e1b09'); // TODO GENERIFY
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
	    
	     var target = Game.getObjectById('577b2f88e03b2946707baba5'); //storage
        //################ statemachine, cheap version
       // determine if the containers have minerals in them
       
	    if(findMineralContainer(creep) != null) {
	        console.log('lalalal');
            var container = findMineralContainer(creep);
	        console.log(container);

           
    	   /* var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => { (structure.structureType == STRUCTURE_STORAGE ) && (_.sum(structure.store) < _.sum(structure.storeCapacity) + _.sum(creep.carry));}
            }); */
            
           // console.log(target);
            //creep.moveTo(container);
            // get from container
           
            
            if(_.sum(creep.carry) > 0) { // deliver to stroage
                creep.moveTo(target);
                if(creep.transfer(target, RESOURCE_UTRIUM, _.sum(creep.carry))==ERR_NOT_IN_RANGE){
                    creep.moveTo(target);
                }
            } else {
                creep.moveTo(container);
                if(container.transfer(creep, RESOURCE_UTRIUM, creep.carryCapacity-_.sum(creep.carry))==ERR_NOT_IN_RANGE){
                    creep.moveTo(container);
                }
            }
        
	    } else {
	        console.log(linkToFill);

	        console.log('didnt return a mineralcontaining container');
	        if(_.sum(creep.carry.L) > 0){

    	        if(creep.transfer(target, RESOURCE_UTRIUM, _.sum(creep.carry))==ERR_NOT_IN_RANGE){
                        creep.moveTo(target);
                }
	        } else { // go fill the link with energy
	            console.log('fill the storage from the link');
	            if(creep.carry.energy< creep.carryCapacity) {
    	            if(linkToFill.transferEnergy(creep,RESOURCE_ENERGY, creep.carryCapacity) == ERR_NOT_IN_RANGE) {
    	                creep.moveTo(linkToFill);
    	            }
	            } else if(creep.carry.energy == creep.carryCapacity) {
	                	            	    

	              
	                if(creep.transfer(target, RESOURCE_ENERGY, creep.carry.energy)==ERR_NOT_IN_RANGE) {
	                    creep.moveTo(target);
	                }
	            }
	        }
	    }
            
	} // end of run: function(creep) {..}
	
}; // end of roleBalancer


//################# helping functions
//find container containing a mineral, not just energy
function findMineralContainer(creep){

    for(var i = 0; i < containerIDs.length; i++){
        
    	        container = Game.getObjectById(containerIDs[i]);
    	        
    	        if(_.sum(container.store) > container.store.energy) { // container has some mineral in it
    	               //containerHoldsMineral = true;
    	               return container;
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

module.exports = roleOtherRoomStorer;