var minWallHitpoints = 400000;
var minRampartHitpoints = 400000;
var minRoadPoints = 4000;
var minContainerPoints = 150000;

var source = '57796949720916567dc376ca';

var storageID = '577b2f88e03b2946707baba5';
var containerIDs = ['5779cfd7986f591c34eadf9a', '577af4e8502328d4276d1a7d', '577acd04d33b4b4d0f4bf616']; 
var minEnergyLimit = 100;

var uselessWallIDs = [];

var roleRepairer = {
    
    run: function(creep, contIDs, ulessWallIDs, closestArr) {
        uselessWallIDs = ulessWallIDs;
        containerIDs = contIDs;
        var enemiesFound = creep.room.find(FIND_HOSTILE_CREEPS);
            
        if(enemiesFound.length > 1) {
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
        
         //###################################### death logic
	    if(creep.ticksToLive <= 30) {
    	     var targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (( structure.structureType == STRUCTURE_CONTAINER
                                ) && (structure.store[RESOURCE_ENERGY] < structure.storeCapacity));
                    }
                    });
                    
            if(targets && targets.length > 0) {
                if(creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets);
                }
            }
	    }
	    //####################################
        
        // save closests container in creeps memory
        creep.memory.targetContainerID = getClosestContainer(creep, creep.carryCapacity);
        //console.log('repairer gets energy from ' + creep.memory.targetContainerID);
        
        if(creep.carry.energy > 0) {
            
            var closestDamagedStructure = closestArr;/*creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_ROAD && structure.hits < minRoadPoints) || 
                                (structure.structureType == STRUCTURE_WALL && structure.hits < minWallHitpoints) || 
                                (structure.structureType == STRUCTURE_RAMPART && structure.hits < minRampartHitpoints) || 
                                (structure.structureType == STRUCTURE_CONTAINER && structure.hits < minContainerPoints));
            }, algorithm:'dijkstra'});  */
             
            // if there are enemies and the creep is under attack: move to closest rampart              
            if(enemiesFound.length > 1) {
                
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
                for(var j=0; j < closestDamagedStructure.length; j++) {
                    console.log('there is damaged structures: ' + closestDamagedStructure[j] + ' with ' + closestDamagedStructure[j].hits + '/'+closestDamagedStructure[j].hitsMax);
                    //for(var i = 0; i < uselessWallIDs.length; i++) {
                       // console.log('BBBBB'+closestDamagedStructure[j].id);
                           // if(closestDamagedStructure[j].id.localeCompare(uselessWallIDs[i] == false)) {
                                //console.log('repairer wont repair structure because it equals something on ulessWallIDs: ' );
                                switch(closestDamagedStructure[j].structureType) {
                                    case STRUCTURE_ROAD:
                                        creep.say('road');
                                        if(creep.repair(closestDamagedStructure[j]) == ERR_NOT_IN_RANGE) {
                                            creep.moveTo(closestDamagedStructure[j]);
                                        }
                                    break;
                                    case STRUCTURE_CONTAINER:
                                        creep.say('cont');
                                        if(creep.repair(closestDamagedStructure[j]) == ERR_NOT_IN_RANGE) {
                                            creep.moveTo(closestDamagedStructure[j]);
                                        }
                                    break;
                                    case STRUCTURE_WALL:
                                        creep.say('wall');
                                        if(creep.repair(closestDamagedStructure[j]) == ERR_NOT_IN_RANGE) {
                                            creep.moveTo(closestDamagedStructure[j]);
                                        }
                                    break;
                                    case STRUCTURE_RAMPART:
                                        creep.say('rampa');
                                        if(closestDamagedStructure[j].hits < minRampartHitpoints) {
                                            if(creep.repair(closestDamagedStructure[j]) == ERR_NOT_IN_RANGE) {
                                                creep.moveTo(closestDamagedStructure[j]);
                                            }
                                        } else {
                                            break;
                                        }
                                    break;
                                    default:
                                        creep.say('default');
                                         if(creep.repair(closestDamagedStructure[j]) == ERR_NOT_IN_RANGE) {
                                            creep.moveTo(closestDamagedStructure[j]);
                                        }
                                    break;
                                }
                           // }
                   // }
                }
            } else {
                 if(!creep.pos.isNearTo(Game.flags['Spawn'])) {
                    creep.moveTo(Game.flags['Spawn']); 
                }
            }
            
        } else {
            
             if(creep.carry.energy == 0) {
                 var container = Game.getObjectById(creep.memory.targetContainerID);
               // console.log('repairer gets energy from ' + container);
                if(!container)
                    container = Game.getObjectById(source);
                if(container.transfer(creep,RESOURCE_ENERGY,creep.carryCapacity-creep.carry) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            }
         }
    }
}

//######################### helping function
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