
var storageID = '57757544c779f4bf626f0c60';
var containerIDs = ['57745542b6d085646bee57cf', '5774a3eee708dff8010e0735', '5775d7690905cd942b576c92'];
var containerIDsWStorage = ['57745542b6d085646bee57cf', '5774a3eee708dff8010e0735','5775d7690905cd942b576c92', storageID];
var towerIDs = ['5773e3fae6d164973b320b2c'];

var container = undefined;
var untilPathRecalc = 2;
var reFillFactorFullContainer = 20;
var minEnergyLimit = 0;

var carryEnergy;
var idleX =29;
var idleY=37;

//war
var notArmed = true;
var fightMode = false;
var isCollectMode = true;
var isTransportMode = false;
var hitsLastTick = 100;

// collector can also fight a little :)
var roleCollector = {
    
    
    /* TODO
    
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
        
        
        
         if(creep.ticksToLive < 30) {
            if(!creep.pos.isNearTo(Game.flags['Base'])) {
                creep.moveTo(Game.flags['Base']); ///////<----------------
            } 
        }
        
        var activeCarryCount = getActiveBodyPartCount(creep, CARRY);
        var activeAttackCount = getActiveBodyPartCount(creep, RANGED_ATTACK);
        
        if(activeAttackCount > 0) {
            notArmed = false;
        }
        
        var closestHostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        
        if(creep.memory.state == undefined) creep.memory.state = 'fill';
        if(creep.memory.stillDistribute == undefined) creep.memory.stillDistribute = false;
        
        //################## WAR! we aree under attack, fight you collector ^^ 
        // FIGHT
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
                
            console.log('collector ' + creep.name + ' is in COLLECT mode ');
            fightMode = false;
            // proceed with collecting
        
           // var droppedRes = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
            
             var droppedRes = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                        filter: (resource) => {
                            return (resource.amount > creep.pos.getRangeTo(resource) *1.05)
                        }, algorithm:'dijkstra'
                });
          
            if(!droppedRes) { 
                isCollectMode = false;
                isTransportMode = true;
            } else if(droppedRes){
                isCollectMode = true;
                isTransportMode = false;
            }
            
            if(droppedRes && _.sum(creep.carry)<= 0.2*creep.carryCapacity) {
                 console.log('collector ' + creep.name + ' goes collecting at '+ droppedRes);
          
                if(_.sum(creep.carry) < creep.carryCapacity) {
                    if(creep.pickup(droppedRes)==ERR_NOT_IN_RANGE) {
                        creep.moveTo(droppedRes);
                    }
                }
            } else if (_.sum(creep.carry) <= 0.2*creep.carryCapacity) {
                
                // deliver to lowest CONTAINER first
                var target = getClosestLowContainer(creep,0);
                
                carryEnergy = creep.carry;
                //IF the closest Structure has room for loaded energy
                if(target) {
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                } else if(creep.carry==0) {
                    console.log('collector '+creep.name + ' delivered the drop: ' + carryEnergy);
                    console.log('collector '+creep.name + ' goes IDLE ');
                    
                }
                
                
                carryEnergy = 0;
                
                //ELSE deliver to Extensions, spawns, Towers
            }  else {
                 var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
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
                
                if(creep.carry==0) {
                    console.log('collector '+creep.name + ' delivered the drop: '+carryEnergy);
                }
            }
            // else TRANSPORT
        } else if(isTransportMode) {
            isCollectMode = false;
            isTransportMode = true;
            console.log('collector ' + creep.name + ' is in Transport mode');
            
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
            
            ///////////////////////////////
            //creep can't carry more, getClosest controller
            if(creep.carry.energy == creep.carryCapacity || (creep.memory.stillDistribute && creep.carry.energy > 0)) {
                
                creep.memory.state = 'distribute';
                var stateChanged = hasStateChanged(creep);
                distribute(creep, stateChanged, activeCarryCount);
                
            //creep has no energy, go to container
            } else if(creep.carry.energy < creep.carryCapacity) {
                
                //only collect if creep has more than x ticks to live
                if(creep.ticksToLive > 20) {
                    
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
        var container = getClosestHighEnergyContainer(creep, minEnergyLimit, containerIDsWStorage);
        if(container) {
            if(container.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                goto(creep, stateChanged, container);
            }
        }
    } else {
        var container = getClosestHighEnergyContainer(creep, minEnergyLimit, containerIDs);
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
        
        if(creep.carry.energy > ((creep.carryCapacity / 100) * reFillFactorFullContainer)) {
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

    if(closestTowerLowEnergy != null) {
        fillTower(creep, closestTowerLowEnergy, stateChanged);
            
    } //else if(_.sum(creep.room.storage.store) < creep.room.storage.storeCapacity)
        else if (_.sum(Game.getObjectById(containerIDs[2]).carry < Game.getObjectById(containerIDs[2]).carryCapacity)) {
        
        if(creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            goto(creep, stateChanged, creep.room.storage);
        }
    }
}

function fillTower(creep, tower, stateChanged) {
    
    //fill from storage
    if(creep.carry.energy < creep.carryCapacity) {
        
        var container = getClosestHighEnergyContainer(creep, minEnergyLimit, containerIDsWStorage);
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
    for(var i = 0; i < creepBody.length; ++i) {
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
        if(_.sum(container.store) > minEnergyLimit) 
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