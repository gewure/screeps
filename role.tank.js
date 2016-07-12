
 var idlePosX = 20;
var idlePosY = 17;

var roleTank = {

    /** @param {Creep} creep **/
    run: function(creep) {
        targetRoom = 'E39S21';
        if(creep.room.name == targetRoom) {
            //what to do if creep has entered the target room
            
            var idlePos = new RoomPosition(0, 0, targetRoom);
            if(!creep.pos.isNearTo(idlePos)) {
                creep.moveTo(idlePos);
            }
            
        //move to room...
        } else {
            if(creep.room == Game.spawns.Koblach.room) {
                if(creep.pos.x != Game.flags.attackExit.x || creep.pos.y != Game.flags.attackExit.y) {
                    creep.moveTo(Game.flags.attackExit);
                } else {
                    creep.move(TOP);
                }
            } else if(creep.room.name == 'E39S23') {
                creep.moveTo(14,11);
                
                if(creep.pos.x != Game.flags.attackExit2.x || creep.pos.y != Game.flags.attackExit2.y) {
                    creep.moveTo(Game.flags.attackExit2);
                } else {
                    creep.move(TOP);
                }
            } else if(creep.room.name == 'E39S22') {
                if(creep.pos.x != Game.flags.attackExit3.x || creep.pos.y != Game.flags.attackExit3.y) {
                    creep.moveTo(Game.flags.attackExit3);
                } else {
                    creep.move(TOP);
                }
            }
        }
    }
};

module.exports = roleTank;