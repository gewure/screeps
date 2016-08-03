
var storageID = '577b2f88e03b2946707baba5';
var containerIDs = ['57796949720916567dc376ca', '5779cfd7986f591c34eadf9a', '5779b1268eef705e48c33a6e', '577acd04d33b4b4d0f4bf616']; //'577af4e8502328d4276d1a7d'
var contStorIDs = ['57796949720916567dc376ca', '5779b1268eef705e48c33a6e', '5779cfd7986f591c34eadf9a', '577acd04d33b4b4d0f4bf616','577b2f88e03b2946707baba5']; //'577af4e8502328d4276d1a7d', 
var towerIDs = ['5779f6286ce428014acf2e71', '577ecaedd47f7a6d1f04ec04'];

var container = undefined;
var untilPathRecalc = 2;
var reFillFactorFullContainer = 20;
var minEnergyLimit = 100;

var carryEnergy;
var idleX =29;
var idleY=37;

//war
var notArmed = true;
var fightMode = false;
var isCollectMode = true;
var isTransportMode = false;
var hitsLastTick = 100;

// collector can also fight a little  - if he is armed:)
var roleCollector = {
    
    /* TODO could i reworkd this code? i could maybe..
    
    checkForFight();
    
    if(fight){
        while(fight) {
            fightMode();
        }
    } else {
         if(checkForDroppedRes()) {
             collectMode();
         } else if (checkForTowerfill()) {
            towerFill();
         } else if(checkForDistribute) {
             distribute();
         } else {
             idle();
         }
    } 
    
    */
    
    run: function(creep, contIDs, contStorIDs, towIDs) {
        containerIDs = contIDs;
        containerIDsWStorage = contStorIDs;
        towerIDs = towIDs;
        
        creep.memory.reFillFactorFullContainer=reFillFactorFullContainer;
        creep.memory.minEnergyLimit = minEnergyLimit;
        
        //##################### DEATH logic
         /*if(creep.ticksToLive < 30) {
            if(!creep.pos.isNearTo(Game.flags['Base'])) {
                creep.moveTo(Game.flags['Base']); ///////<----------------
            } 
        } */
        
        var activeCarryCount = getActiveBodyPartCount(creep, CARRY);
        var activeAttackCount = getActiveBodyPartCount(creep, RANGED_ATTACK);
        
        if(activeAttackCount > 0) {
            notArmed = false;
        }
        
        // look for ENEMIES 
        var closestHostiles = [];//= creep.room.find(FIND_HOSTILE_CREEPS);
        
        if(creep.memory.state == undefined) creep.memory.state = 'fill';
        if(creep.memory.stillDistribute == undefined) creep.memory.stillDistribute = false;
        
        //################## WAR! we aree under attack, if armed, he may fight,
        //if not armed he supports the cannon better
        if(closestHostiles.length > 0) {
            creep.memory.reFillFaktorFullContainer = 20;
            creep.memory.minEnergyLimit = 50;
        } else {
            creep.memory.reFillFactorFullContainer = 20;
            creep.memory.minEnergyLimit = minEnergyLimit;
        }
        
        // FIGHT MODE-- because the drone is armed and there are enemies in the room
        if(closestHostiles.length > 0 && !notArmed) {
             
             isCollectMode = false;
             isTransportMode = false;

            console.log(' collector ' + creep.name +'goes FIGHTING! :O enemies: ' + closestHostiles );
            fightMode = true;
            
            var healer = getHealer(creep, closestHostiles);
            creep.moveTo(healer);
            console.log('healer '+healer);
            
 
                if(creep.memory.freshSpawn == undefined) {
                    creep.memory.freshSpawn = true;
                }
                
                // if not a fresh spawn
                if(!creep.memory.freshSpawn) {
        
                    var closestHostiles = creep.room.find(FIND_HOSTILE_CREEPS);
                    
                    if(creep.hits <= 100) {
                        fightMode = false;
                        patrol(creep);
                    }
                   
                  //  var healer = getHealer(creep, closestHostiles);
                    
                    if(healer) {
                        if(canInflictDamage(creep, healer[0], healer[1])) {
                                creep.rangedAttack(healer);
                        } else {
                                console.log('cant deal damage');
                        }
                            
                    }else if(creep.rangedAttack(closestHostiles[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(closestHostiles[0]);
                    } else {
                        creep.attack(closestHostiles[0]);
                        creep.rangedAttack(closestHostiles[0]);
                        //if counterattacked: calculate direction of attack and move 1 step in other direction
                        if(creep.hits < hitslastTick) {
                            hitslastTick = creep.hits;
                            var dirToAvaidAttack = closestHostiles[0].getDirectionTo(creep);
                            creep.move(dirToAvaidAttack);
                        }   
                    }
                    // move to spawn position
                } else {
                    if(!creep.pos.isNearTo(idleX, idleY)) {
                        creep.moveTo(idleX, idleY, {reusePath: true});
                    } else {
                        creep.memory.freshSpawn = false;
                        creep.say('ready');
                    }
                
                }
     
                
           //################# PEACE  
           // COLLECT
        }  else if(isCollectMode) {
                if(closestHostiles > 1) {
                    collectmode = false;
                    transportmode = true;
                    
                } else {
                    collectMode = true;
                    transportmode=false;
                }
            //console.log('collector ' + creep.name + ' is in COLLECT mode ');
            fightMode = false;
            // proceed with collecting
        
           // var droppedRes = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
           
           // if creep can't carry anymore
           if(_.sum(creep.carry) == creep.carryCapacity) {
               
               /*
                var returnval = creep.transfer(stor, RESOURCES_ALL);
                console.log(returnval);
                if(stor) {
                        if(creep.transfer(stor, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(stor);
                        }
                } // deprecated, but just in case.... */
                
                
                 // one of the cooler snippets i found so far
                 var stor = Game.getObjectById(storageID);
                 
                    if(!creep.pos.isNearTo(stor)) {
                        creep.moveTo(stor, {reusePath:2});
                    } else { // is near storage, transfer _all_ resources
                        Object.keys(creep.carry).map((resource) => { creep.transfer(stor, resource) });
                        console.log('Collector transfered _all_ resources to storage');
                    }
            
               
           }
            
            
            var droppedRes = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                        filter: (resource) => {
                            return (resource.amount > creep.pos.getRangeTo(resource) *1.25);
                        }, algorithm:'dijkstra'
            });
            ///console.log(droppedRes);

            if(!droppedRes) { 
                isCollectMode = false;
                isTransportMode = true;
            } else if(droppedRes){
                isCollectMode = true;
                isTransportMode = false;
            }
            
            if(droppedRes && _.sum(creep.carry)< creep.carryCapacity) {
                 console.log('collector ' + creep.name + ' goes collecting at '+ droppedRes);
                creep.say('yo: '+droppedRes.amount, true);
                if(_.sum(creep.carry) < creep.carryCapacity) {
                    if(creep.pickup(droppedRes)==ERR_NOT_IN_RANGE) {
                        creep.moveTo(droppedRes);
                    }
                }
            } else if (_.sum(creep.carry) < creep.carryCapacity) {
                
                // deliver to lowest CONTAINER first
                var target = getClosestLowContainer(creep,0);
                
                carryEnergy = creep.carry.energy;
                //IF the closest Structure has room for loaded energy
                if(target) {
                    
                    // one of the cooler snippets i found so far
                    if(!creep.pos.isNearTo(target)) {
                        creep.moveTo(target);
                        creep.say('contTarget: '+target);
                    } else { // is near storage, transfer _all_ resources
                        
                        Object.keys(creep.carry).map((resource) => { creep.transfer(target, resource) });
                    }
                    
                    //################################ i *think* this code is deprecated, but just in case.. 
                    /*if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        //console.log('hereeer');
                        creep.moveTo(target);
                    } */
                    
                    
                } else if(creep.carry==0) {
                    console.log('collector '+creep.name + ' delivered the drop: ' + carryEnergy);
                    console.log('collector '+creep.name + ' goes IDLE ');
                    
                }
                
                
                carryEnergy = 0;
                
                //ELSE deliver to Extensions, spawns, Towers
            }  else { 
                creep.say('to low Cont ', true);
                //var container = creep.pos.findClosestByRange(FIND_STRUCTURES)
                 var targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (( structure.structureType == STRUCTURE_LINK ) && structure.energy + creep.carry.energy < structure.energyCapacity);
                    }
                    });
                var stor = Game.getObjectById(storageID);
                
                if(targets) {
                    
                    if(!creep.pos.isNearTo(targets)) {
                        creep.moveTo(targets);
                    } else { // is near storage, transfer all resources
                        Object.keys(creep.carry).map((resource) => { creep.transfer(targets, resource) });
                        //console.log('has this worked?! I hope so!');
                    }
                }
                      /*  if(creep.transfer(stor,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(stor);
                            console.log('blablabla')
                        } */
                 
                
                // creep.carry.map((resource) => { creep.transfer(storage, resource) }); ???`????????????
            
                /* var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
                                (structure.energy < structure.energyCapacity);
                        }, algorithm:'dijkstra'
                });
                
                carryEnergy = creep.carry;
                 
                //IF the closest Structure has room for loaded energy
                if(target) {
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                    
                } 
                
                
                */
                
                if(creep.carry==0) {
                    console.log('collector '+creep.name + ' delivered the drop: '+carryEnergy);
                } 
            }
            // else TRANSPORT MODE
        } else if(isTransportMode) {
            creep.say('transport',true);
            isCollectMode = false;
            isTransportMode = true;
            
            if(fillTower(creep, towerIDs[0]) == ERR_NOT_IN_RANGE) {
                moveTo(towerIDs[0]);
            }
            
            var droppedRes = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
            
            if(!droppedRes) { 
                isCollectMode = false;
                isTransportMode = true;
            } else {
                isCollectMode = true;
                isTransportMode = false;
            }
            
           //  console.log('collector ' + creep.name + ' is in TRANSPORT mode');
             
            ///////////////////////////////
            //creep can't carry more, getClosest controller
            if(creep.carry.energy == creep.carryCapacity || (creep.memory.stillDistribute && creep.carry.energy > 0)) {
                
                creep.memory.state = 'distribute';
                var stateChanged = hasStateChanged(creep);
                distribute(creep, stateChanged, activeCarryCount);
                
            //creep has no energy, go to container
            } else if(creep.carry.energy < creep.carryCapacity) {
                
                //only collect if creep has more than x ticks to live
                if(creep.ticksToLive > 30) {
                    
                    creep.memory.state = 'fill';
                    var stateChanged = hasStateChanged(creep);
                    fillFromContainer(creep, stateChanged, activeCarryCount);
                } 
            } 
            
            creep.memory.stateBefore = creep.memory.state;
            /////////////////////////////
            
        }
    }
};
    
    
//###################### HELPING FUNCTIONS


//#######################for WAR
function getHealer(creep, hostileCreeps) {
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
    
function patrol(creep) {
    
    while(!fightMode) {
        creep.moveTo(21,23);
        creep.moveTo(34,31);
        creep.moveTo(37,10);
    }
    return;
}

function canInflictDamage(creep, hostileCreep, activeHealParts) {
    
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
    
//#####################for peace
function getClosestLowEnergyTower(creep, energyLimit) {
    var closestArray = [];
    for(var i = 0; i < towerIDs.length; ++i) {
        var tower = Game.getObjectById(towerIDs[i]); 
        if(tower.energy < tower.energyCapacity - energyLimit) {
            closestArray[closestArray.length] = tower;
        }
    }
    var closest = creep.pos.findClosestByRange(closestArray);
    return closest;
}    
    
// returns a Container Object - energy Limit is min for container.energy
function getClosestLowContainer(creep, energyLimit) {
    var closestArray = [];
    for(var i = 0; i < containerIDs.length; ++i) {
        var container = Game.getObjectById(containerIDs[i]); 
        if(_.sum(container.energy) < _.sum(container.energyCapacity) - energyLimit) {
            closestArray[closestArray.length] = container;
        }
    }
    var closest = creep.pos.findClosestByRange(closestArray);
    return closest;
}

//##################### for TRANSPORT mode from transporter code.

function fillFromContainer(creep, stateChanged, activeCarryCount) {
    
    var emptyExtensions = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
                    }, algorithm:'dijkstra'});
    
    if(emptyExtensions.length > 0) {
        var container = getClosestHighEnergyContainer(creep, creep.memory.minEnergyLimit, containerIDsWStorage);
        if(container) {
            if(container.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                goto(creep, stateChanged, container);
            }
        }
    } else {
        var container = getClosestHighEnergyContainer(creep, creep.memory.minEnergyLimit, containerIDs);
        if(container) {
            if(container.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                goto(creep, stateChanged, container);
            }
        }
    }
}

function distribute(creep, stateChanged, activeCarryCount) {
    //HIER UMSCHREIBEN IN EINZELNE IF-bedingung um mehrere objekte auszuschließen (liste der targets der anderen transporter wenn ziel kapazität überschreiten würde)
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_STORAGE || 
                                structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
    }, algorithm:'dijkstra'});
    
    if(target != null) {
        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            goto(creep, stateChanged, target);
        } else {
            //walk back NOW
        }
        
        if(creep.carry.energy > ((creep.carryCapacity / 100) * creep.memory.reFillFactorFullContainer)) {
            creep.memory.stillDistribute = true;
        } else {
            creep.memory.stillDistribute = false;
        }
    
    //transfer energy from storage to tower if tower has less energy than the transporter can carry. if tower has enough, transfere rest to big storage 
    } else {
        checkForTowerFill(creep, stateChanged, activeCarryCount);
    }
}

function checkForTowerFill(creep, stateChanged, activeCarryCount) {
    var closestTowerLowEnergy = getClosestLowEnergyTower(creep, activeCarryCount * 50);

try {
    if(closestTowerLowEnergy != null) {
        fillTower(creep, closestTowerLowEnergy, stateChanged);
            
    } //else if(_.sum(creep.room.storage.store) < creep.room.storage.storeCapacity)
        else if (_.sum(Game.getObjectById(containerIDs[2]).carry < Game.getObjectById(containerIDs[2]).carryCapacity)) {
        
        if(creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            goto(creep, stateChanged, creep.room.storage);
        }
    }
} catch (noStorageYetException) {
    console.log('no storage yet exception at collector line 388');
}
}

function fillTower(creep, tower, stateChanged) {
    
    //fill from storage
    if(creep.carry.energy < creep.carryCapacity) {
        
        var container = getClosestHighEnergyContainer(creep, creep.memory.minEnergyLimit, containerIDsWStorage);
        //if a non-empty container exists, go there
        if(container) {
            if(container.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                goto(creep, stateChanged, container);
            }
        //all storages are empty, idle at storage
        } else {
            console.log('transporter '+ creep.name + ' wants to idle');
            
           var droppedRes = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
            
            if(!droppedRes) { 
                isCollectMode = false;
                isTransportMode = true;
            } else {
                isCollectMode = true;
                isTransportMode = false;
            }
            
            //var idlePos = creep.room.controller; //TODO
              // goto(creep, stateChanged, idlePos );
               //creep.move(TOP | BOTTOM);
               
        }
        
    //fill tower
    } else {
        if(creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            goto(creep, stateChanged, tower);
    }
}


function getActiveBodyPartCount(creep, part) {
    var carryPartsCount = 0;
    var creepBody = creep.body;
    for(var i = 0; i < creepBody; ++i) {
        if(creepBody[i].type == part) {
            ++carryPartsCount;
        }
    }
    return carryPartsCount;
}

function getClosestHighEnergyContainer(creep, minEnergyLimit, idArray) {
    var closestArray = [];
    for(var i = 0; i < idArray.length; ++i) {
        var container = Game.getObjectById(idArray[i]); 
        if(container.store.energy > creep.memory.minEnergyLimit) 
            closestArray[closestArray.length] = container;
    }
    var closest = creep.pos.findClosestByRange(closestArray);
    return closest;
}

function getClosestLowEnergyTower(creep, energyLimit) {
    var closestArray = [];
    for(var i = 0; i < towerIDs.length; ++i) {
        var tower = Game.getObjectById(towerIDs[i]); 
        if(tower.energy < tower.energyCapacity - energyLimit) {
            closestArray[closestArray.length] = tower;
        }
    }
    var closest = creep.pos.findClosestByRange(closestArray);
    return closest;
}

function goto(creep, stateChanged, target) {
    if(creep.memory.containerPath == undefined || stateChanged) {
        var path = newPath(creep, target);
        creep.memory.containerPath = path;
    }
    var gotoResult = 0;
    if((gotoResult = creep.moveByPath(creep.memory.containerPath)) != -11) {
        //if path is blocked, count
        if(creep.pos.x == creep.memory.prevX && creep.pos.y == creep.memory.prevY) {
            
            if(creep.memory.pathRecalcCount == undefined) {
                creep.memory.pathRecalcCount = 0;
            }
            
            if(++creep.memory.pathRecalcCount >= untilPathRecalc) {
               
                creep.memory.containerPath = undefined;
                creep.memory.pathRecalcCount = 0;
            }
        } else {
            creep.memory.pathRecalcCount = 0;
        } 
        creep.memory.prevX = creep.pos.x;
        creep.memory.prevY = creep.pos.y;
    }
}

function hasStateChanged(creep) {
    if(creep.memory.state != creep.memory.stateBefore)
        return true;
    else return false;
}

function newPath(creep, target) {
    return creep.pos.findPathTo(target, {algorithm: 'astar'});
}

module.exports = roleCollector;