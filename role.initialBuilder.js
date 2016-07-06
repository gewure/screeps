var idlePosX = 20;
var idlePosY = 17;

var roleInitialBuilder = {

    run: function(creep, toNextRoom, toSpawnToom, storeID) {
        
        var toNextFlag = Game.flags[toNextRoom];
        var toSpawnFlag = Game.flags[toSpawnToom];

        if(creep.room == Game.spawns.Koblach.room) {
            //find container to store energy in
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
                var constr = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                if(creep.build(constr) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constr);
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

module.exports = roleInitialBuilder;