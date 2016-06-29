var leftMine= '576a9cb857110ab231d899fa';
var rightMine='576a9cb857110ab231d899f8';

var controlSource = leftMine; //left mine
var state = 'spawned';
var roleUpgrader = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
        
        // death is awaiting
        if(creep.ticksToLive < 5) {
             state = 'very old';
            console.log(creep.name + " dies soon. state: " + state);
        }
        
        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	    }
	    
	    if(!creep.memory.upgrading) {
            //get closest resource
            var source = Game.getObjectById(controlSource);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
	}
};

module.exports = roleUpgrader;


/*
var roleUpgrader = {

   
    run: function(creep) {
        
        // death is awaiting
        if(this.ticksToLive < 50) {
            state = 'very old';
            console.log(creep.name + "dies soon. state: " + state);
        }
        
	    if(creep.carry.energy == 0) {
            var source = creep.pos.findClosestByPath(FIND_SOURCES);
            
            while(creep.carry.energy < creep.carryCapacity) {
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
        }
        else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
	}
}; */
