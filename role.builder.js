var reHarvestFactor = 30; //if only 30 %energy are left, the creep will gather again
var reFillFactorEmptySource = 15;
var storageID = '5772838880db66a6420cf328';
var containerIDs = ['57715701c2c8c47d7dca357a', '5770b7ece2a9e041522a21a9', storageID];

var idlePosX = 28;
var idlePosY = 37;
var minEnergyLimit = 800;
var containerFillFactor = 4;

var roleBuilder = {
    /** @param {Creep} creep **/
    run: function(creep) {
        preCheckStates(creep);
	    if(creep.memory.building) {
            buildingState(creep);
	    } else if(creep.ticksToLive > 80) {
            sourceState(creep);
	    } 
	}
};

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
    }
}

function getClosestContainer(creep, minEnergyLimit) {
    var conn = [];
    for(var i = 0; i < containerIDs.length; ++i) {
        var con = Game.getObjectById(containerIDs[i]); 
        if(_.sum(con.store) > minEnergyLimit) {
            conn[conn.length] = Game.getObjectById(containerIDs[i]);
        }
    }
    var closest = creep.pos.findClosestByRange(conn);
    console.log('xx ' + con);
    return closest;
}


/*TODO HERE!!!: check implementieren, wenn ein creep zur source laufen will, 
                diese aber wärenddessen leer wird und der creep auch keine energy mehr hat,
                dass er in den idle zustand geraten soll. (evtl. umstrukturierung der if-else abfrage nötig)

*/

//if creep is not in building state goto source if not there and harvest
function sourceState(creep) {
    var carryCount = getActiveBodyPartCount(creep, CARRY);
    var container = getClosestContainer(creep, carryCount * 50 * containerFillFactor);
        console.log(container);

    if(container != null) { //if target container has decent amount of energy
        //get closest resource
            console.log('xx ');

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

module.exports = roleBuilder;