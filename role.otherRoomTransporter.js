;var idlePosX = 20;
var idlePosY = 17;

var roleOtherRoomTransporter = {

    /** @param {Creep} creep **/
    
    run: function(creep, toNextRoom, toSpawnToom, storeID, contID) {
        
        var toNextFlag = Game.flags[toNextRoom];
        var toSpawnFlag = Game.flags[toSpawnToom];
        

        if(creep.room == Game.spawns.Koblach.room) {
            
            if(creep.carry.energy == 0) {
                var bigStore = Game.getObjectById(storeID);
                if(bigStore.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(bigStore)
                }
            //go to other room
            } else {
                if(creep.pos.x != toNextFlag.x || creep.pos.y != toNextFlag.y) {
                    creep.moveTo(toNextFlag);
                } else {
                    creep.move(LEFT);
                }
            }
         
        //creep is in other room   
        } else {
            
            if(creep.carry.energy != 0) {
                //HIER UMSCHREIBEN IN EINZELNE IF-bedingung um mehrere objekte auszuschließen (liste der targets der anderen transporter wenn ziel kapazität überschreiten würde)
                var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                                filter: (structure) => {
                                    return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                                }, algorithm:'dijkstra'});  
                  
                if(target != undefined) {   
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                } else {
                    var closestArray = [];
                    for(var i = 0; i < contID.length; ++i) {
                        var container = Game.getObjectById(contID[i]); 
                        if(container.store[RESOURCE_ENERGY] < container.storeCapacity) 
                            closestArray[closestArray.length] = container;
                    }
                    if(closestArray.length > 0) {
                        var closest = creep.pos.findClosestByRange(closestArray);
                        if(closest.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(closest);
                        }
                        
                    }
                }
            //walk back
            } else {
                 if(creep.pos.x != toSpawnFlag.x || creep.pos.y != toSpawnFlag.y) {
                    creep.moveTo(toSpawnFlag);
                } else {
                    creep.move(RIGHT);
                }
            }
        }
    }
};


module.exports = roleOtherRoomTransporter;