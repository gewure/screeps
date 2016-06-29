var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleTransporter = require('role.transporter');
var roleMelee = require('role.melee');
var roleCollector = require('role.collector');
var roleContainerHarvester = require('role.containerHarvester');
var roleTower = require('role.tower');

var ticks=0;
var roomname = 'E36S28';
var armyCount = 0;
var isWar = false;
var allied = 'b0mmel';

var leftMineSlots = 3;
var rightMineSlots =4;

module.exports.loop = function () {
    ticks++;
    
    //########################### LOGGING INTERVALL
    if(ticks%20==0) {
        console.log('Room "'+roomname+'" has '+Game.rooms[roomname].energyAvailable+' energy');
    }

    //############################ memory management
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    //############################## run TOWER
    
    var tower = Game.getObjectById('5773e3fae6d164973b320b2c');
    roleTower.run(tower);

    //##############################UNITS arrays
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters: ' + harvesters.length);
    
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    console.log('Builders: ' + builders.length);
    
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    console.log('Upgraders: ' + upgraders.length);
    
    var melees = _.filter(Game.creeps, (creep) => creep.memory.role == 'melee');
    console.log('KILLERS: ' + melees.length);
    
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    //console.log('repairer: ' + repairers.length);
    
    var transporters = _.filter(Game.creeps, (creep) => creep.memory.role == 'transporter');
    console.log('transporters: ' + transporters.length);
    
    var collectors = _.filter(Game.creeps, (creep) => creep.memory.role == 'collector');
    console.log('collectors: ' + collectors.length);
    
    var containerHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'containerHarvester');
    console.log('containerHarvester: ' + containerHarvesters.length);
    
    //####################### RESPAWN Logic ########################################################################################
    
    var extensions = Game.spawns.ImNoobPlzDontKill.room.find(FIND_MY_STRUCTURES, {
      filter: { structureType: STRUCTURE_EXTENSION }
    });
    
    // TIER 6 ... > 600 Energy
     if(extensions.length >= 6) {
        if(harvesters.length < 1) {
            var newName = Game.spawns.ImNoobPlzDontKill.createCreep([WORK,WORK,CARRY,CARRY, CARRY, MOVE ,MOVE,MOVE, WORK], undefined, {role: 'harvester'});
            console.log('Spawning new harvester [TIER 6]');
        }
        
        else if(containerHarvesters.length < 2) {
            if(containerHarvesters.length %2 == 0) {
            var newCollector = Game.spawns.ImNoobPlzDontKill.createCreep([WORK, WORK, WORK, WORK,MOVE, MOVE, CARRY, CARRY, CARRY], undefined, {role:'containerHarvesterNorth'});
            console.log('Spawning a new ContainerHarvester [TIER 6] ');
            } else {
                var newCollector = Game.spawns.ImNoobPlzDontKill.createCreep([WORK, WORK, WORK, WORK,MOVE, MOVE, CARRY, CARRY, CARRY], undefined, {role:'containerHarvester'});
            console.log('Spawning a new ContainerHarvester [TIER 6] ');
            }
        }
        else if(transporters.length < 3) {
            var newTransporter = Game.spawns.ImNoobPlzDontKill.createCreep([MOVE,CARRY,CARRY,MOVE, MOVE, MOVE, CARRY, MOVE, MOVE, MOVE, MOVE, CARRY], undefined, {role:'transporter'});
            console.log('Spawning a new transporter [TIER 6] ');
        }
       else if(builders.length < 4) {
            var newBuilder = Game.spawns.ImNoobPlzDontKill.createCreep([WORK,WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE ,CARRY], undefined, {role:'builder'});
            console.log('Spawning a new builder [TIER 6]');
        }
        else if(upgraders.length < 3) {
            var newUpgrader = Game.spawns.ImNoobPlzDontKill.createCreep([WORK,WORK, CARRY, CARRY, CARRY,MOVE, MOVE, MOVE, CARRY, MOVE], undefined, {role:'upgrader'});
            console.log('Spawning a new upgrader [TIER 6] ');
        }
        else if(melees.length < armyCount) {
            var newUpgrader = Game.spawns.ImNoobPlzDontKill.createCreep([TOUGH, TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH, TOUGH,MOVE,MOVE, MOVE,MOVE,ATTACK, ATTACK, ATTACK, ATTACK, ], undefined, {role:'melee'});
            console.log('Spawning a new FIGHTER [TIER 6] ');
        }
         else if(collectors.length < 1) {
            var newCollector = Game.spawns.ImNoobPlzDontKill.createCreep([CARRY,CARRY,MOVE, MOVE, MOVE, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, {role:'collector'});
            console.log('Spawning a new collector [TIER 6] ');
        }
         else  if(repairers.length < -1) {
            var newRepairer = Game.spawns.ImNoobPlzDontKill.createCreep([WORK,CARRY,MOVE], undefined, {role:'repairer'});
            console.log('Spawning a new repairer  [TIER 6]');
        }
        
    }

// TIER  4... > 500 Energy 
     else if(extensions.length == 4) {
        if(harvesters.length < 4) {
            var newName = Game.spawns.ImNoobPlzDontKill.createCreep([WORK,WORK,CARRY, CARRY, MOVE ,MOVE,MOVE, WORK], undefined, {role: 'harvester'});
            console.log('Spawning new harvester [TIER 4]');
        }
        
       else if(builders.length < 4) {
            var newBuilder = Game.spawns.ImNoobPlzDontKill.createCreep([WORK,WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, CARRY], undefined, {role:'builder'});
            console.log('Spawning a new builder [TIER 4]');
        }
        else if(upgraders.length < 7) {
            var newUpgrader = Game.spawns.ImNoobPlzDontKill.createCreep([WORK,WORK, CARRY, CARRY, CARRY,MOVE, MOVE, MOVE], undefined, {role:'upgrader'});
            console.log('Spawning a new upgrader [TIER 4] ');
        }
        // 500 ... 11x tough = 8x TOUGH + 2x MOVE + 4x ATTACk 
        else if(melees.length < armyCount) {
            var newUpgrader = Game.spawns.ImNoobPlzDontKill.createCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,ATTACK, ATTACK, ATTACK, ATTACK, MOVE,TOUGH, TOUGH], undefined, {role:'melee'});
            console.log('Spawning a new FIGHTER [TIER 4] ');
        }
       else  if(repairers.length < -1) {
            var newRepairer = Game.spawns.ImNoobPlzDontKill.createCreep([WORK,CARRY,MOVE], undefined, {role:'repairer'});
            console.log('Spawning a new repairer  [TIER 4]');
        }
    
         else if(collectors.length < 1) {
            var newCollector = Game.spawns.ImNoobPlzDontKill.createCreep([CARRY,CARRY,MOVE, MOVE, MOVE, CARRY, MOVE, MOVE, MOVE, MOVE], undefined, {role:'collector'});
            console.log('Spawning a new collector [TIER 4] ');
        }
        
        else if(transporters.length < 1) {
            var newTransporter = Game.spawns.ImNoobPlzDontKill.createCreep([MOVE,CARRY,CARRY,MOVE, MOVE, MOVE, CARRY, MOVE, MOVE, MOVE], undefined, {role:'transporter'});
            console.log('Spawning a new transporter [TIER 4] ');
        }
    }
    // TIER 3 ... >  450 ENERGY
    else if(extensions.length == 3) {
        if(harvesters.length < 4) {
            var newName = Game.spawns.ImNoobPlzDontKill.createCreep([WORK,WORK,CARRY,MOVE,MOVE, WORK], undefined, {role: 'harvester'});
            console.log('Spawning new harvester [TIER 3]');
        }
        
       else if(builders.length < 5) {
            var newBuilder = Game.spawns.ImNoobPlzDontKill.createCreep([WORK,WORK, CARRY, CARRY, CARRY, MOVE, MOVE], undefined, {role:'builder'});
            console.log('Spawning a new builder [TIER 3]');
        }
        else if(upgraders.length < 6) {
            var newUpgrader = Game.spawns.ImNoobPlzDontKill.createCreep([WORK,WORK, CARRY, CARRY, CARRY,MOVE, MOVE], undefined, {role:'upgrader'});
            console.log('Spawning a new upgrader [TIER 3] ');
        }
        // 500 ... 11x tough = 8x TOUGH + 2x MOVE + 4x ATTACk 
        else if(melees.length < armyCount) {
            var newUpgrader = Game.spawns.ImNoobPlzDontKill.createCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,ATTACK, ATTACK, ATTACK, ATTACK, TOUGH, TOUGH], undefined, {role:'melee'});
            console.log('Spawning a new FIGHTER [TIER 3] ');
        }
       else  if(repairers.length < -1) {
            var newRepairer = Game.spawns.ImNoobPlzDontKill.createCreep([WORK,CARRY,MOVE], undefined, {role:'repairer'});
            console.log('Spawning a new repairer  [TIER 3]');
        }
    
         else if(collectors.length < 1) {
            var newCollector = Game.spawns.ImNoobPlzDontKill.createCreep([CARRY,CARRY,MOVE, MOVE, MOVE, CARRY, MOVE, MOVE, MOVE], undefined, {role:'collector'});
            console.log('Spawning a new collector [TIER 3] ');
        }
        
        else if(transporters.length < 1) {
            var newTransporter = Game.spawns.ImNoobPlzDontKill.createCreep([MOVE,CARRY,CARRY,MOVE, MOVE, MOVE, CARRY, MOVE, MOVE], undefined, {role:'transporter'});
            console.log('Spawning a new transporter [TIER 3] ');
        }
    // TIER 2 ... 400 ENERG
    } else if(extensions.length == 2){
        if(harvesters.length < 4) {
            var newName = Game.spawns.ImNoobPlzDontKill.createCreep([WORK,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'harvester'});
            console.log('Spawning new harvester ');
        }
        
       else if(builders.length < 5) {
            var newBuilder = Game.spawns.ImNoobPlzDontKill.createCreep([WORK, CARRY, CARRY,MOVE, MOVE], undefined, {role:'builder'});
            console.log('Spawning a new builder ');
        }
        else if(upgraders.length < 6) {
            var newUpgrader = Game.spawns.ImNoobPlzDontKill.createCreep([WORK,WORK,CARRY, CARRY,MOVE, MOVE], undefined, {role:'upgrader'});
            console.log('Spawning a new upgrader ');
        }
        
      else  if(melees.length < armyCount) {
            var newUpgrader = Game.spawns.ImNoobPlzDontKill.createCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,ATTACK, ATTACK, MOVE], undefined, {role:'melee'});
            console.log('Spawning a new FIGHTER ');
        }
       else  if(repairers.length < -1) {
            var newRepairer = Game.spawns.ImNoobPlzDontKill.createCreep([WORK,CARRY,MOVE], undefined, {role:'repairer'});
            console.log('Spawning a new repairer ');
        }
    
        else if(collectors.length < 1) {
            var newCollector = Game.spawns.ImNoobPlzDontKill.createCreep([CARRY,CARRY,MOVE, MOVE, MOVE, MOVE, CARRY, CARRY], undefined, {role:'collector'});
            console.log('Spawning a new collector ');
        }
        
        else if(transporters.length < 1) {
            var newTransporter = Game.spawns.ImNoobPlzDontKill.createCreep([CARRY, MOVE, MOVE, CARRY, ], undefined, {role:'transporter'});
            console.log('Spawning a new transporter ');
        }
        // TIER 0 ... Energy = 300
    } else {
        if(harvesters.length < 5) {
            var newName = Game.spawns.ImNoobPlzDontKill.createCreep([WORK,CARRY,WORK,CARRY,MOVE], undefined, {role: 'harvester'});
            console.log('Spawning new harvester ');
        }
        
       else if(builders.length < 4) {
            var newBuilder = Game.spawns.ImNoobPlzDontKill.createCreep([WORK, WORK, CARRY,CARRY, MOVE], undefined, {role:'builder'});
            console.log('Spawning a new builder ');
        }
        else if(upgraders.length < 7) {
            var newUpgrader = Game.spawns.ImNoobPlzDontKill.createCreep([WORK,CARRY, CARRY, CARRY,MOVE,MOVE], undefined, {role:'upgrader'});
            console.log('Spawning a new upgrader ');
        }
        
       else if(melees.length < armyCount) {
            var newUpgrader = Game.spawns.ImNoobPlzDontKill.createCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,ATTACK, ATTACK, MOVE], undefined, {role:'melee'});
            console.log('Spawning a new FIGHTER ');
        }
        else if(repairers.length < -1 ) {
            var newRepairer = Game.spawns.ImNoobPlzDontKill.createCreep([WORK,WORK,CARRY,MOVE], undefined, {role:'repairer'});
            console.log('Spawning a new repairer ');
        }
    
        else if(collectors.length < 1) {
            var newCollector = Game.spawns.ImNoobPlzDontKill.createCreep([CARRY,CARRY,MOVE, MOVE, MOVE, MOVE], undefined, {role:'collector'});
            console.log('Spawning a new collector ');
        }
        
        else if(transporters.length < 1) {
            var newTransporter = Game.spawns.ImNoobPlzDontKill.createCreep([CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, {role:'transporter'});
            console.log('Spawning a new transporter ');
        } 
    }

    //########################### ASSIGN ROLES #####################################################################################
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder'){
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'melee'){
            roleMelee.run(creep);
        }
         if(creep.memory.role == 'repairer'){
            roleRepairer.run(creep);
        }
        if(creep.memory.role == 'collector') {
            roleCollector.run(creep);
        }
        if(creep.memory.role == 'transporter') {
            roleTransporter.run(creep);
        }
        //if(creep.memory.role == 'containerHarvester') {
          //  roleContainerHarvester.run(creep);
        //}
        if(creep.memory.role.indexOf('containerHarvester') != -1) {
                roleContainerHarvester.run(creep);
            }
    }
    
    //############################################### ECONOMY : EXCESS Measures #######################
    

    
    //############################# DEFENSE TOWER ########################################################
   /* var tower = Game.getObjectById('5773e3fae6d164973b320b2c');
    if(tower) {
        
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
        
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }
     
    } */
    //############################### DEFENSE ARMY #######################################################
    
    
   /* if(melees.length > 0) {
        for(var fighter in melees) {
            var closestHostile = fighter.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            isWar = true; //WAR ON
            //if there is one enemy, pump out soldiers until there is no more enemy
            if(closestHostile) {
                ArmyCount++;
            } 
        }
    } */
}