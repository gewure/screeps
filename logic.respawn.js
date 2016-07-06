//implementieren: wenn genug ressourcen vorhanden und nichts zu tun, ersetzte kleine durch größere creeps
var roles = [];
var maxCreepsPerRole = [];
var creepBodyParts = [];

var maxRespawnTick = 1;
var containerHarvesterPreRespawnTicks = 60;
var singleBodyPartSpawnTime = 3;
var curRoom = undefined;
var spawn = undefined;
var spawnCreepsUntil = undefined;
var shouldPreRespawn = undefined;
var preRespawnDestination = undefined;

var logicRespawn = {
    run: function(rol, maxPerRole, bodyParts, myRoom, mySpawn, spawnUntil, shouldPreR, preRespawnDest) {
        roles = rol; 
        maxCreepsPerRole = maxPerRole; 
        creepBodyParts = bodyParts;
        curRoom = Game.rooms[myRoom];
        spawn = Game.getObjectById(mySpawn);
        spawnCreepsUntil = spawnUntil;
        shouldPreRespawn = shouldPreR;
        preRespawnDestination = preRespawnDest;
        
        
        if(Memory.preSpawnDuration == undefined) Memory.preSpawnDuration = {};
        if(Memory.preSpawnDuration[myRoom] == undefined) Memory.preSpawnDuration[myRoom] = {};
        
        if(spawn.spawning == null) {
            var allCreeps = getAllCreepsWithRoomSpawnName(curRoom.name);
            var missingRoles = getMissingRoles(allCreeps);
            var priorizedCreep = getMostPriorizedMissingCreep(missingRoles);
            var preRespawnCreep = getPreRespawnCreep(allCreeps);    
            var creepToSpawn = undefined;
            
            // dann checken was wichtiger ist, prerespawn oder der mit mehr priorität. also nochmal eine priorisierung der beiden.
            if(priorizedCreep != undefined && preRespawnCreep != undefined) {
                if(roleToArrayIndex(priorizedCreep) < roleToArrayIndex(preRespawnCreep))
                      creepToSpawn = priorizedCreep;
                else creepToSpawn = preRespawnCreep;
            } else {
                if(preRespawnCreep != undefined) creepToSpawn = preRespawnCreep;
                if(priorizedCreep != undefined) creepToSpawn = priorizedCreep;
            }
            
            if(creepToSpawn != undefined) {
                clearDeadCreeps();
                var creepName = spawn.createCreep(creepBodyParts[roleToArrayIndex(creepToSpawn)], undefined, {role: creepToSpawn, prevX: 0, prevY: 0, preRespawn: false, spawnRoomName: curRoom.name});
                console.log(  ((creepName != -6) ? ('spawn creep \"' + creepName + '\" with role [' + creepToSpawn + '] in room ['+curRoom.name+'] at spawn ['+spawn.name+']') : ' can\'t spawn creep while spawning another one') );
            }
        }
    }
};

function getAllCreepsWithRoomSpawnName(roomNa) {
    var cre = [];
    for(var i in Game.creeps) {
        if(Game.creeps[i].memory.spawnRoomName == roomNa) {
            cre[cre.length] = Game.creeps[i];
        }
    }
    return cre;
}

function getMostPriorizedMissingCreep(missingRoles) {
    var mostPriorised = undefined;
    
    if(Object.keys(missingRoles).length > 0) {
        if(spawn.spawning != null) {
            var curSpawningCreepRole = Game.creeps[spawn.spawning.name].memory.role;
            if(missingRoles[curSpawningCreepRole] != undefined)
                --missingRoles[curSpawningCreepRole];
        }
        
        for(var cRole in missingRoles) {
            //if creep role isn't currently spawning
            if(missingRoles[cRole] <= 0 || missingRoles[cRole] == undefined)
               delete missingRoles[cRole];
        }
       
        var creepBelowCap = undefined;
        //get missing creep below cap
        for(var i = 0; i < roles.length; ++i) {
            if(maxCreepsPerRole[i] - missingRoles[roles[i]] < spawnCreepsUntil[i]) {
                creepBelowCap = roles[i];
                break;
            }
        }
        var creepAboveCap = undefined;
        //get missing creep above cap
        if(creepBelowCap == undefined) {
            for(var i = 0; i < roles.length; ++i) {
                if(missingRoles[roles[i]] != undefined && missingRoles[roles[i]] < maxCreepsPerRole[i]) {
                    creepAboveCap = roles[i];
                    break;
                }
            }
            mostPriorised = creepAboveCap;
        } else mostPriorised = creepBelowCap;
    }
    return mostPriorised;
}

function createRoomCostMatrix() {
    var fieldSize = 50;
    var costMatrix = [];
    for(var y = 0; y < fieldSize; ++y) {
        costMatrix[y] = [];
        for(var x = 0; x < fieldSize; ++x) {
            var road = curRoom.lookForAt(STRUCTURE_ROAD, x, y);
            var terrain = curRoom.lookForAt(LOOK_TERRAIN, x, y);
            
            costMatrix[y][x] = getWalkMultiplier(((road != undefined && road != null) ? 'road' : terrain));
        }
    }
    return costMatrix;
}

function getWalkMultiplier(ter) {
    var multi = undefined;
    if(ter == 'plain') multi = 2;
    else if(ter == 'road') multi = 1;
    else if(ter == 'swamp') multi = 10;
    else if(ter == 'wall') multi = -1;
    return multi;
}

function getCreepSpawnAndTravelTime(role) {
     
    //calculate path to destination if not previously stored (and the path is valid == target not changed)
    if(Memory.preSpawnDuration[curRoom.name][role] == undefined || Memory.preSpawnDuration[curRoom.name][role] == null) {
        if(Memory.roomCostMatrix == undefined) Memory.roomCostMatrix = {};
        if(Memory.roomCostMatrix[curRoom.name] == undefined) Memory.roomCostMatrix[curRoom.name] = createRoomCostMatrix();
        
         //recalculate Path
        var newPath = curRoom.findPath(spawn.pos, curRoom.getPositionAt(preRespawnDestination[roleToArrayIndex(role)][0], preRespawnDestination[roleToArrayIndex(role)][1]), {ignoreCreeps: true});
        Memory.preSpawnDuration[curRoom.name][role] = (creepBodyParts[roleToArrayIndex(role)].length * singleBodyPartSpawnTime) + ticksRequiredForPath(newPath, role);
    }
    return Memory.preSpawnDuration[curRoom.name][role];
}

function ticksRequiredForPath(newPath, role) {
    //calc. how much ticks the creep will need to walk
    //get moveparts
	
	var movePartCount = 0;
    var carryPartCount = 0;
	var totalParts = creepBodyParts[roleToArrayIndex(role)];

    for(var i = 0; i < totalParts.length; ++i) {
        if(totalParts[i] == MOVE) {
            ++movePartCount;
        }
    }
    //'cause all carry parts are empty after spawn..
    for(var i = 0; i < totalParts.length; ++i) {
        if(totalParts[i] == CARRY) {
            ++carryPartCount;
        }
    }
	
	var ticksRequired = 0;
    var creepFatigue = 0;
    var index = 0;
    
    //all parts exclusive move parts and empty carry parts
    var weight = totalParts.length - (movePartCount + carryPartCount);
    console.log('WW'+weight);
    while(index < newPath.length) {
        //if creep can walk, go to next field and calc fatigue
        if(creepFatigue <= 0) {
            if(++index < newPath.length) {
                var curMulti = Memory.roomCostMatrix[curRoom.name][newPath[index].y][newPath[index].x];
                console.log(curMulti);
                creepFatigue = (weight * curMulti) - (movePartCount * 2);
                //creepFatigue = ((totalParts.length * curMulti) - (movePartCount * 2));
                console.log(creepFatigue);
                if(creepFatigue < 0) creepFatigue = 0;
            } else {
                ++ticksRequired;
                break;
            }
        } else {
            //decrease fatigue
            var newFat = creepFatigue - (movePartCount * 2);
            creepFatigue = ((newFat > 0) ? newFat : 0);
        }
        ++ticksRequired;
    }  
    
    console.log('ticks: ' + ticksRequired +  ' pathSize: ' + newPath.length);
    return ticksRequired;      
}


function getPreRespawnCreep(allCreeps) {

    var preRespawnCreepsCount = {};
    for(var cr in allCreeps) {
        if(shouldPreRespawn[roleToArrayIndex(allCreeps[cr].memory.role)] && allCreeps[cr].ticksToLive <= getCreepSpawnAndTravelTime(allCreeps[cr].memory.role) && allCreeps[cr].memory.preRespawn == false) {
            ((preRespawnCreepsCount[allCreeps[cr].memory.role] == undefined) ? preRespawnCreepsCount[allCreeps[cr].memory.role] = 1 : ++preRespawnCreepsCount[allCreeps[cr].memory.role]);
            allCreeps[cr].memory.preRespawn = true;
        }
    }
    
    var mostPrio = getMostPriorizedMissingCreep(preRespawnCreepsCount);
    return mostPrio;
}

function getCreepsAndRolesAvaliable(allCreeps) {
    var creepsAndRolesAvaliable = {};
    for(var i in allCreeps) {
        if(allCreeps[i].memory != undefined && allCreeps[i].memory.role != undefined) {
            if(creepsAndRolesAvaliable[allCreeps[i].memory.role] == undefined)
                creepsAndRolesAvaliable[allCreeps[i].memory.role] = 1;
            else ++creepsAndRolesAvaliable[allCreeps[i].memory.role];
        }
    }
    return creepsAndRolesAvaliable;
}

function getMissingRoles(allCreeps) {
    var avaliableCreeps = getCreepsAndRolesAvaliable(allCreeps);
    var missingCreeps = {};
    
    for(var i = 0; i < maxCreepsPerRole.length; ++i) {
        if(avaliableCreeps[roles[i]] == undefined) {
            missingCreeps[roles[i]] = maxCreepsPerRole[i];
        } else if(avaliableCreeps[roles[i]] < maxCreepsPerRole[i]) {
            missingCreeps[roles[i]] = maxCreepsPerRole[i] - avaliableCreeps[roles[i]];
        }
    }
    return missingCreeps;
}

function roleToArrayIndex(role) {
    for(var i = 0; i < roles.length; ++i) {
        if(roles[i] == role) return i;
    }
}

function creepCost(bodyArray) {
    var buildCost = 0;
    for(var index = 0; index < bodyArray.length; ++index) {
        var bodypart = bodyArray[index];
        switch(bodypart) {
            case MOVE: case CARRY: buildCost+=50; break;
            case WORK: buildCost+=100; break;
            case HEAL: buildCost+=250; break;
            case TOUGH: buildCost+=10; break;
            case ATTACK: buildCost+=80; break;
            case RANGED_ATTACK: buildCost+=150; break;
            case CLAIM: buildCost+=600; break;
        }
    }
    return buildCost;
}

function clearDeadCreeps() {
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
}
module.exports = logicRespawn;