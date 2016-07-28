var idlePosX = 43;
var idlePosY = 34;

var roleClaimer = {
    
   

    /** @param {Creep} creep **/
    run: function(creep, claimTargetFlag) {
        
         if(creep.ticktoLive == 50) {
            Game.spawns.Leningrad.createCreep([MOVE, CLAIM], undefined, {role:'claimer'});
         }
        
        if(creep.room == Game.spawns.ImNoobPlzDontKill.room) {

            if(!creep.pos.isNearTo(Game.flags[claimTargetFlag])) {
                creep.moveTo(Game.flags[claimTargetFlag]);
            }
        } else {
             if(!creep.pos.isNearTo(Game.flags[claimTargetFlag])) {
                creep.moveTo(Game.flags[claimTargetFlag]);
            } else {
                creep.say('claim!');
                //var contr = creep.room.find(STRUCTURE_CONTROLLER);
                var contr = Game.getObjectById('55db34b5efa8e3fe66e06068');
               if(creep.reserveController(contr) == ERR_NOT_IN_RANGE) {
                   creep.moveTo(contr);
               }
            }
            
            
            /*
            var toBuild = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if(creep.build(toBuild) == ERR_NOT_IN_RANGE) {
                creep.moveTo(toBuild); */
        
        }
    }
};

module.exports = roleClaimer;