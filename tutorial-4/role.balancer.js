/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.balancer');
 * mod.thing == 'a thing'; // true
 */
var containerIDs = ['5775d7690905cd942b576c92','5773cc3684ed25e4699c070c', '57745542b6d085646bee57cf','5773f5d774e2c6695fefdb07','5774a3eee708dff8010e0735' ];
var containerEnergy = [0,0,0,0];// container from top to down
var storageID = '5772838880db66a6420cf328'; //TODO
var storageEnergy = [0];
var towerIDs = ['5773e3fae6d164973b320b2c'];

var idlePosX = 35;
var idlePosY = 31;

var minEnergyLimit = 200;
var minStorageLimit = 1000;


//######################################## job is to keep the containers filled
var roleBalancer = {
    
    run: function(creep) {
       
	    
	} // end of run: function(creep) {..}
	
	
}; // end of roleBalancer


//################# helping functions
// returns Container Object > minEnergyLimit
function getClosestContainer(creep, minEnergyLimit) {
    var conn = [];
    for(var i = 0; i < containerIDs.length; ++i) {
        var con = Game.getObjectById(containerIDs[i]); 
        if(_.sum(con.store) > minEnergyLimit) {
            conn[conn.length] = Game.getObjectById(containerIDs[i]);
        }
    }
    var closest = creep.pos.findClosestByRange(conn);
    //console.log('xx ' + con);
    
    return closest;
}

// returns a Tower object 
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

// returns true or false; says if the balancer should go balancing or not
// true => system is balanced, false => creeps should go and balance
// tolerance = percentage of how much the container content is allowed to differ
function checkBalance(creep, tolerance) {
    
    for(var i = 0; i < containerIDs.length; ++i) {
        var container = Game.getObjectById(containerIDs[i]); 
        if(_.sum(container.energy) < _.sum(container.energyCapacity) - energyLimit) {
            containerEnergy[i]=_.sum(container.energy);
        }
    }
    
   lowest=containerEnergy[i];
   for(var i = 0; i < containerEnergy.length; ++i) {
       if(lowest < containerEnergy[i]) {
           lowest = containerEnergy[i];
       }
   }
    
    //if the lowerst is more than tolerance (20%) lower than the average of containers
    if(lowest <= ((tolerance/100) * (_.sum(containerEnergy)/containerEnergy.length))) {
        return true;
    } else {
        return false;
    }
}

// fills a tower with energy
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
            var idlePos = creep.room.controller; //TODO
               goto(creep, stateChanged, idlePos );
               //creep.move(TOP | BOTTOM);
               
        }
        
    //fill tower
    } else {
        if(creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            goto(creep, stateChanged, tower);
    }
}
    
module.exports = roleBuilder;