var roleFixer = {

    run: function(creep) {

        for(var name in Game.creeps) {
            if(creep.energy < creep.energyCapacity) {
                var containers = creep.room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_CONTAINER }});
                var repairs = _.filter(Game.creeps, (creep) => (creep.memory.role == 'repairer' && creep.energy < creep.energyCapacity));
                if(containers.transfer(repairs[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containers[0]);
                }
            }

            else {
                var structs = creep.room.find(FIND_MY_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax
                });

                structs.sort((a,b) => a.hits - b.hits);

                if(structs.length > 0) {
                    if(creep.repair(structs[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(structs[0]);
                    }
                }
            }
        }
    }
};

module.exports = roleFixer;