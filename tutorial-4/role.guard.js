
var roleCollector = { };

//###################helping functions 

function getHealer(creep, hostileCreeps) {
    //if hostile creeps are found inside the room
    var healer = undefined;
    for(var i = 0; i < hostileCreeps.length; ++i) {
        var healParts = getActiveBodyPartCount(hostileCreeps[i], HEAL);
        if(healParts > 0) {
            healer = [hostileCreeps[i], healParts]; 
            break;
        }
    }
    return healer;
}

function patrol(creep) {
    
    while(!fightMode) {
        creep.moveTo(21,23);
        creep.moveTo(34,31);
        creep.moveTo(37,10);
    }
    return;
}

module.exports = roleGuard;