var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleUpgrader = require('role.upgrader');

var ticks = 0;

module.exports.loop = function () {
     ticks++;
      for(var name in Game.rooms) {
        if(ticks % 5 ==0)
        console.log('Room "'+name+'" has '+Game.rooms[name].energyAvailable+' energy');
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
                    //    roleBuilder.run(creep);
            roleHarvester.run(creep);
        }
         if(creep.memory.role == 'harvesterSouth') {
            roleHarvesterSouth.run(creep);
            // roleUpgrader.run(creep);
             roleBuilder.run(creep);


        }
         if(creep.memory.role == 'builder') {
            roleBuilder.run(creep)       ;
        }
         if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);

        }
         if(creep.memory.role == 'contHarv2'){
        }
         if(creep.memory.role == 'contHarv1') {
            roleBuilder.run(creep);
        }
         if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
    
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
    
    var oldBuilders = _.filter(Game.creeps, (creep) => creep.memory.role == 'oldBuilder');
    console.log('oldBuilders : ' + oldBuilders.length);
    
    var attackers =_.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');
    console.log('attacker: '+ attackers.length);
    
    var exeHarvesters =_.filter(Game.creeps, (creep) => creep.memory.role == 'exeHarvester');
    console.log('exeHarvesters: '+ exeHarvesters.length);
    
    var exeHarvesters2 =_.filter(Game.creeps, (creep) => creep.memory.role == 'exeHarvester2');
    console.log('exeHarvesters2: '+ exeHarvesters2.length);
    
    var harvesterSouths =_.filter(Game.creeps, (creep) => creep.memory.role == 'harvesterSouth');
    console.log('harvesterSouth: '+ harvesterSouths.length);

    if(harvesters.length < 3) {
            var newName = Game.spawns.ImNoobPlzDontKill.createCreep([WORK,WORK, CARRY, MOVE], undefined, {role: 'harvester'});
            console.log('Spawning new harvester ');
        }
         
       else if(harvesterSouths.length < 0) {
            var newharvesterSouth = Game.spawns.ImNoobPlzDontKill.createCreep([WORK, MOVE, CARRY,CARRY, MOVE], undefined, {role:'harvesterSouth'});
            console.log('Spawning a new harvesterSouth ');
        }
        
       else if(builders.length < 3) {
            var newBuilder = Game.spawns.ImNoobPlzDontKill.createCreep([WORK, MOVE, CARRY,CARRY, MOVE], undefined, {role:'builder'});
            console.log('Spawning a new builder ');
        }
        else if(upgraders.length < 3) {
            var newUpgrader = Game.spawns.ImNoobPlzDontKill.createCreep([WORK,CARRY, CARRY,MOVE,MOVE], undefined, {role:'upgrader'});
            console.log('Spawning a new upgrader ');
        }
        
       else if(melees.length < 0) {
            var newUpgrader = Game.spawns.ImNoobPlzDontKill.createCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,ATTACK, ATTACK, MOVE], undefined, {role:'melee'});
            console.log('Spawning a new FIGHTER ');
        }
        else if(repairers.length < -1 ) {
            var newRepairer = Game.spawns.ImNoobPlzDontKill.createCreep([WORK,WORK,CARRY,MOVE], undefined, {role:'repairer'});
            console.log('Spawning a new repairer ');
        }
    
        else if(collectors.length < 0) {
            var newCollector = Game.spawns.ImNoobPlzDontKill.createCreep([CARRY,CARRY,MOVE, MOVE, MOVE, MOVE], undefined, {role:'collector'});
            console.log('Spawning a new collector ');
        }
        
        else if(transporters.length < 0) {
            var newTransporter = Game.spawns.ImNoobPlzDontKill.createCreep([CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, {role:'transporter'});
            console.log('Spawning a new transporter ');
        } 
}