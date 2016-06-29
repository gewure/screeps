var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMelee = require('role.melee');
var roleTower = require('role.tower');
var roleContainerHarvester = require('role.containerHarvester');
var roleTransporter = require('role.transporter');

var logicRespawn = require('logic.respawn');

var clearCreepsTime = 50;

var southSourceID = '576a9cd857110ab231d89d0e';
var northSourceID = '576a9cd857110ab231d89d0c';
var northContainerID = '57715701c2c8c47d7dca357a';
var southContainerID = '5770b7ece2a9e041522a21a9';
var storageID = '5772838880db66a6420cf328';
var containerIDs = [northContainerID, southContainerID];
var containerAndStorageIDs = [northContainerID, southContainerID, storageID];
var towerIDs = ['576f44f45ab22ea71eb7bf36'];

preRunWork();

module.exports.loop = function () {
    runNormalState();
    clearDeadCreeps();
}

//if nothing special is happening run this tree. IMPLEMENT: other trees
function runNormalState() {
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role != undefined) {
            if(creep.memory.role == 'harvester') {
             roleHarvester.run(creep);
            }
            if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep, southContainerID);
            }
             if(creep.memory.role == 'builder') {
                 roleBuilder.run(creep, storageID, containerAndStorageIDs);
             }
            if(creep.memory.role == 'melee') {
                roleMelee.run(creep);
            }
            if(creep.memory.role == 'transporter') {
                 roleTransporter.run(creep, containerIDs, containerAndStorageIDs, towerIDs);
             }
            if(creep.memory.role.indexOf('containerHarvester') != -1) {
                roleContainerHarvester.run(creep, northSourceID, northContainerID, southSourceID, southContainerID);
            }
        } else {
            
        }
    }
    
    var tower = Game.getObjectById('576f44f45ab22ea71eb7bf36');
    roleTower.run(tower);
    logicRespawn.run();
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