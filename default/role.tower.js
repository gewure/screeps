var utils = require('utils');
//var minWallHitpoints = 350000;//345000;
//var minRampartHitpoints = 300000;//257000;
//var minRoadPoints = 4500;
//var minContainerPoints = 50000;
var towerAggroFaktor = 0;

var energySaveFaktor = 60;
var closestDamagedStructure;
var hostileCreeps;

// for dismantle
//var uselessWallIDs = [];

var roleTower = {
    
    run: function(tower, ulessWallIDs, closestDmgArr, hostCreeps) {
        uselessWallIDs = ulessWallIDs;
        hostileCreeps = hostCreeps;
        closestDamagedStructure = closestDmgArr;
        
        var badCreep = Game.getObjectById(hostileCreeps[0]);
        var badCreep2 = Game.getObjectById(hostileCreeps[1]);
        /*if(badCreep)
        if(utils.isFriendlyCreep(badCreep))
            badCreep = undefined;
        if(badCreep2)
         if(utils.isFriendlyCreep(badCreep2))
            badCreep2 = undefined; */
            
        if(tower) {
           // var hostileCreeps = tower.room.find(FIND_HOSTILE_CREEPS);
           
            if(hostileCreeps.length > 0 ) { //TODO rewrite for healer and attack if under range 20
                    energySaveFaktor = 0; // use  up to 97% of energy
                    if(hostileCreeps.length > 1){
                        if((Game.time%2)==0) {
                            tower.attack(badCreep);
                        }else {
                            tower.attack(badCreep2);
                        }
                    } else {
                        tower.attack(badCreep);

                    }
            } else {
                energySaveFaktor = 60; // use up to 28% of energy
                //save energy for attacks, to deal instantly dmg
                if(tower.energy > tower.energyCapacity * (energySaveFaktor/100)) {

                /*var closestDamagedStructure = tower.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_ROAD && structure.hits < minRoadPoints) || 
                                (structure.structureType == STRUCTURE_WALL && structure.hits < minWallHitpoints)|| 
                                (structure.structureType == STRUCTURE_RAMPART && structure.hits < minRampartHitpoints) ||
                                (structure.structureType == STRUCTURE_STORAGE && structure.hits < structure.hitsMax*0.9) ||
                                (structure.structureType == STRUCTURE_CONTAINER &&structure.hits < minContainerPoints));
                    }, algorithm:'dijkstra'});  */
            
 
                    //console.log(closestDamagedStructure);
                    if(closestDamagedStructure.length > 1) {
                       // for(var i = 0; i < closestDamagedStructure.length; i++) {
                           //console.log('tower: '+tower.id + ' '+closestDamagedStructure[i]);
                           //for(var j = 0; j <uselessWallIDs.length; j++) {
                                // if not in the to-dismantle-list
                                //if( closestDamagedStructure[i].id.localeCompare(uselessWallIDs[j]) == false) {
                                   // console.log(closestDamagedStructure[i] + ' ==  ' + uselessWallIDs[j]);
                                    // console.log('tower '+ tower +' repairs '+ closestDamagedStructure[i]+' '+ closestDamagedStructure[i].hits+'/'+ closestDamagedStructure[i].hitsMax);
                                    tower.repair(Game.getObjectById(closestDamagedStructure[0]));
                                    //tower.say('pew!');
                                //} else {
                                    // console.log(closestDamagedStructure[i] + ' !=  ' + uselessWallIDs[j]);

                        //       }
                           // }
                        
                     }
                }
            } // end if enemies in the room
        } // end if tower     
        
      
    }
}

function defendRoom(roomName) {
    
    var hostiles = Game.room.find(FIND_HOSTILE_CREEPS);
    
    if(hostiles.length > 0) {
        var username = hostiles[0].owner.username;
        Game.notify(`User ${username} spotted in room ${roomName}`);
        var towers = Game.rooms[roomName].find(
            FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        towers.forEach(tower => tower.attack(hostiles[0]));
    }
}

function canInflictDamage(tower, creep, activeHealParts) {
    
}

function getHealer(tower, hostileCreeps) {
    //if hostile creeps are found inside the room
    var healer = undefined;
    for(var i = 0; i < hostileCreeps.length; ++i) {
        var healParts = getActiveBodyPartCount(hostileCreeps[i], HEAL);
        if(healParts > 0) {
            healer = [hostileCreeps[i], healParts]; 
            break;
        }
    }
    return healer;
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


module.exports = roleTower; 