var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMelee = require('role.melee');
var roleTower = require('role.tower');
var roleContainerHarvester = require('role.containerHarvester');
var roleTransporter = require('role.transporter');
var logicRespawn = require('logic.respawn');
var logicLinkUpgrader = require('logic.linkSend');

var clearCreepsTime = 50;

var southSourceID = '576a9cd857110ab231d89d0e';
var northSourceID = '576a9cd857110ab231d89d0c';
var northContainerID = '57715701c2c8c47d7dca357a';
var southContainerID = '5770b7ece2a9e041522a21a9';
var storageID = '5772838880db66a6420cf328';
var containerIDs = [northContainerID, southContainerID]; //IF more energy is required, add id of secont harvest container
var containerAndStorageIDs = [northContainerID, southContainerID, storageID];
var towerIDs = ['576f44f45ab22ea71eb7bf36', '577498bad263b01f305db4ea'];
var harvestLinkID = '577484b08bf1541b4fc49eb5';
var upgraderLinkID = '57748e0ad11ec119099d8d36';

var allied = ['Gewure'];

var roles = ['containerHarvesterNorth', 'transporter', 'containerHarvesterSouth', 'builder', 'upgrader'];
var maxCreepsPerRole = [1, 2, 1, 1, 1];
var creepBodyParts = [  [WORK, CARRY, WORK, MOVE, WORK, MOVE, WORK, WORK, MOVE],
                        [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE], 
                        [WORK, MOVE, WORK, WORK, MOVE, WORK, CARRY, WORK, MOVE],
                        [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE], 
                        [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]];



preRunWork();
module.exports.loop = function () {
    runNormalState();
    clearDeadCreeps();
}

//if nothing special is happening run this tree. IMPLEMENT: other trees
function runNormalState() {
    
    assignRolelessCreep();
    logicLinkUpgrader.run(harvestLinkID, upgraderLinkID);
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role != undefined) {
            if(creep.memory.role == 'harvester') {
             roleHarvester.run(creep);
            } else if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep, upgraderLinkID);
            } else if(creep.memory.role == 'builder') {
                 roleBuilder.run(creep, storageID, containerAndStorageIDs);
            } else if(creep.memory.role == 'melee') {
                roleMelee.run(creep);
            } else if(creep.memory.role == 'transporter') {
                 roleTransporter.run(creep, containerIDs, containerAndStorageIDs, towerIDs);
            } else if(creep.memory.role == 'containerHarvesterNorth') {
                roleContainerHarvester.run(creep, northSourceID, northContainerID, undefined);
            } else if(creep.memory.role == 'containerHarvesterSouth') {
                roleContainerHarvester.run(creep, southSourceID, southContainerID, harvestLinkID);
            }
        } 
    }
   
    for(var i = 0; i < towerIDs.length; ++i) {
        roleTower.run(Game.getObjectById(towerIDs[i]));
    }
    logicRespawn.run(roles, maxCreepsPerRole, creepBodyParts);
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
    
    for(var i = roleCount.length - 1; i >= 0; --i) {
        if(roleCount[i][1] > missingCount) {
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