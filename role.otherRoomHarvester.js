var idlePosX = 20;
var idlePosY = 17;

var roleOtherRoomHarvester = {

    /** @param {Creep} creep **/
    
    run: function(creep, sourceID, storageID, toNextRoom, toSpawnToom) {
        
        var toNextFlag = Game.flags[toNextRoom];
        var toSpawnFlag = Game.flags[toSpawnToom];
        
        if(creep.room == Game.spawns.Koblach.room) {
            //find container to store energy in
            if(creep.carry.energy != 0) {
                var bigStore = Game.getObjectById(storageID);
                if(creep.transfer(bigStore, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
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
            
            if(creep.carry.energy < creep.carryCapacity) {
                var source = Game.getObjectById(sourceID);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
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


module.exports = roleOtherRoomHarvester;