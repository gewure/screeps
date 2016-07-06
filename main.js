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
var roleOtherRoomHarvester = require('role.otherRoomHarvester');
var roleClaimer = require('role.claimer');
var roleInitialBuilder = require('role.initialBuilder');
var roleOtherRoomUpgrader = require('role.otherRoomUpgrader');
var roleOtherRoomTransporter = require('role.otherRoomTransporter');

var myRooms = ['E39S24', 'E39S23'];
var mainSpawns = {
                                [myRooms[0]]: '576d823abe1cccb44b189dc7',
                                [myRooms[1]]: '5779e659ae3a4dda302a503a'
};

var southSourceID = {
                                [myRooms[0]]: '576a9cd857110ab231d89d0e',
                                [myRooms[1]]: '576a9cd857110ab231d89d08'
};
var northSourceID = {
                                [myRooms[0]]: '576a9cd857110ab231d89d0c',
                                [myRooms[1]]: '576a9cd857110ab231d89d0a'
};
var northContainerID = {        
                                [myRooms[0]]: ['57715701c2c8c47d7dca357a','577945c58fa71ef76bb77cc3'],
                                [myRooms[1]]: ['577bf0c3904152921634cd0d', '577c66b8f6a1cb3365f59932']
};
var southContainerID = {        
                                [myRooms[0]]: ['5770b7ece2a9e041522a21a9','577951f78687b175407aecf4'],
                                [myRooms[1]]: ['577bceae16abb6a8029cb40d']
};
var storageID = {               
                                [myRooms[0]]: '5772838880db66a6420cf328'
                                //,[myRooms[1]]: undefined
};
var transporterMainContainer = {
                                [myRooms[0]]: [ [northContainerID[myRooms[0]][0]], [northContainerID[myRooms[0]][1]]],
                                [myRooms[1]]: [ [northContainerID[myRooms[1]][0]]]
};
var containerIDs = {            
                                [myRooms[0]]: [ [northContainerID[myRooms[0]][0]], [northContainerID[myRooms[0]][1]], [southContainerID[myRooms[0]][0]], [southContainerID[myRooms[0]][1]]],
                                [myRooms[1]]: [ [northContainerID[myRooms[1]][0]], [southContainerID[myRooms[1]][0]]]
}; //IF more energy is required, add id of secont harvest container
var containerAndStorageIDs = {  
                                [myRooms[0]]: [[northContainerID[myRooms[0]][0]], [northContainerID[myRooms[0]][1]], [southContainerID[myRooms[0]][0]], [southContainerID[myRooms[0]][1]], storageID[myRooms[0]]],
                                [myRooms[1]]: [[northContainerID[myRooms[1]][0]], [northContainerID[myRooms[1]][1]], [southContainerID[myRooms[1]][0]]]
};
var towerIDs = {                
                                [myRooms[0]]: ['576f44f45ab22ea71eb7bf36', '577498bad263b01f305db4ea'],
                                [myRooms[1]]: ['577b3efaa9d003b87ba8e26d']
};
var harvestLinkID = {[myRooms[0]]: '577484b08bf1541b4fc49eb5'};
var upgraderLinkID = {[myRooms[0]]: '57748e0ad11ec119099d8d36'};

var allied = ['Gewure'];

//definiert, wieviele creeps vorhanden sein müssen von einer bestimmten rolle um den spawn für die nächst niedrigere rolle freizugeben. 
//wenn spawn cap erreicht wurde, wird je ein creep pro rolle abwechselnd gespawnt bis zum creep cap.
//**************
//AB HIER REIHENFOLGE DER ARRAYS WICHTIG!!! das heißt, wenn in roles ein einem raum zb. ein transporter an array position 0 steht, müssen seine eigenschaften ebenfalls am index 0 definiert werden.
//**************
var roles = {
                [myRooms[0]]: ['containerHarvesterNorth', 'transporter', 'containerHarvesterSouth', 'builder', 'upgrader', 'otherRoomTransporter'],
                [myRooms[1]]: ['containerHarvesterNorth', 'transporter', 'containerHarvesterSouth', 'builder', 'upgrader']
};
var shouldPreRespawn = {
                            [myRooms[0]]: [true, true, true, false, true, false],
                            [myRooms[1]]: [true, true, true, false, true]
};
var spawnUntil = {      
                            [myRooms[0]]: [1, 2, 1, 1, 1, 1],
                            [myRooms[1]]: [1, 2, 1, 3, 3]
}; 
var maxCreepsPerRole = {    
                            [myRooms[0]]: [1, 3, 1, 1, 1, 3],
                            [myRooms[1]]: [1, 2, 1, 4, 3]
};
var creepBodyParts =    {   [myRooms[0]]:   [
                                            [WORK, CARRY, WORK, MOVE, WORK, MOVE, WORK, WORK, MOVE],
                                            [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE], 
                                            [WORK, MOVE, WORK, WORK, MOVE, WORK, CARRY, WORK, MOVE],
                                            [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE], 
                                            [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                                            [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
                                            ],
                            [myRooms[1]]:   [
                                            [WORK, CARRY, WORK, MOVE, WORK, MOVE, WORK, WORK, MOVE],
                                            [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE], 
                                            [WORK, MOVE, WORK, WORK, MOVE, WORK, CARRY, WORK, MOVE],
                                            [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 
                                            [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
                                            ]
                        };
//{RAUM: {ROLLE: [x,y]}}; wohin der creep direkt nach dem spawnen hinläuft
var preRespawnDestination = {
                            [myRooms[0]]: [[28,30], [25,29], [22,41], [0,0], [8,40], [0,0]],
                            [myRooms[1]]: [[45,31], [41,20], [43,11], [0,0], [42,13]]
};
//falls ein link/container immer bis zu einem cap gefüllt werden soll, hier rein ({raum: {ID: minCap}})
var minCapLinkIDs = {       
                            [myRooms[0]]: {[harvestLinkID[myRooms[0]]]: 500}};

var containerFillFactor = { 
                            [myRooms[0]]: 6, 
                            [myRooms[1]]: 1
};

module.exports.loop = function () {
    runNormalState();
}

//if nothing special is happening run this tree. IMPLEMENT: other trees
function runNormalState() {
    
  //  assignRolelessCreep();
    
    for(var i = 0; i < myRooms.length; ++i) {
     //   console.log(i);
        if(myRooms[i] != null && myRooms[i] != undefined) {
            //run links per room
            if(harvestLinkID[myRooms[i]] != undefined && upgraderLinkID[myRooms[i]] != undefined)
                logicLinkUpgrader.run(harvestLinkID[myRooms[i]], upgraderLinkID[myRooms[i]]);
            
            //run respawnlogic per room
            logicRespawn.run(roles[myRooms[i]], maxCreepsPerRole[myRooms[i]], creepBodyParts[myRooms[i]], myRooms[i], mainSpawns[myRooms[i]], spawnUntil[myRooms[i]], shouldPreRespawn[myRooms[i]], preRespawnDestination[myRooms[i]]);
            
            //run towers in room
            var towers = towerIDs[myRooms[i]];
            if(towers != undefined) {
                for(var x = 0; x < towers.length; ++x) {
                    roleTower.run(Game.getObjectById(towers[x]));
                }
            }
        }
     //   console.log(i);
    }
    
    // var next
    
    var rankweilHarvesterCount = 0;
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        var spawnRoomName = creep.memory.spawnRoomName;
        if(creep.memory.role != undefined) {
            if(creep.memory.role == 'harvester') {
             roleHarvester.run(creep);
            } else if(creep.memory.role == 'upgrader') {
                if(creep.memory.spawnRoomName == myRooms[0])
                    roleUpgrader.run(creep, southContainerID[spawnRoomName], upgraderLinkID[spawnRoomName]);
                else if(creep.memory.spawnRoomName == myRooms[1])
                    roleUpgrader.run(creep, southContainerID[spawnRoomName]);
            } else if(creep.memory.role == 'builder') {
                 roleBuilder.run(creep, storageID[spawnRoomName], containerAndStorageIDs[spawnRoomName], containerFillFactor[spawnRoomName]);
            } else if(creep.memory.role == 'melee') {
                roleMelee.run(creep);
            } else if(creep.memory.role == 'transporter') {
                roleTransporter.run(creep, containerIDs[spawnRoomName], containerAndStorageIDs[spawnRoomName], towerIDs[spawnRoomName], minCapLinkIDs[spawnRoomName], transporterMainContainer[spawnRoomName], storageID[spawnRoomName]);
            } else if(creep.memory.role == 'containerHarvesterNorth') {
                roleContainerHarvester.run(creep, northSourceID[spawnRoomName], northContainerID[spawnRoomName], undefined);
            } else if(creep.memory.role == 'containerHarvesterSouth') {
                roleContainerHarvester.run(creep, southSourceID[spawnRoomName], southContainerID[spawnRoomName], harvestLinkID[spawnRoomName]);
            } else if(creep.memory.role == 'specialAttack-Melee') {
                roleSpecialAttackMelee.run(creep);
            } else if(creep.memory.role == 'otherRoomHarvester') {
                roleOtherRoomHarvester.run(creep, '576a9cce57110ab231d89c04', storageID[spawnRoomName], Game.flags.harvesterEntrance.name, Game.flags.harvesterExit.name);
            } else if(creep.memory.role == 'otherRoomHarvesterRankweil') {
                roleOtherRoomHarvester.run(creep, '576a9cd857110ab231d89d08', storageID[spawnRoomName], Game.flags.toRankweil.name, Game.flags.toKoblach.name);
            } else if(creep.memory.role == 'otherRoomHarvesterRankweilSouth') {
                roleOtherRoomHarvester.run(creep, '576a9cd857110ab231d89d0a', storageID[spawnRoomName], Game.flags.toRankweil.name, Game.flags.toKoblach.name);
            } else if(creep.memory.role == 'claimer') {
                roleClaimer.run(creep);
            } else if(creep.memory.role == 'initialBuilder') {
                roleInitialBuilder.run(creep, Game.flags.toRankweil.name, Game.flags.toKoblach.name, storageID[spawnRoomName]);
            } else if(creep.memory.role == 'otherRoomUpgrader') {
                roleOtherRoomUpgrader.run(creep, Game.flags.toRankweil.name, Game.flags.toKoblach.name, storageID[spawnRoomName]);
            } else if(creep.memory.role == 'otherRoomTransporter') {
                roleOtherRoomTransporter.run(creep, Game.flags.toRankweil.name, Game.flags.toKoblach.name, storageID[spawnRoomName], containerAndStorageIDs[myRooms[1]]);
            }
        } 
    }
}

// function assignRolelessCreep() {
//     var roleless = _.filter(Game.creeps, (creep) => creep.memory.role == undefined);
//     if(roleless.length > 0) {
//         for(var i = 0; i < roleless.length; ++i) {
//             assignRole(roleless[i]);
//         }
//     }
// }

function roleToArrayIndex(role) {
    for(var i = 0; i < roles.length; ++i) {
        if(roles[i] == role)
            return i;
    }
}

// function assignRole(creep) {
//     var missingRole = getMissingRole();
//     if(missingRole != undefined) {
//         //die erste rolle ist die mit höchster priorität
//         creep.memory.role = missingRole;
//         creep.memory.prevX = 0; creep.memory.prevY = 0;
//     } else {
//         //mache ihn zum transporter
//         creep.memory.role = 'transporter';
//     }
// }

// function getMissingRole() {
//     var roleCount = [['containerHarvesterNorth'], ['transporter'], ['containerHarvesterSouth'], ['builder'], ['upgrader']];
    
//     for(var i in Memory.creeps) {
//         if(Memory.creeps[i].role != undefined) {
//           var roleIndex = roleToArrayIndex(Memory.creeps[i].role);
//           if(roleCount[roleIndex][1] == undefined) {
//               roleCount[roleIndex][1] = 1;
//           } else {
//               ++roleCount[roleIndex][1];
//           }
//         }
//     }
//     var missingRole = undefined;
//     for(var i = roleCount.length - 1; i >= 0; --i) {
//         if(roleCount[i][1] > maxCreepsPerRole[roleToArrayIndex(roleCount[i][0])]) {
//             missingRole = roleCount[i][0];
//             break;
//         }
//     }
//     return missingRole;
// }