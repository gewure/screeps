var idlePosX = 20;
var idlePosY = 17;

var roleOtherRoomHarvester = {

    /** @param {Creep} creep **/
    
    run: function(creep, sourceID, storageID) {
        if(creep.room == Game.spawns.Koblach.room) {
            //find container to store energy in
            if(creep.carry.energy != 0) {
                var bigStore = Game.getObjectById(storageID);
                if(creep.transfer(bigStore, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(bigStore)
                }
            //go to other room
            } else {
                if(creep.pos.x != Game.flags.harvesterEntrance.x || creep.pos.y != Game.flags.harvesterEntrance.y) {
                    creep.moveTo(Game.flags.harvesterEntrance);
                } else {
                    creep.move(LEFT);
                }
            }
         
        //creep is in other room   
        } else {
            
            if(creep.carry.energy < creep.carryCapacity) {
                var source = Game.getObjectById(sourceID);
                creep.say('harvest');
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            //walk back
            } else {
                 if(creep.pos.x != Game.flags.harvesterExit.x || creep.pos.y != Game.flags.harvesterExit.y) {
                    creep.moveTo(Game.flags.harvesterExit);
                } else {
                    creep.move(RIGHT);
                }
            }
        }
    }
};


module.exports = roleOtherRoomHarvester;