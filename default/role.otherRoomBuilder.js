var homeRoom = 'E31N1';
var idlePosX = 25;
var idlePosY = 13;
var minEnergyLimit =1000;
var containerFillFactor = 6;

var reHarvestFactor = 30; //if only 30 %energy are left, the creep will gather again
var reFillFactorEmptySource = 15;
var storageID = '5785398b91941a441c38dd7e';
var containerIDs = ['5785398b91941a441c38dd7e']; //, 577efebce58c81923d18ea3f

// copypaste in here if you don't like a structure. 
var dismantleTargetIDs=[];

var containerFillFactor = 1;

var roleOtherRoomBuilder = {
    /** @param {Creep} creep **/
    run: function(creep, storID, contIDs, disTargIDs) {
        creep.memory.containerIDs=containerIDs;

        storageID = storID;
        containerIDs = contIDs;
        dismantleTargetIDs = disTargIDs
   
        
	   

        if(Math.ceil(Math.random()*10)%2==0) {
            minEnergyLimit = 400 + Math.ceil(Math.random()*20);
        } else {
            minEnergyLimit = 400 - Math.ceil(Math.random()*20);
        }
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
	    }
	   
        
	    //############ STATE machine
        //moveToExeRoom(creep);
  
        preCheckStates(creep);
	    if(creep.memory.building) {
            buildingState(creep);
	    } else if(creep.ticksToLive > 80) {
            sourceState(creep);
	    } 
	    
	    //##############################
	}
};


//########################## HELPING FUNCTIONS

function moveToExeRoom(creep) {
     creep.move(BOTTOM);
    if(!creep.pos.isNearTo(Game.flags['extraResource'])) {
            //console.log(creep.name + '[otherRoomBuilder] im in the wrong room ..');
            creep.moveTo(Game.flags['extraResource']);
            creep.move(BOTTOM);
                        creep.move(BOTTOM);
            creep.move(BOTTOM);

         
    } else {
        return;
    }
}
// to dismantle
function dismantle(creep,targetID) {
    var target = Game.getObjectById(targetID);
    if(target) {
        console.log('builder '+creep.name+' wants to dismantle '+ target);
        if(creep.carry < creep.carryCapacity) {
            if(creep.dismantle(target) ==ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else {
            return;
        }
    } else { 
        console.log('dismantle called, but a target doesn not exist anymore');
        // if the target doesnt exist anymore
        return;
    }
} 

function preCheckStates(creep) {

    if(creep.memory.building == undefined) {
        creep.memory.building = true; //only true to trigger harvest
    }
        
    //if currently in building state and without energy, reset worksite and goto harvest
	if(creep.memory.building && creep.carry.energy == 0) {
        creep.memory.building = false;
        creep.memory.tempWorksite = undefined;
           
    //if currently harvesting and cargo is full, or previously finished a worksite, search a new one
	} else if((!creep.memory.building && creep.carry.energy == creep.carryCapacity) || creep.memory.researchLoc) {
	    if(creep.memory.researchLoc) {
	        creep.memory.researchLoc = false;
	    }
	    
	    creep.memory.building = true;
	    searchNewTarget(creep);
	}
}

//if creep is in building state
function buildingState(creep) {
    var target = Game.getObjectById(creep.memory.tempWorksite);
    //if target exists
    if(target) {
        //if target is finished search a new location
        if(target.hits - target.hitsMax == 0) {
            creep.memory.building = false;
            if(creep.carry.energy > ((creep.carryCapacity / 100) * reHarvestFactor)) {
                creep.memory.researchLoc = true;
            }
        //if not finished, proceed with build/repair
        } else {
            buildRepair(creep, target);
        }
    //if the target does not exist anymore (destroyed, despawned, whatever)
    } else {
        
        creep.memory.building = false;
        creep.memory.tempWorksite = undefined;
        creep.memory.researchLoc = true;
    }
}

function buildRepair(creep, target) {
    if(creep.build(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    } else if(creep.build(target) == ERR_INVALID_TARGET) {
        //if building failed, it should be something to repair..                
        if(creep.repair(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    } else {
        creep.build(target);
        randomMove(creep, target);
    }
}

function getClosestContainer(creep, minEnergyLimit) {
    var conn = [containerIDs.length];
    for(var i = 0; i < containerIDs.length; ++i) {
        var con = Game.getObjectById(containerIDs[i]); 
        if(_.sum(con.store) > minEnergyLimit) {
            conn[conn.length] = Game.getObjectById(containerIDs[i]);
        }
    }
    var closest = creep.pos.findClosestByRange(conn);
    return closest;
}


/*TODO HERE!!!: check implementieren, wenn ein creep zur source laufen will, 
                diese aber wärenddessen leer wird und der creep auch keine energy mehr hat,
                dass er in den idle zustand geraten soll. (evtl. umstrukturierung der if-else abfrage nötig)
*/

//if creep is not in building state goto source if not there and harvest
function sourceState(creep) {
    
     //########## DISMANTLE SOMETHING if there is anything
     //console.log('dismantle something!');
     //   for(var i = 0; i< dismantleTargetIDs.length; i++) {
     //       dismantle(dismantleTargetIDs[i]);
    //    }
    //##################################
    
    var carryCount = getActiveBodyPartCount(creep, CARRY);
    var container = getClosestContainer(creep, carryCount * 50 * containerFillFactor);

    if(container != null) { //if target container has decent amount of energy
        //get closest resource
        
        if(container.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            
            //creep.moveByPath(creep.memory.closestPath);
            creep.moveTo(container);
        //if the source is empty and the creep has a decent amount of energy, start building stuff
        } else if (container.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_ENOUGH_RESOURCES && creep.carry.energy > ((creep.carryCapacity / 100) * reFillFactorEmptySource)) {
            creep.memory.building = true;
        //if source is empty and no energy, move away (to prevent blocking)
        } else if (creep.carry.energy == 0) {
            if(!creep.pos.isNearTo(idlePosX, idlePosY)) {
                creep.moveTo(idlePosX, idlePosY, {reusePath: true});
            }
        } else if(container.transfer(creep) == ERR_NOT_ENOUGH_RESOURCES) {
            creep.memory.building = true;
        }
    } else {
        
                
        if(creep.carry.energy == 0) {
            if(!creep.pos.isNearTo(idlePosX, idlePosY)) {
                creep.moveTo(idlePosX, idlePosY, {reusePath: true});
            }
        } else {
            creep.memory.building = true;
        }
    }
}

function searchNewTarget(creep) {
    
    var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {algorithm:'dijkstra'});
	
	if(constructionSite) {    
    	creep.memory.tempWorksite = constructionSite.id;
    	//console.log('OK   ' + constructionSite);
	} else {
	        
        var lowLifeTargets = creep.room.find(FIND_STRUCTURES, {
            filter: (object) => {return (object.hits < object.hitsMax && object.structureType != STRUCTURE_ROAD);}, algorithm:'dijkstra'
            });
        
        lowLifeTargets.sort((a,b) => a.hits - b.hits);
        
        if(lowLifeTargets.length > 0) {
            creep.memory.tempWorksite = lowLifeTargets[0].id;
        }
        
    }
}

function getActiveBodyPartCount(creep, part) {
    var carryPartsCount = 0;
    var creepBody = creep.body;
    for(var i = 0; i < creepBody.length; ++i) {
        if(creepBody[i].type == part) {
            ++carryPartsCount;
        }
    }
    return carryPartsCount;
}

function randomMove(creep, target) {
    var distance = creep.pos.getRangeTo(target);
    var direction = creep.pos.getDirectionTo(target);
    
   // console.log('creep ' + creep.name + ': randomMove() distance '+distance + ' direction: ' + direction);
    var random = Math.ceil(Math.random()*8);
    //console.log(random);
    try {
        if(distance == 1) {
            if(random != direction) {
                var oppositeDir = target.pos.getDirectionTo(creep);
                creep.move(oppositeDir);
            }
        } else if(distance == 3) {
            creep.move(direction);
        } else if(distance == 2) {
             if(random != direction) {
                creep.move(random);
            }
        } else if(distance == 0) {
            var oppositeDir = target.pos.getDirectionTo(creep);
            creep.move(oppositeDir);
        } else if (distance > 3 ) {
            creep.move(direction);
        }
    } catch (someMoveError) {
        // like wall ..?!
    }
}

module.exports = roleOtherRoomBuilder;