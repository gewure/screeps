/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */
var leftMine= '576a9cb857110ab231d899fa';
var rightMine='576a9cb857110ab231d899f8';
var unitDistribution=0.5; // 0.5 for left mine, 0,5 for right
var currentDistribution=1;
var oldDistribution=1;
var isNotAssigned = true;
var state = 'spawned';
var closestSource = leftMine;



var reHarvestFactor = 20.0001; //if only 30 %energy are left, the creep will gather again
var reFillFactorEmptySource = 15;
//var sourceID = '576a9c9757110ab231d89552'; // left mine
var sourceID = leftMine;

var idlePosX = 37;
var idlePosY = 32;


//############################################# class
var roleBuilder = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
        preCheckStates(creep);
	    if(creep.memory.building) {
            buildingState(creep);
	    } else {
            sourceState(creep);
	    } 
	    
	     // death is awaiting
        if(creep.ticksToLive < 5) {
             state = 'very old';
            console.log(creep.name + " dies soon. state: " + state);
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
        } else {
            creep.repair(target);
        }
    } else {
        creep.build(target);
    }
}


/*TODO HERE!!!: check implementieren, wenn ein creep zur source laufen will, 
                diese aber wärenddessen leer wird und der creep auch keine energy mehr hat,
                dass er in den idle zustand geraten soll. (evtl. umstrukturierung der if-else abfrage nötig)

*/

//if creep is not in building state goto source if not there and harvest
function sourceState(creep) {
    console.log('builder ' + creep.name + ' goes harvesting to '+sourceID);
    var builders = _.filter(Game.creeps, {memory: 'builder'});

    if(currentDistribution >= unitDistribution) {
        var closestSource = Game.getObjectById(rightMine);
        currentDistribution=oldDistribution-1/(_.size(builders)-1);
        oldDistribution=currentDistribution;
    } else {
        var closestSource = Game.getObjectById(sourceID);
    }
    
    if(Game.getObjectById(sourceID).energy > 0) { //if target exists
            //get closest resource
            if(creep.harvest(closestSource) == ERR_NOT_IN_RANGE) {
                //creep.moveByPath(creep.memory.closestPath);
                creep.moveTo(closestSource);
            //if the source is empty and the creep has a decent amount of energy, start building stuff
            } else if (creep.harvest(closestSource) == ERR_NOT_ENOUGH_RESOURCES && creep.carry.energy > ((creep.carryCapacity / 100) * reFillFactorEmptySource)) {
                creep.memory.building = true;
            //if source is empty and no energy, move away (to prevent blocking)
            } else if (creep.carry.energy == 0) {
                if(!creep.pos.isNearTo(idlePosX, idlePosY)) {
                    creep.moveTo(idlePosX, idlePosY, {reusePath: true});
                }
            } else if(creep.harvest(closestSource) == ERR_NOT_ENOUGH_RESOURCES) {
                creep.memory.building = true;
            }
        } else {
                    
            /*if(creep.carry.energy == 0) {
                if(!creep.pos.isNearTo(idlePosX, idlePosY)) {
                    creep.moveTo(idlePosX, idlePosY, {reusePath: true});
                }
            } else {
                creep.memory.building = true;
            } */
       }
}

function searchNewTarget(creep) {
    
    var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {algorithm:'dijkstra'});
	
	if(constructionSite) {    
    	creep.memory.tempWorksite = constructionSite.id;
    	//console.log('OK   ' + constructionSite);
	} else {
	        
        var lowLifeTargets = creep.room.find(FIND_STRUCTURES, {
            filter: (object) => {return (object.hits < object.hitsMax);}, algorithm:'dijkstra'
            }); 
        
        
        lowLifeTargets.sort((a,b) => a.hits - b.hits);
        
        if(lowLifeTargets.length > 0) {
            creep.memory.tempWorksite = lowLifeTargets[0].id;
        }
        
    }
}

module.exports = roleBuilder;
