//var dismantleTargetIDs= ['57798576404ef95707d29f5e'];
var storageID = '577b2f88e03b2946707baba5';

var roleDismantler = {
 
    run: function(creep, disTargIDs) {
        

        dismantleTargetIDs=disTargIDs;
        
        console.log('dismantle something!');
        /*if(creep.ticksToLive == 50) {
            Game.spawns.ImNoobPlzDontKill.createCreep([WORK,WORK,WORK, WORK,WORK,WORK,CARRY,WORK,WORK, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY,MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, {role:'dismantler'});
        } */
        
        if(creep.carry.energy < creep.carryCapacity) {

            for(var i = 0; i< dismantleTargetIDs.length; i++) {
        
                dismantle(creep, dismantleTargetIDs[i]);
                
                /* pickup the dropped resources
                 var droppedRes = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                        filter: (resource) => {
                            return (resource.amount > creep.pos.getRangeTo(resource) *1.50);
                        }, algorithm:'dijkstra'
                });
    
                if(droppedRes && _.sum(creep.carry)< creep.carryCapacity) {
                    if(droppedRes.amount >= 50) {
                         console.log('dismantler ' + creep.name + ' goes collecting at '+ droppedRes);
                  
                        if(creep.pickup(droppedRes)==ERR_NOT_IN_RANGE) {
                            creep.moveTo(droppedRes);
                        }
                    }
                } */
            }
        } else {
            // GOTO SOME CONTAINER OR SO
            //if(creep.carry.energy ==creep.carryCapacity)
            //creep.drop(RESOURCE_ENERGY, 100);
            var targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_CONTAINER
                        || structure.structureType == STRUCTURE_STORAGE 
                        || structure.structureType == STRUCTURE_TOWER) && ( _.sum(structure.energy) < _.sum(structure.energyCapacity)+creep.carry.energy));
                    }
            });
            console.log('target energy: '+ targets.energy + ' / ' + targets.energyCapacity);
            if(targets != null) {
                if(creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets);
                     console.log('creep [dismantler] ' + creep.name + ' delivered his carry of ' + creep.carry.energy + ' to '+ targets);
                }
            } /*else {  TODO maybe use this again
                if(creep.transfer(Game.getObjectById(storageID), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(storageID));
                     
                }
            } */
        }
        //##################################
        
    }
};

module.exports = roleDismantler;



//########################## HELPING FUNCTIONS
// to dismantle
function dismantle(creep,targetID) {
    var target = Game.getObjectById(targetID);
    //console.log('dismantler ' + target);
    creep.moveTo(target);
    if(target) {
        //console.log('builder '+creep.name+' wants to dismantle '+target);
        if(creep.carry.energy < creep.carryCapacity) {
            if(creep.dismantle(target) == ERR_NOT_IN_RANGE) {
                //creep.moveTo(target);
                //console.log('');
            } else {
                //creep.dismantle(target);
            }
        } else {
            console.log('dismantle returns');
            return;
        }
    } else { // if the target doesnt exist anymore
        //console.log('cant dismantle: ' + target + ' doesnt exist anymore');
        // TODO: delete from list!
        return;
    }
} 