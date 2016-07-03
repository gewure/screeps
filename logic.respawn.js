//implementieren: wenn genug ressourcen vorhanden und nichts zu tun, ersetzte kleine durch größere creeps
var roles = [];
var maxCreepsPerRole = [];
var creepBodyParts = [];

var maxRespawnTick = 1;
var containerHarvesterPreRespawnTicks = 60;

var logicRespawn = {
    run: function(rol, maxPerRole, bodyParts) {
        roles = rol; 
        maxCreepsPerRole = maxPerRole; 
        creepBodyParts = bodyParts;
        checkForRespawn();
        spawnCreeps();
    }
};

function spawnCreeps() {
    if(Memory.nextCreep != undefined && canCreepSpawn(Memory.nextCreep)) {
        var creepName = Game.spawns.Koblach.createCreep(creepBodyParts[roleToArrayIndex(Memory.nextCreep)], undefined, {role: Memory.nextCreep, prevX: 0, prevY: 0});
        Memory.nextCreep = undefined;
    }
}

function canCreepSpawn(role) {

    var cost = creepCost(creepBodyParts[roleToArrayIndex(role)]);
    if(role == 'containerHarvesterNorth' || role == 'transporter') {  //HIER MEHR ROLLEN EINFÜGEN FÜR PRE-SPAWN (||)
        if(Game.spawns.Koblach.room.energyAvailable >= cost && !Game.spawns.Koblach.spawning && getLivingCreeps(role) <= maxCreepsPerRole[roleToArrayIndex(role)]) {
            return true;
        } else return false;
    } else {
        if(Game.spawns.Koblach.room.energyAvailable >= cost && !Game.spawns.Koblach.spawning && getLivingCreeps(role) < maxCreepsPerRole[roleToArrayIndex(role)]) {
            return true;
        } else return false;
    }
}

function checkForRespawn() {

    for(var i = 0; i < roles.length; ++i) {

        var nearDead = getLivingCreepsNearDead(roles[i], containerHarvesterPreRespawnTicks);

        if(nearDead.length > 0 && (roles[i] == 'containerHarvester' || roles[i] == 'transporter')) {
            Memory.nextCreep = roles[i];
            break;
        } else {
            var found = false;
            for(var i = 0; i < roles.length; ++i) {
                if(getLivingCreeps(roles[i]) < maxCreepsPerRole[i]) {
                    Memory.nextCreep = roles[i];
                    found = true;
                    break;
                }
            }
        }
        if(found) break;
    }
}

function getLivingCreeps(role) {
    var cr = _.filter(Game.creeps, (creep) => creep.memory.role == role);
    return cr.length;
}

function getLivingCreepsNearDead(role, ticksRemaining) {
    var cr = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.ticksToLive <= ticksRemaining);
    return cr;
}

function roleToArrayIndex(role) {
    for(var i = 0; i < roles.length; ++i) {
        if(roles[i] == role)
            return i;
    }
}

function creepCost(bodyArray) {
    var buildCost = 0;
    for(var index = 0; index < bodyArray.length; ++index) {
        var bodypart = bodyArray[index];
        switch(bodypart) {
            case MOVE: case CARRY: buildCost+=50; break;
            case WORK: buildCost+=100; break;
            case HEAL: buildCost+=250; break;
            case TOUGH: buildCost+=10; break;
            case ATTACK: buildCost+=80; break;
            case RANGED_ATTACK: buildCost+=150; break;
            case CLAIM: buildCost+=600; break;
        }
    }
    return buildCost;
}
module.exports = logicRespawn;