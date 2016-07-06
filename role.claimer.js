var idlePosX = 20;
var idlePosY = 17;

var roleClaimer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.room == Game.spawns.Koblach.room) {
            if(creep.pos.x != Game.flags.attackExit.x || creep.pos.y != Game.flags.attackExit.y) {
                creep.moveTo(Game.flags.attackExit);
            } else {
                creep.move(TOP);
            }
        } else {
            var toBuild = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if(creep.build(toBuild) == ERR_NOT_IN_RANGE) {
                creep.moveTo(toBuild);
            }
        
        }
    }
};

module.exports = roleClaimer;