var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMelee = require('role.melee');
var roleTower = require('role.tower');
var roleContainerHarvester = require('role.containerHarvester');
var roleTransporter = require('role.transporter');
var logicRespawn = require('logic.respawn');
var logicLinkUpgrader = require('logic.linkSend');
var roleSpecialAttackMelee = require('role.specialAttack-Melee');

var clearCreepsTime = 50;

var myRooms = ['E39S24'];
var mainSpawns = {[myRooms[0]]: '576d823abe1cccb44b189dc7'};

var southSourceID = {[myRooms[0]]: '576a9cd857110ab231d89d0e'};
var northSourceID = {[myRooms[0]]: '576a9cd857110ab231d89d0c'};
var northContainerID = {[myRooms[0]]: '57715701c2c8c47d7dca357a'};
var southContainerID = {[myRooms[0]]: '5770b7ece2a9e041522a21a9'};
var storageID = {[myRooms[0]]: '5772838880db66a6420cf328'};
var containerIDs = {[myRooms[0]]: [northContainerID[myRooms[0]], southContainerID[myRooms[0]]]}; //IF more energy is required, add id of secont harvest container
var containerAndStorageIDs = {[myRooms[0]]: [northContainerID[myRooms[0]], southContainerID[myRooms[0]], storageID[myRooms[0]]]};
var towerIDs = {[myRooms[0]]: ['576f44f45ab22ea71eb7bf36', '577498bad263b01f305db4ea']};
var harvestLinkID = {[myRooms[0]]: '577484b08bf1541b4fc49eb5'};
var upgraderLinkID = {[myRooms[0]]: '57748e0ad11ec119099d8d36'};

var allied = ['Gewure'];

//definiert, wieviele creeps vorhanden sein müssen von einer bestimmten rolle um den spawn für die nächst niedrigere rolle freizugeben. 
//wenn spawn cap erreicht wurde, wird je ein creep pro rolle abwechselnd gespawnt bis zum creep cap.
//**************
//AB HIER REIHENFOLGE DER ARRAYS WICHTIG!!! das heißt, wenn in roles ein einem raum zb. ein transporter an array position 0 steht, müssen seine eigenschaften ebenfalls am index 0 definiert werden.
//**************
var roles = {[myRooms[0]]: ['containerHarvesterNorth', 'transporter', 'containerHarvesterSouth', 'builder', 'upgrader']};
var shouldPreRespawn = {[myRooms[0]]: [true, true, true, 0, true]};
var spawnUntil = {[myRooms[0]]: [1, 1, 1, 1, 1]}; 
var maxCreepsPerRole = {[myRooms[0]]: [1, 2, 1, 1, 1]};
var creepBodyParts =    {[myRooms[0]]: [
                                        [WORK, CARRY, WORK, MOVE, WORK, MOVE, WORK, WORK, MOVE],
                                        [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE], 
                                        [WORK, MOVE, WORK, WORK, MOVE, WORK, CARRY, WORK, MOVE],
                                        [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE], 
                                        [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
                                    ]
                        };
//{RAUM: {ROLLE: [x,y]}}; wohin der creep direkt nach dem spawnen hinläuft
var preRespawnDestination = {[myRooms[0]]: [[28,30], [25,29], [22,41], [0,0], [8,40]]};

preRunWork();
module.exports.loop = function () {
    runNormalState();
   // clearDeadCreeps();
}

//if nothing special is happening run this tree. IMPLEMENT: other trees
function runNormalState() {
    
  //  assignRolelessCreep();
    
    for(var i = 0; i < myRooms.length; ++i) {
        if(myRooms[i] != null && myRooms[i] != undefined) {
            //run links per room
            logicLinkUpgrader.run(harvestLinkID[myRooms[i]], upgraderLinkID[myRooms[i]]);
            
            //run respawnlogic per room
            logicRespawn.run(roles[myRooms[i]], maxCreepsPerRole[myRooms[i]], creepBodyParts[myRooms[i]], myRooms[i], mainSpawns[myRooms[i]], spawnUntil[myRooms[i]], shouldPreRespawn[myRooms[i]], preRespawnDestination[myRooms[i]]);
            
            //run towers in room
            var towers = towerIDs[myRooms[i]];
            if(towers != undefined) {
                for(var i = 0; i < towers.length; ++i) {
                    roleTower.run(Game.getObjectById(towers[i]));
                }
            }
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        var spawnRoomName = creep.memory.spawnRoomName;
        if(creep.memory.role != undefined) {
            if(creep.memory.role == 'harvester') {
             roleHarvester.run(creep);
            } else if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep, upgraderLinkID[spawnRoomName]);
            } else if(creep.memory.role == 'builder') {
                 roleBuilder.run(creep, storageID[spawnRoomName], containerAndStorageIDs[spawnRoomName]);
            } else if(creep.memory.role == 'melee') {
                roleMelee.run(creep);
            } else if(creep.memory.role == 'transporter') {
                roleTransporter.run(creep, containerIDs[spawnRoomName], containerAndStorageIDs[spawnRoomName], towerIDs[spawnRoomName]);
            } else if(creep.memory.role == 'containerHarvesterNorth') {
                roleContainerHarvester.run(creep, northSourceID[spawnRoomName], northContainerID[spawnRoomName], undefined);
            } else if(creep.memory.role == 'containerHarvesterSouth') {
                roleContainerHarvester.run(creep, southSourceID[spawnRoomName], southContainerID[spawnRoomName], harvestLinkID[spawnRoomName]);
            } else if(creep.memory.role == 'specialAttack-Melee') {
                roleSpecialAttackMelee.run(creep);
            }
        } 
        // creep.memory.preRespawn = false;
        // creep.memory.spawnRoomName = 'E39S24';
    }
}

function assignRolelessCreep() {
    var roleless = _.filter(Game.creeps, (creep) => creep.memory.role == undefined);
    if(roleless.length > 0) {
        for(var i = 0; i < roleless.length; ++i) {
            assignRole(roleless[i]);
        }
    }
}

function roleToArrayIndex(role) {
    for(var i = 0; i < roles.length; ++i) {
        if(roles[i] == role)
            return i;
    }
}

function assignRole(creep) {
    var missingRole = getMissingRole();
    if(missingRole != undefined) {
        //die erste rolle ist die mit höchster priorität
        creep.memory.role = missingRole;
        creep.memory.prevX = 0; creep.memory.prevY = 0;
    } else {
        //mache ihn zum transporter
        creep.memory.role = 'transporter';
    }
}

function getMissingRole() {
    var roleCount = [['containerHarvesterNorth'], ['transporter'], ['containerHarvesterSouth'], ['builder'], ['upgrader']];
    
    for(var i in Memory.creeps) {
        if(Memory.creeps[i].role != undefined) {
           var roleIndex = roleToArrayIndex(Memory.creeps[i].role);
           if(roleCount[roleIndex][1] == undefined) {
               roleCount[roleIndex][1] = 1;
           } else {
               ++roleCount[roleIndex][1];
           }
        }
    }
    var missingRole = undefined;
    for(var i = roleCount.length - 1; i >= 0; --i) {
        if(roleCount[i][1] > maxCreepsPerRole[roleToArrayIndex(roleCount[i][0])]) {
            missingRole = roleCount[i][0];
            break;
        }
    }
    return missingRole;
}

function clearDeadCreeps() {
    if(Memory.curClearCreepsTime + 1 >= clearCreepsTime && !Game.spawns.Koblach.spawning) {
        for(var i in Memory.creeps) {
            if(!Game.creeps[i]) {
                delete Memory.creeps[i];
            }
        }
        Memory.curClearCreepsTime = 0;
    } else if(!Game.spawns.Koblach.spawning) {
        ++Memory.curClearCreepsTime;
    } else if(Game.spawns.Koblach.spawning) {
        Memory.curClearCreepsTime = 0;
    }
}

function preRunWork() {
    if(Memory.curClearCreepsTime == undefined) {
        Memory.curClearCreepsTime = 0;
    } 
}