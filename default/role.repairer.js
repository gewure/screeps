var minWallHitpoints = 602000;
var minRampartHitpoints = 700000;
var minRoadPoints = 4200;
var minContainerPoints =200000;

var minEnergyLimit = 100;

var uselessWallIDs = [];

var roleRepairer = {
    name: 'repairer',
    run: function(creep) {

        if((creep.ticksToLive%10)==0) {
            var enemiesFound = '';//creep.room.find(FIND_HOSTILE_CREEPS);
            
            if(enemiesFound!=undefined) {
                if(enemiesFound ) {
                    console.log('xxxxxx');
                    minWallHitpoints = 290000;
                    minRampartHitpoints = 290000;
                    minRoadPoints = 0;
                    minContainerHitpoints = 0;
                } else {
                    minWallHitpoints = 400000;
                    minRampartHitpoints = 400000;
                    minRoadPoints = 4500;
                    minContainerPoints = 150000;
                }
            }
        }
        
         //###################################### death logic
	 
	    //####################################
        
        // save closests container in creeps memory
        creep.memory.targetContainerID = getClosestContainer(creep, creep.carryCapacity);
        //console.log('repairer gets energy from ' + creep.memory.targetContainerID);
        
        if(creep.carry.energy > 0) {
            
        
            var closestDamagedStructure = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (/*(structure.structureType == STRUCTURE_ROAD && structure.hits < minRoadPoints) || */
                                (structure.structureType == STRUCTURE_WALL && structure.hits < minWallHitpoints) || 
                                (structure.structureType == STRUCTURE_RAMPART && structure.hits < minRampartHitpoints) || 
                                (structure.structureType == STRUCTURE_CONTAINER && structure.hits < minContainerPoints));
            }, algorithm:'dijkstra'}); 
            creep.memory.repairTarg = closestDamagedStructure[0].id; 
            // if there are enemies and the creep is under attack: move to closest rampart              
            if(enemiesFound) {
                creep.say('hide!');
                if(creep.hits < creep.hitsMax) {
                    
                    var closestRamp = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                                structure.structureType == STRUCTURE_RAMPART) 
                    }, algorithm:'astar'}); 
                    
                    creep.moveTo(closestRamp);
                }
            }

            if(closestDamagedStructure.length > 0) {
                var j = 0;
               // for(var j=0; j < closestDamagedStructure.length; j++) {
                    //console.log('there is damaged structures: ' + closestDamagedStructure[j] + ' with ' + closestDamagedStructure[j].hits + '/'+closestDamagedStructure[j].hitsMax);
                    //for(var i = 0; i < uselessWallIDs.length; i++) {
                       // console.log('BBBBB'+closestDamagedStructure[j].id);
                           // if(closestDamagedStructure[j].id.localeCompare(uselessWallIDs[i] == false)) {
                                //console.log('repairer wont repair structure because it equals something on ulessWallIDs: ' );
                                switch(closestDamagedStructure[j].structureType) {
                                    case STRUCTURE_ROAD:
                                        creep.say('road');
                                        if(creep.repair(closestDamagedStructure[j]) == ERR_NOT_IN_RANGE) {
                                            creep.moveTo(closestDamagedStructure[j]);
                                        } else {
                                            creep.repair(closestDamagedStructure[j]);
                                        }
                                    break;
                                    case STRUCTURE_CONTAINER:
                                        creep.say('cont');
                                        if(creep.repair(closestDamagedStructure[j]) == ERR_NOT_IN_RANGE) {
                                            creep.moveTo(closestDamagedStructure[j],{ignoreRoads:true,reusePath:2});
                                        }
                                    break;
                                    case STRUCTURE_WALL:
                                        creep.say('wall');
                                        if(creep.repair(closestDamagedStructure[j]) == ERR_NOT_IN_RANGE) {
                                            creep.moveTo(closestDamagedStructure[j],{ignoreRoads:true,reusePath:2});
                                        }
                                    break;
                                    case STRUCTURE_RAMPART:
                                        creep.say('rampa');
                                        if(closestDamagedStructure[j].hits < minRampartHitpoints) {
                                            if(creep.repair(closestDamagedStructure[j]) == ERR_NOT_IN_RANGE) {
                                                creep.moveTo(closestDamagedStructure[j],{ignoreRoads:true,reusePath:2});
                                            }
                                        } else {
                                            break;
                                        }
                                    break;
                                    default:
                                        creep.say('default');
                                         if(creep.repair(closestDamagedStructure[j]) == ERR_NOT_IN_RANGE) {
                                            creep.moveTo(closestDamagedStructure[j],{ignoreRoads:true,reusePath:2});
                                        }
                                    break;
                                }
                           // }
                   // }
               // } end f0r loop
            } else {
                var closest = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                            return (/*(structure.structureType == STRUCTURE_ROAD && structure.hits < minRoadPoints) || */
                                    (structure.structureType == STRUCTURE_WALL && structure.hits < minWallHitpoints) || 
                                    (structure.structureType == STRUCTURE_RAMPART && structure.hits < minRampartHitpoints) 
                                    /*(structure.structureType == STRUCTURE_CONTAINER && structure.hits < minContainerPoints) */);
                }, algorithm:'astar'}); 
                if(creep.repair(closest[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(closest[0], {ignoreRoads:true,reusePath:2});
                }
            }
            
        } else {
            creep.say('else2');
             if(creep.carry.energy == 0) {
                var container =  creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (( structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE )&& structure.store[RESOURCE_ENERGY] >= minEnergyLimit); 
                }, algorithm:'astar'}); 
                           // console.log('repairer gets energy from ' + container);
               
                    
                if(creep.withdraw(container,RESOURCE_ENERGY,creep.carryCapacity-creep.carry) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            }
         }
    }
}

//######################### helping function
function getClosestContainer(creep, minEnergyLimit) {
    var closest =  creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            return ( structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] >= minEnergyLimit); 
    }, algorithm:'astar'}); 
    return closest;
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


module.exports = roleRepairer;