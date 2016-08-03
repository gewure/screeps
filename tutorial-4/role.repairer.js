/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.repairer');
 * mod.thing == 'a thing'; // true
 */

var leftMine= '576a9cb857110ab231d899fa';
var rightMine='';
var wallHitpointsGoal = 15000;
    
var roleRepairer = {
   
 

    /** @param {Creep} creep **/
    run: function(creep) {
        
         if(creep.carry.energy < 0.9*creep.carryCapacity) {
            //var sources = creep.room.find(FIND_SOURCES);
      
            closestSource = Game.getObjectById(leftMine);
    
                //MOVE TO THE CLOSES SOURCE TODO: alternatev left -right random
                if(creep.harvest(closestSource)==ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestSource);
                }
        } 
        
    //if(creep.energy === 0) {
      //  var spawn = creep.pos.findClosest(FIND_MY_SPAWNS);
        //var moveResult = creep.moveTo(spawn);
        /*
          check moveResult here
        */
        //if( spawn.energy > 199) {
          //  var transferResult = spawn.transferEnergy(creep);
            /*
                check transferResult here
            */
    //}
        else {
            console.log(creep.name + ' is looking for structures to repair');
            var roadToRepair = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: function(object){
                    return object.structureType === STRUCTURE_ROAD && (object.hits < object.hitsMax);
                }, algorithm:'dijkstra' 
            });
        
            if (roadToRepair){
                console.log(creep.name + ' found something to repair');
                creep.moveTo(roadToRepair);
                creep.repair(roadToRepair);
        
                // perhaps check the results again?
        
            } else {
                 console.log(creep.name + ' repairs walls ');

                var wallToRepair = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: function(object){
                        return object.structureType === STRUCTURE_WALL && (object.hits < wallHitpointsGoal );
                    } 
                });
            
                if (wallToRepair){
                    console.log(creep.name + ' found something to repair');
                    creep.moveTo(wallToRepair);
                    creep.repair(wallToRepair);
            
                    // perhaps check the results again?
            
                    // nothing to repair, let's do something else?
            
                }
            } 
        }
    }
};


module.exports = roleRepairer;