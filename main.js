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
var roleMineralHarvester = require('role.mineralHarvester');
var roleReserver = require('role.reserver');
var rolePioneer = require('role.pioneer');

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
                                [myRooms[1]]: ['577bceae16abb6a8029cb40d', '577c84e044995c890e834632']
};
var storageID = {               
                                [myRooms[0]]: '5772838880db66a6420cf328',
                                [myRooms[1]]: '577f3a36bab570293b0f6a89'
};
var transporterMainContainer = {
                                [myRooms[0]]: [ [northContainerID[myRooms[0]][0]], [northContainerID[myRooms[0]][1]]],
                                [myRooms[1]]: [ [northContainerID[myRooms[1]][0]], [northContainerID[myRooms[1]][1]]]
};
var containerIDs = {            
                                [myRooms[0]]: [ [northContainerID[myRooms[0]][0]], [northContainerID[myRooms[0]][1]], [southContainerID[myRooms[0]][0]], [southContainerID[myRooms[0]][1]]],
                                [myRooms[1]]: [ [northContainerID[myRooms[1]][0]], [southContainerID[myRooms[1]][0]], [northContainerID[myRooms[1]][1]], [southContainerID[myRooms[1]][1]]]
}; //IF more energy is required, add id of secont harvest container
var containerAndStorageIDs = {  
                                [myRooms[0]]: [[northContainerID[myRooms[0]][0]], [northContainerID[myRooms[0]][1]], [southContainerID[myRooms[0]][0]], [southContainerID[myRooms[0]][1]], storageID[myRooms[0]]],
                                [myRooms[1]]: [[northContainerID[myRooms[1]][0]], [northContainerID[myRooms[1]][1]], [southContainerID[myRooms[1]][0]], [southContainerID[myRooms[1]][1]], storageID[myRooms[1]]]
};
var towerIDs = {                
                                [myRooms[0]]: ['576f44f45ab22ea71eb7bf36', '577498bad263b01f305db4ea'],
                                [myRooms[1]]: ['577b3efaa9d003b87ba8e26d']
};
var harvestLinkID = {[myRooms[0]]: '577484b08bf1541b4fc49eb5', [myRooms[1]]: '5780799a7f2974507bad14cc'};
var upgraderLinkID = {[myRooms[0]]: '57748e0ad11ec119099d8d36', [myRooms[1]]: '5780775c3ca365ec6dbbae20'};

var allied = ['Gewure'];

//definiert, wieviele creeps vorhanden sein müssen von einer bestimmten rolle um den spawn für die nächst niedrigere rolle freizugeben. 
//wenn spawn cap erreicht wurde, wird je ein creep pro rolle abwechselnd gespawnt bis zum creep cap.
//**************
//AB HIER REIHENFOLGE DER ARRAYS WICHTIG!!! das heißt, wenn in roles ein einem raum zb. ein transporter an array position 0 steht, müssen seine eigenschaften ebenfalls am index 0 definiert werden.
//**************
var roles = {
                [myRooms[0]]: ['containerHarvesterNorth', 'transporter', 'containerHarvesterSouth', 'builder', 'upgrader', 'otherRoomHarvester', 'reserver', 'pioneer'],
                [myRooms[1]]: ['containerHarvesterNorth', 'transporter', 'containerHarvesterSouth', 'builder', 'upgrader', 'otherRoomHarvester', 'reserver', 'pioneer']
};
var shouldPreRespawn = {
                            [myRooms[0]]: [true, true, true, false, true, false, false, false],
                            [myRooms[1]]: [true, true, true, false, true, false, false, false]
};
var spawnUntil = {      
                            [myRooms[0]]: [1, 2, 1, 1, 1, 1, 1, 1],
                            [myRooms[1]]: [1, 2, 1, 1, 1, 1, 1, 1]
}; 
var maxCreepsPerRole = {    
                            [myRooms[0]]: [1, 2, 1, 1, 1, 4, 1, 1],
                            [myRooms[1]]: [1, 2, 1, 1, 1, 5, 1, 1]
};
var creepBodyParts =    {   [myRooms[0]]:   [
                                            [WORK, CARRY, WORK, MOVE, WORK, MOVE, WORK, WORK, MOVE],
                                            [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE], 
                                            [WORK, MOVE, WORK, WORK, MOVE, WORK, CARRY, WORK, MOVE],
                                            [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE], 
                                            [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
                                            [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                                            [CLAIM, CLAIM, MOVE, MOVE],
                                            [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
                                            ],
                            [myRooms[1]]:   [
                                            [WORK, CARRY, WORK, MOVE, WORK, MOVE, WORK, WORK, MOVE],
                                            [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE], 
                                            [WORK, MOVE, WORK, WORK, MOVE, WORK, CARRY, WORK, MOVE],
                                            [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE], 
                                            [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
                                            [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
                                            [CLAIM, CLAIM, MOVE, MOVE],
                                            [WORK,CARRY,MOVE]
                                            ]
                        };
//{RAUM: {ROLLE: [x,y]}}; wohin der creep direkt nach dem spawnen hinläuft
var preRespawnDestination = {
                            [myRooms[0]]: [[28,30], [25,29], [22,41], [0,0], [8,40], [0,0], [0,0], [0,0]],
                            [myRooms[1]]: [[45,31], [41,20], [43,11], [0,0], [42,13], [0,0], [0,0], [0,0]]
};
//falls ein link/container immer bis zu einem cap gefüllt werden soll, hier rein ({raum: {ID: minCap}})
var minCapLinkIDs = {       
                            [myRooms[0]]: {[harvestLinkID[myRooms[0]]]: 500},
                            [myRooms[1]]: {[harvestLinkID[myRooms[1]]]: 500}
};

var containerFillFactor = { 
                            [myRooms[0]]: 6, 
                            [myRooms[1]]: 1
};

var builderIdlePos = {
                            [myRooms[0]]: [28, 37],  
                            [myRooms[1]]: [31, 23]
};

var distanceHarvesterSources = {
                            [myRooms[0]]: '576a9cce57110ab231d89c04', 
                            [myRooms[1]]: '576a9cd857110ab231d89d06'
};
var distanceHarvesterSourceFlags = {
                            [myRooms[0]]: Game.flags.koblachHarvestSource.name, 
                            [myRooms[1]]: Game.flags.rankweilHarvestSource.name
};
var distanceHarvesterControllerFlags = {
                            [myRooms[0]]: Game.flags.koblachDistController.name, 
                            [myRooms[1]]: Game.flags.rankweilDistController.name
};
var pioneerFlags = {
                            [myRooms[0]]: Game.flags.pioneerKoblach.name, 
                            [myRooms[1]]: Game.flags.pioneerRankweil.name
};

module.exports.loop = function () {
    clearDeadCreeps();
    runNormalState();
}

//if nothing special is happening run this tree. IMPLEMENT: other trees
function runNormalState() {
    
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
        var spawn = Game.getObjectById(mainSpawns[spawnRoomName]);
         if(spawn != null && spawn.spawning == null || (spawn != null && spawn.spawning != null && spawn.spawning.name != name)) { //if this creep is not spawning
            if(creep.memory.role != undefined) {
                if(creep.memory.role == 'harvester') {
                 roleHarvester.run(creep);
                } else if(creep.memory.role == 'upgrader') {
                    roleUpgrader.run(creep, southContainerID[spawnRoomName], upgraderLinkID[spawnRoomName]);
                } else if(creep.memory.role == 'builder') {
                    roleBuilder.run(creep, storageID[spawnRoomName], containerAndStorageIDs[spawnRoomName], containerFillFactor[spawnRoomName], builderIdlePos[spawnRoomName][0], builderIdlePos[spawnRoomName][1]);
                } else if(creep.memory.role == 'melee') {
                    roleMelee.run(creep);
                } else if(creep.memory.role == 'transporter') {
                    roleTransporter.run(creep, containerIDs[spawnRoomName], containerAndStorageIDs[spawnRoomName], towerIDs[spawnRoomName], minCapLinkIDs[spawnRoomName], transporterMainContainer[spawnRoomName], storageID[spawnRoomName]);
                } else if(creep.memory.role == 'containerHarvesterNorth') {
                    roleContainerHarvester.run(creep, northSourceID[spawnRoomName], northContainerID[spawnRoomName], undefined);
                } else if(creep.memory.role == 'containerHarvesterSouth') {
                    roleContainerHarvester.run(creep, southSourceID[spawnRoomName], southContainerID[spawnRoomName], harvestLinkID[spawnRoomName]);
                } else if(creep.memory.role == 'mineralHarvester') {
                    roleMineralHarvester.run(creep, '577ca559b556d7683da9f635', ['577c993cb3a06602076bd71e'], undefined, '576a9d5b7f58551641fcb95b');
                } else if(creep.memory.role == 'specialAttack-Melee') {
                    roleSpecialAttackMelee.run(creep);
                } else if(creep.memory.role == 'otherRoomHarvester') {
                    roleOtherRoomHarvester.run(creep, distanceHarvesterSources[spawnRoomName], storageID[spawnRoomName], distanceHarvesterSourceFlags[spawnRoomName]);
                } else if(creep.memory.role == 'reserver') {
                    roleReserver.run(creep, storageID[spawnRoomName], distanceHarvesterControllerFlags[spawnRoomName]);
                } else if(creep.memory.role == 'pioneer') {
                    rolePioneer.run(creep, storageID[spawnRoomName], pioneerFlags[spawnRoomName]);
                }
            } 
        }
    }
}

function clearDeadCreeps() {
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
}